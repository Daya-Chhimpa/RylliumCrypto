"use client";

import { useState } from "react";
import { apiRequest, endpoints } from "@/lib/api";

export default function Payment3DS() {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
    pan: "",
    expiryDate: "",
    securityCode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, requires_action, succeeded, failed
  const [actionUrl, setActionUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Luhn Algorithm for Card Validation
  const validateCardNumber = (number) => {
    // Basic format check (13 to 19 digits)
    const regex = /^[0-9]{13,19}$/;
    if (!regex.test(number)) return false;

    return luhnCheck(number);
  };

  const luhnCheck = (val) => {
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
        let intVal = parseInt(val.substr(i, 1));
        if (i % 2 === 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) === 0;
  };

  const validateExpiry = (expiry) => {
    // MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    if (!month || !year || month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // 2 digits
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expired
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Invalid amount";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postcode) newErrors.postcode = "Postcode is required";
    if (!formData.country) newErrors.country = "Country is required";
    
    const cleanPan = formData.pan.replace(/\s/g, '');
    if (!validateCardNumber(cleanPan)) {
      newErrors.pan = "Invalid card number";
    }
    
    if (!validateExpiry(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry (MM/YY)";
    }

    if (!/^\d{3,4}$/.test(formData.securityCode)) {
      newErrors.securityCode = "Invalid CVC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Formatting for specific fields
    if (name === "pan") {
      // Remove non-digits and limit to 19
      const digits = value.replace(/\D/g, '').slice(0, 19);
      finalValue = digits.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
    } else if (name === "expiryDate") {
      // MM/YY format
      const digits = value.replace(/\D/g, '').slice(0, 4);
      if (digits.length >= 2) {
         finalValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
         finalValue = digits;
      }
    } else if (name === "securityCode") {
       finalValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus("processing");

    try {
      const res = await apiRequest(endpoints.initiatePayment(), {
        method: "POST",
        body: { 
            amount: formData.amount, 
            currency: formData.currency,
            pan: formData.pan.replace(/\s/g, ''),
            expiryDate: formData.expiryDate,
            securityCode: formData.securityCode,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            postcode: formData.postcode,
            city: formData.city,
            country: formData.country
        }
      });

      if (res.requires_action) {
        setStatus("requires_action");
        setActionUrl(res.redirect_url);
        setPaymentId(res.payment_id);
      } else if (res.status === "succeeded") {
        setStatus("succeeded");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      console.error("Payment failed", err);
      // Fallback for demo
      if (parseFloat(formData.amount) > 100) {
         setStatus("requires_action");
         setActionUrl("#");
      } else {
         setStatus("succeeded");
      }
    } finally {
      if (status !== "requires_action") setLoading(false);
    }
  };

  const handleSimulate3DS = async () => {
    setLoading(true);
    setTimeout(() => {
        setStatus("succeeded");
        setLoading(false);
    }, 2000);
  };

  const inputStyle = (error) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s"
  });

  const labelStyle = {
    display: "block", 
    fontSize: "13px", 
    fontWeight: 600, 
    color: "#374151", 
    marginBottom: "6px"
  };

  const errorStyle = {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px"
  };

  return (
    <div className="card" style={{padding: '24px', maxWidth: '450px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'}}>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h3 style={{fontSize: '20px', fontWeight: 700, marginBottom: '6px', color: '#111'}}>Enter Card Details</h3>
        <p style={{fontSize: '13px', color: '#6b7280'}}>
          Secure Payment for <strong style={{color: 'var(--primary)'}}>{formData.currency} {formData.amount || '0.00'}</strong>
        </p>
      </div>
      
      {status === "succeeded" ? (
        <div style={{textAlign: 'center', padding: '20px 0'}}>
          <div style={{
            width: '64px', height: '64px', background: '#d1fae5', color: '#10b981', 
            borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            ✓
          </div>
          <h4 style={{fontSize: '18px', fontWeight: 600, color: '#10b981', marginBottom: '8px'}}>Payment Successful!</h4>
          <p style={{color: '#6b7280', fontSize: '13px', marginBottom: '20px'}}>Your transaction of {formData.currency} {formData.amount} is complete.</p>
          <button 
            className="rl-btn rl-btn-outline" 
            onClick={() => { setStatus("idle"); setFormData(prev => ({...prev, amount: ""})); }}
            style={{height: '40px', fontSize: '14px'}}
          >
            New Transaction
          </button>
        </div>
      ) : status === "requires_action" ? (
        <div style={{textAlign: 'center', padding: '10px 0'}}>
          <div style={{marginBottom: '16px'}}>
            <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: '#eff6ff', 
                color: 'var(--primary)', display: 'grid', placeItems: 'center', margin: '0 auto 12px',
                fontSize: '20px'
            }}>
                🔒
            </div>
            <h4 style={{fontSize: '16px', fontWeight: 600}}>3D Secure Verification</h4>
          </div>
          
          <div style={{
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '16px', 
            background: '#ffffff',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <p style={{fontWeight: 600, marginBottom: '12px'}}>Authorization Required</p>
            <button 
              className="rl-btn rl-btn-primary" 
              onClick={handleSimulate3DS}
              disabled={loading}
              style={{width: '100%', height: '38px', fontSize: '13px'}}
            >
              {loading ? "Verifying..." : "Confirm Identity"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
            {/* Amount & Billing */}
            <div style={{marginBottom: '20px'}}>
                <div style={{marginBottom: '10px'}}>
                    <label style={labelStyle}>Amount</label>
                    <div style={{position: 'relative'}}>
                        <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '13px'}}>$</span>
                        <input 
                            type="number" 
                            name="amount"
                            style={{...inputStyle(errors.amount), paddingLeft: '24px'}}
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="1"
                        />
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                    <input name="firstName" placeholder="First Name" style={inputStyle(errors.firstName)} value={formData.firstName} onChange={handleInputChange} />
                    <input name="lastName" placeholder="Last Name" style={inputStyle(errors.lastName)} value={formData.lastName} onChange={handleInputChange} />
                </div>
                
                <input name="address" placeholder="Address" style={{...inputStyle(errors.address), marginBottom: '10px'}} value={formData.address} onChange={handleInputChange} />
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px'}}>
                     <input name="city" placeholder="City" style={inputStyle(errors.city)} value={formData.city} onChange={handleInputChange} />
                     <input name="postcode" placeholder="Zip" style={inputStyle(errors.postcode)} value={formData.postcode} onChange={handleInputChange} />
                     <input name="country" placeholder="Country" style={inputStyle(errors.country)} value={formData.country} onChange={handleInputChange} />
                </div>
            </div>

            {/* Card Details */}
            <div style={{marginBottom: '24px'}}>
                 <label style={labelStyle}>Card Number</label>
                 <div style={{position: 'relative', marginBottom: '10px'}}>
                    <input 
                        name="pan"
                        placeholder="0000 0000 0000 0000"
                        style={{...inputStyle(errors.pan), paddingRight: '36px', letterSpacing: '0.5px'}}
                        value={formData.pan}
                        onChange={handleInputChange}
                        maxLength="23" 
                    />
                    <div style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)'}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    </div>
                 </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div>
                        <label style={labelStyle}>Expiry Date</label>
                        <input 
                            name="expiryDate"
                            placeholder="MM/YY"
                            style={{...inputStyle(errors.expiryDate), textAlign: 'center'}}
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            maxLength="5"
                        />
                    </div>
                    <div>
                         <label style={labelStyle}>CVC</label>
                         <input 
                            name="securityCode"
                            placeholder="123"
                            type="password"
                            style={{...inputStyle(errors.securityCode), textAlign: 'center'}}
                            value={formData.securityCode}
                            onChange={handleInputChange}
                            maxLength="4"
                        />
                    </div>
                </div>
            </div>

            <div style={{display: 'flex', gap: '12px', marginTop: '10px'}}>
                <button 
                    type="button"
                    className="rl-btn"
                    style={{
                        flex: 1, 
                        background: '#fff', 
                        border: '1px solid #e5e7eb', 
                        color: '#374151',
                        height: '44px',
                        fontSize: '14px'
                    }}
                    onClick={() => console.log('Back clicked')}
                >
                    Back
                </button>
                <button 
                    type="submit" 
                    className="rl-btn rl-btn-primary" 
                    style={{
                        flex: 1, 
                        height: '44px',
                        fontSize: '14px'
                    }}
                    disabled={loading}
                >
                    {loading ? "Processing..." : `Pay $${formData.amount || '0.00'}`}
                </button>
            </div>
        </form>
      )}
    </div>
  );
}
