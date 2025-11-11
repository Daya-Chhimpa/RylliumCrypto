"use client";

import ExchangeForm from "@/components/ExchangeForm";
import { FaChartLine, FaWallet, FaExchangeAlt, FaShieldAlt } from "react-icons/fa";

export default function DashboardHome() {
  return (
    <div className="rl-content" style={{maxWidth: '1400px', margin: '0 auto'}}>
      {/* Hero Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        marginBottom: 32
      }}
      className="dashboard-cards">
        <div style={{
          padding: '28px 24px',
          background: 'linear-gradient(135deg, #4c40f7 0%, #6366f1 100%)',
          borderRadius: '20px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(76, 64, 247, 0.3)'
        }}>
          <div style={{position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.1}}>
            <FaWallet />
          </div>
          <div style={{fontSize: 13, opacity: 0.9, marginBottom: 8, fontWeight: 600, position: 'relative', zIndex: 1}}>TOTAL BALANCE</div>
          <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4, position: 'relative', zIndex: 1}}>$24,567.89</div>
          <div style={{fontSize: 13, opacity: 0.9, position: 'relative', zIndex: 1}}>+12.5% this month ↗</div>
        </div>
        
        <div style={{
          padding: '28px 24px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 4px 20px rgba(76, 64, 247, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05, color: '#4c40f7'}}>
            <FaExchangeAlt />
          </div>
          <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, position: 'relative', zIndex: 1}}>ACTIVE ORDERS</div>
          <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', zIndex: 1}}>15</div>
          <div style={{fontSize: 13, color: 'var(--muted)', position: 'relative', zIndex: 1}}>3 pending verification</div>
        </div>
        
        <div style={{
          padding: '28px 24px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 4px 20px rgba(76, 64, 247, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05, color: '#4c40f7'}}>
            <FaChartLine />
          </div>
          <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, position: 'relative', zIndex: 1}}>24H VOLUME</div>
          <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', zIndex: 1}}>$8.4K</div>
          <div style={{fontSize: 13, color: 'var(--muted)', position: 'relative', zIndex: 1}}>+8.2% from yesterday</div>
        </div>
      </div>

      {/* Security Status - Full Width */}
      <div style={{marginBottom: 32}}>
        <div style={{
          padding: '28px 24px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 4px 20px rgba(76, 64, 247, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05, color: '#4c40f7'}}>
            <FaShieldAlt />
          </div>
          <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, position: 'relative', zIndex: 1}}>SECURITY STATUS</div>
          <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', zIndex: 1}}>100%</div>
          <div style={{fontSize: 13, color: 'var(--muted)', position: 'relative', zIndex: 1}}>All systems secured</div>
        </div>
      </div>

      {/* Exchange Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(76, 64, 247, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(76, 64, 247, 0.1)'
      }}>
        <h2 style={{fontSize: '28px', fontWeight: 800, marginBottom: '8px'}}>
          <span style={{background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Exchange</span> Crypto
        </h2>
        <p style={{color: 'var(--muted)', fontSize: '15px', marginBottom: '24px'}}>Trade with confidence using our secure and fast platform</p>
        <ExchangeForm />
      </div>
    </div>
  );
}


