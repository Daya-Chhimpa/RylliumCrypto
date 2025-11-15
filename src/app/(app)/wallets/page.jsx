"use client";

export default function WalletsPage() {
  const wallets = [
    { id: 1, name: "Bitcoin Wallet", balance: "0.00234 BTC", usdValue: "$245.50", icon: "₿", gradient: "linear-gradient(135deg, #f7931a 0%, #ff9800 100%)" },
    { id: 2, name: "Ethereum Wallet", balance: "1.543 ETH", usdValue: "$5,320.75", icon: "Ξ", gradient: "linear-gradient(135deg, #627eea 0%, #8b9dc3 100%)" },
    { id: 3, name: "Solana Wallet", balance: "45.28 SOL", usdValue: "$7,940.32", icon: "◎", gradient: "linear-gradient(135deg, #14f195 0%, #9945ff 100%)" },
  ];

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Your <span>wallets</span></h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 20 }}>
        {wallets.map((wallet) => (
          <div key={wallet.id} className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-icon" style={{ background: wallet.gradient }}>
                {wallet.icon}
              </div>
              <div className="wallet-info">
                <div className="wallet-name">{wallet.name}</div>
                <div className="wallet-label">CRYPTO WALLET</div>
              </div>
            </div>
            
            <div className="wallet-balance">
              <div className="wallet-amount">{wallet.balance}</div>
              <div className="wallet-usd">{wallet.usdValue} USD</div>
            </div>

            <div className="wallet-actions">
              <button className="rl-btn rl-btn-primary" style={{ flex: 1 }}>Send</button>
              <button className="rl-btn rl-btn-outline" style={{ flex: 1 }}>Receive</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .wallet-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .wallet-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .wallet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .wallet-card:hover::before {
          opacity: 1;
        }

        .wallet-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .wallet-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .wallet-info {
          flex: 1;
        }

        .wallet-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 4px;
        }

        .wallet-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          letter-spacing: 0.5px;
        }

        .wallet-balance {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .wallet-amount {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }

        .wallet-usd {
          font-size: 14px;
          font-weight: 500;
          color: var(--muted);
        }

        .wallet-actions {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .wallet-card {
            padding: 20px;
          }

          .wallet-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .wallet-name {
            font-size: 16px;
          }

          .wallet-amount {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}


