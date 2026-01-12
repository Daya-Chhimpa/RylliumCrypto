"use client";

import { useEffect, useState } from "react";
import { FaBitcoin, FaEthereum, FaWallet } from "react-icons/fa";
import { SiCardano, SiXrp } from "react-icons/si";

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: <FaBitcoin color="#f7931a" /> },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: <FaEthereum color="#627eea" /> },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: <FaWallet color="#00FFA3" /> },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: <SiCardano color="#0033ad" /> },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', icon: <SiXrp color="#23292f" /> },
];

export default function LivePrices() {
  const [prices, setPrices] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = COINS.map(c => c.id).join(',');
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPrices(data);
        setError(false);
      } catch (err) {
        console.error("Price fetch error:", err);
        setError(true);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // 15s to avoid rate limits
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="card" style={{padding: '24px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '16px'}}>Live Market</h3>
        <p style={{color: 'var(--muted)', fontSize: '14px'}}>Market data currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{padding: '0', overflow: 'hidden'}}>
      <div style={{padding: '24px 24px 12px'}}>
         <h3 style={{fontSize: '18px', fontWeight: 700}}>Live Market (Mock - CoinGecko)</h3>
      </div>
      <div className="live-prices-list">
        {COINS.map((coin) => {
          const coinData = prices[coin.id];
          const price = coinData?.usd;
          const change = coinData?.usd_24h_change;
          const isPositive = change >= 0;

          return (
            <div key={coin.id} style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              transition: 'background 0.2s'
            }}
            className="price-row"
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{fontSize: '24px'}}>{coin.icon}</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '15px'}}>{coin.name}</div>
                  <div style={{color: 'var(--muted)', fontSize: '13px'}}>{coin.symbol}</div>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: 600, fontSize: '15px'}}>
                  {price ? `$${price.toLocaleString()}` : 'Loading...'}
                </div>
                {change !== undefined && (
                   <div style={{
                     fontSize: '13px', 
                     fontWeight: 500,
                     color: isPositive ? '#10b981' : '#ef4444'
                   }}>
                     {isPositive ? '+' : ''}{change.toFixed(2)}%
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{padding: '16px 24px', background: 'rgba(0,0,0,0.02)', fontSize: '12px', color: 'var(--muted)'}}>
        Powered by CoinGecko API
      </div>
      
      <style jsx>{`
        .price-row:last-child { border-bottom: none; }
        .price-row:hover { background: rgba(0,0,0,0.01); }
      `}</style>
    </div>
  );
}
