"use client";

import { FaCheckCircle, FaClock, FaFilter, FaBitcoin } from "react-icons/fa";

export default function OrdersPage() {
  const orders = [
    { id: "ORD-1234566789", crypto: "BTC", type: "Buy", amount: 0.025, usd: 1500, status: "Successful", date: "Nov 03, 2025", time: "14:32", color: '#f7931a' },
    { id: "ORD-1234566790", crypto: "ETH", type: "Sell", amount: 0.5, usd: 500, status: "Successful", date: "Nov 03, 2025", time: "12:15", color: '#627eea' },
    { id: "ORD-1234566791", crypto: "ETH", type: "Buy", amount: 1.2, usd: 2000, status: "Successful", date: "Nov 02, 2025", time: "09:42", color: '#627eea' },
    { id: "ORD-1234566792", crypto: "SOL", type: "Buy", amount: 12.5, usd: 1000, status: "Verification", date: "Nov 01, 2025", time: "16:20", color: '#14f195' },
  ];

  return (
    <div className="rl-content" style={{maxWidth: '1400px'}}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{fontSize: '36px', fontWeight: 800, marginBottom: '8px'}}>
            Your <span style={{background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Orders</span>
          </h1>
          <p style={{color: 'var(--muted)', fontSize: '15px'}}>Track and manage all your crypto orders</p>
        </div>
        <div style={{display: 'flex', gap: 12}}>
          <button className="rl-btn rl-btn-outline" style={{
            padding: '12px 20px',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '14px'
          }}>
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* Orders Grid - 3 Cards Per Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24
      }} className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(76, 64, 247, 0.1)',
            boxShadow: '0 4px 20px rgba(76, 64, 247, 0.08)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(76, 64, 247, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(76, 64, 247, 0.08)';
          }}>
            {/* Background Icon */}
            <div style={{
              position: 'absolute',
              top: -30,
              right: -30,
              fontSize: 140,
              opacity: 0.03,
              color: order.color
            }}>
              <FaBitcoin />
            </div>

            {/* Header */}
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1}}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: `${order.color}15`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 24,
                color: order.color
              }}>
                <FaBitcoin />
              </div>
              <div>
                <div style={{fontSize: 18, fontWeight: 700, marginBottom: 2}}>
                  <span style={{color: order.type === 'Buy' ? '#10b981' : '#ef4444'}}>{order.type}</span> {order.crypto}
                </div>
                <div style={{fontSize: 13, color: 'var(--muted)', fontWeight: 600}}>{order.id}</div>
              </div>
            </div>

            {/* Balance/Amount Section */}
            <div style={{position: 'relative', zIndex: 1}}>
              <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600}}>AMOUNT</div>
              <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4}}>{order.amount} <span style={{fontSize: 18, color: 'var(--muted)'}}>{order.crypto}</span></div>
              <div style={{fontSize: 16, color: 'var(--muted)', fontWeight: 600}}>${order.usd.toLocaleString()}</div>
            </div>

            {/* Actions - Status and Date */}
            <div style={{display: 'flex', gap: 12, marginTop: 24, position: 'relative', zIndex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{
                background: order.status === 'Successful' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-block'
              }}>
                {order.status}
              </span>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: 12, color: 'var(--muted)', fontWeight: 600}}>{order.date}</div>
                <div style={{fontSize: 11, color: 'var(--muted)'}}>{order.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


