export default function WalletsPage() {
  const wallets = [1, 2, 3];

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Your <span>wallets</span></h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 12 }}>
        {wallets.map((w) => (
          <div key={w} className="card" style={{ borderRadius: 20, padding: 22 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>CRYPTO WALLET</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 18 }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3z"/>
                <path d="M17 9V7a2 2 0 0 0-2-2H3v4"/>
                <circle cx="17" cy="12" r="1"/>
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="rl-btn rl-btn-dark" style={{ width: 120 }}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


