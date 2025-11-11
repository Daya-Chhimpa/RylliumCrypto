"use client";

import { FaBitcoin, FaEthereum, FaPlus, FaCoins } from "react-icons/fa";

export default function WalletsPage() {
  const wallets = [
    { name: 'Bitcoin Wallet', symbol: 'BTC', balance: '0.0234', usd: '$2,601.09', icon: FaBitcoin, color: '#f7931a' },
    { name: 'Ethereum Wallet', symbol: 'ETH', balance: '1.45', usd: '$5,002.86', icon: FaEthereum, color: '#627eea' },
    { name: 'Solana Wallet', symbol: 'SOL', balance: '45.2', usd: '$7,928.08', icon: FaCoins, color: '#14f195' },
  ];

  return (
    <div className="rl-content" style={{maxWidth: '1400px', margin: '0 auto'}}>
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
            Your <span style={{background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Wallets</span>
          </h1>
          <p style={{color: 'var(--muted)', fontSize: '15px'}}>Manage your crypto wallets securely</p>
        </div>
        <button className="rl-btn rl-btn-primary" style={{
          padding: '12px 24px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '15px'
        }}>
          <FaPlus /> Add Wallet
        </button>
      </div>

      {/* Wallets Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24
      }}
      className="wallets-grid">
        {wallets.map((wallet, idx) => {
          const Icon = wallet.icon;
          return (
            <div key={idx} style={{
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
                color: wallet.color
              }}>
                <Icon />
              </div>

              {/* Header */}
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1}}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: `${wallet.color}15`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 24,
                  color: wallet.color
                }}>
                  <Icon />
                </div>
                <div>
                  <div style={{fontSize: 18, fontWeight: 700, marginBottom: 2}}>{wallet.name}</div>
                  <div style={{fontSize: 13, color: 'var(--muted)', fontWeight: 600}}>{wallet.symbol}</div>
                </div>
              </div>

              {/* Balance */}
              <div style={{position: 'relative', zIndex: 1}}>
                <div style={{fontSize: 13, color: 'var(--muted)', marginBottom: 8, fontWeight: 600}}>BALANCE</div>
                <div style={{fontSize: 32, fontWeight: 800, marginBottom: 4}}>{wallet.balance} <span style={{fontSize: 18, color: 'var(--muted)'}}>{wallet.symbol}</span></div>
                <div style={{fontSize: 16, color: 'var(--muted)', fontWeight: 600}}>{wallet.usd}</div>
              </div>

              {/* Actions */}
              <div style={{display: 'flex', gap: 12, marginTop: 24, position: 'relative', zIndex: 1}}>
                <button className="rl-btn rl-btn-primary" style={{flex: 1, padding: '10px', height: 'auto', fontSize: '14px'}}>Send</button>
                <button className="rl-btn rl-btn-outline" style={{flex: 1, padding: '10px', height: 'auto', fontSize: '14px'}}>Receive</button>
              </div>
            </div>
          );
        })}

        {/* Add New Wallet Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(76, 64, 247, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
          borderRadius: '24px',
          padding: '32px',
          border: '2px dashed rgba(76, 64, 247, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: 280
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 64, 247, 0.06) 0%, rgba(99, 102, 241, 0.06) 100%)';
          e.currentTarget.style.borderColor = 'rgba(76, 64, 247, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(76, 64, 247, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)';
          e.currentTarget.style.borderColor = 'rgba(76, 64, 247, 0.2)';
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 24,
            color: '#fff',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(76, 64, 247, 0.25)'
          }}>
            <FaPlus />
          </div>
          <div style={{fontSize: 18, fontWeight: 700, marginBottom: 8}}>Add New Wallet</div>
          <div style={{fontSize: 14, color: 'var(--muted)', textAlign: 'center'}}>Connect a new crypto wallet to your account</div>
        </div>
      </div>
    </div>
  );
}


