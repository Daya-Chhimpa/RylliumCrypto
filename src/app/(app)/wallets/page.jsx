"use client";
import { useEffect, useState } from "react";
import { getWallets, createWallet } from "@/lib/walletService";
import { showLoader, hideLoader, addToast } from "@/store/slices/uiSlice";
import { useDispatch } from "react-redux";

export default function WalletsPage() {
  const dispatch = useDispatch();
  const [wallets, setWallets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWallet, setNewWallet] = useState({ address: "", chain: "ETH" });

  const fetchWallets = async () => {
    try {
      const res = await getWallets();
      if (res && (res.wallets || Array.isArray(res))) {
        setWallets(res.wallets || res);
      }
    } catch (e) {
      console.error(e);
      dispatch(addToast({ type: "error", title: "Error", description: "Failed to fetch wallets" }));
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newWallet.address || newWallet.address.length < 5) {
      dispatch(addToast({ type: "error", title: "Invalid Address", description: "Please enter a valid wallet address" }));
      return;
    }

    try {
      dispatch(showLoader());
      await createWallet(newWallet);
      dispatch(addToast({ type: "success", title: "Success", description: "Wallet added successfully" }));
      setShowModal(false);
      setNewWallet({ address: "", chain: "ETH" });
      await fetchWallets();
    } catch (e) {
      dispatch(addToast({ type: "error", title: "Error", description: e.message || "Failed to create wallet" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  const getGradient = (network) => {
    if(!network) return "linear-gradient(135deg, #627eea 0%, #8b9dc3 100%)";
    const n = network.toLowerCase();
    if(n.includes("btc") || n.includes("bitcoin")) return "linear-gradient(135deg, #f7931a 0%, #ff9800 100%)";
    if(n.includes("eth")) return "linear-gradient(135deg, #627eea 0%, #8b9dc3 100%)";
    if(n.includes("sol")) return "linear-gradient(135deg, #14f195 0%, #9945ff 100%)";
    if(n.includes("usdt")) return "linear-gradient(135deg, #26A17B 0%, #009393 100%)";
    return "linear-gradient(135deg, #888 0%, #444 100%)";
  };
  
  const getIcon = (network) => {
      if(!network) return "Ξ";
      const n = network.toLowerCase();
      if(n.includes("btc")) return "₿";
      if(n.includes("eth")) return "Ξ";
      if(n.includes("sol")) return "◎";
      if(n.includes("usdt")) return "$";
      return "$";
  }

  return (
    <div className="rl-content">
      <div className="rl-header-group">
          <h1 className="rl-page-title">Add Your <span>External wallet</span></h1>
          <button className="rl-btn rl-btn-primary desktop-btn" onClick={() => setShowModal(true)}>+ Add Wallet</button>
      </div>

      <div className="wallets-grid">
        {wallets.length === 0 ? (
          <div className="empty-state">
            <p>No wallets found.</p>
            <button className="rl-btn rl-btn-primary" onClick={() => setShowModal(true)}>Create your first wallet</button>
          </div>
        ) : wallets.map((wallet) => (
          <div key={wallet.id || wallet._id} className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-icon" style={{ background: getGradient(wallet.network || wallet.currency || "ETH") }}>
                {getIcon(wallet.network || wallet.currency || "ETH")}
              </div>
              <div className="wallet-info">
                <div className="wallet-name">{wallet.name || wallet.walletAddress || "Unknown Wallet"}</div>
                <div className="wallet-label">{wallet.network || "CRYPTO"} WALLET</div>
              </div>
            </div>
            
            <div className="wallet-balance">
              <div className="wallet-amount">{wallet.balance ? parseFloat(wallet.balance).toFixed(6) : "0.00"}</div>
              <div className="wallet-usd">{wallet.usdBalance ? `$${wallet.usdBalance}` : "0.00 USD"}</div>
            </div>

            <div className="wallet-actions">
              <button className="rl-btn rl-btn-primary" style={{ flex: 1 }}>Send</button>
              <button className="rl-btn rl-btn-outline" style={{ flex: 1 }}>Receive</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Floating Action Button */}
      <button className="rl-fab mobile-btn" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <div className="modal-overlay">
            <div className="modal">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                    <h3>Add Your External wallet</h3>
                    <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'white',fontSize:20,cursor:'pointer'}}>×</button>
                </div>
                <form onSubmit={handleCreateWallet}>
                    <div style={{marginBottom:16}}>
                        <label className="label">Network</label>
                        <select 
                            className="auth-input" 
                            value={newWallet.chain} 
                            onChange={e => setNewWallet({...newWallet, chain: e.target.value})}
                        >
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="SOL">Solana (SOL)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div style={{marginBottom:16}}>
                        <label className="label">Wallet Address</label>
                        <input 
                            className="auth-input" 
                            placeholder="0x..." 
                            value={newWallet.address} 
                            onChange={e => setNewWallet({...newWallet, address: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="rl-btn rl-btn-primary" style={{width:'100%'}}>Add Wallet</button>
                </form>
            </div>
        </div>
      )}

      <style jsx>{`
        .rl-header-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .wallets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          border: 1px dashed var(--card-border);
          gap: 16px;
        }

        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;
            padding: 16px;
        }
        .modal {
            background: var(--card-bg); padding: 24px; border-radius: 16px; width: 100%; max-width: 400px;
            border: 1px solid var(--card-border);
        }
        .label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--text); }
        
        .auth-input {
            height: 44px;
            border: 1px solid var(--card-border);
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            padding: 0 14px;
            width: 100%;
            color: var(--text);
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .auth-input:focus {
            border-color: var(--primary);
        }
        option { background: var(--bg); color: var(--text); }

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

        .wallet-info { flex: 1; overflow: hidden; }
        .wallet-name {
          font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wallet-label { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.5px; }

        .wallet-balance {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .wallet-amount { font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .wallet-usd { font-size: 14px; font-weight: 500; color: var(--muted); }

        .wallet-actions { display: flex; gap: 12px; }

        .rl-fab { display: none; }
        .mobile-btn { display: none; }

        @media (max-width: 768px) {
          .rl-header-group {
             flex-direction: row; 
             flex-wrap: wrap;
             gap: 12px;
          }
          .rl-page-title { font-size: 28px; }
          .wallet-card { padding: 20px; }
          .wallet-icon { width: 48px; height: 48px; font-size: 24px; }
          .wallet-name { font-size: 16px; }
          .wallet-amount { font-size: 20px; }
          
          .desktop-btn { display: none; }
          .rl-fab {
            display: grid;
            place-items: center;
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
            color: white;
            font-size: 28px;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
            border: none;
            z-index: 100;
          }
        }
      `}</style>
    </div>
  );
}
