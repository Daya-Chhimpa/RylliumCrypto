import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

     

      <div className="lp-drawer-overlay" id="drawerOverlay"></div>
      <div className="mobile-drawer" id="mobileDrawer">
        <div className="drawer-header">
          <span className="close-drawer" id="closeDrawer">✕</span>
        </div>
        <nav className="drawer-links">
          <Link href="/">Home</Link>
          <a href="#about">About</a>
          <a href="#why-us">why Us</a>
          <a href="#faqs">FAQs</a>
          <Link href="/signin">Sign In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </nav>
      </div>

      <section className="hero">
        <div className="container hero-content">
          <div className="inline-fl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg><span className="text-sm font-medium text-foreground">Next-Gen Crypto Platform</span></div>
          <h1><span>Welcome to</span> <span className="h1kl">Ryllium </span></h1>
          <p>The most advanced cryptocurrency trading platform designed for the future. Trade, invest, and grow your portfolio with cutting-edge technology and unparalleled security.</p>
          <div className="hero-buttons">
            <Link href="/signin" className="signin">Start Trading</Link>
            <a href="#about" className="btn-secondary">Learn More</a>
          </div>
          <div className="header-features">
            <div className="header-feature">
              <span className="header-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
              </span>
              <h3>Bank-Grade Security</h3>
              <span>Advanced encryption and multi-layer security protocols</span>
            </div>
            <div className="header-feature">
              <span className="header-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
              </span>
              <h3>Lightning Fast</h3>
              <span>Execute trades in milliseconds with our optimized engine</span>
            </div>
            <div className="header-feature">
              <span className="header-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </span>
              <h3>Smart Analytics</h3>
              <span>AI-powered insights to maximize your trading potential</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features abtusS" id="about">
        <div className="container">
          <h2 className="SecHding">About <span>Ryllium</span></h2>
          <p className="subtitle">Founded by crypto pioneers and financial experts, Ryllium represents the next evolution in digital asset trading and blockchain technology.</p>

          <div className="aboutM-us" style={{alignItems:'stretch'}}>
            <div className="abt-content">
              <h2 className="section-subtitle">Our Story</h2>
              <p className="section-text">Ryllium was born from a vision to democratize cryptocurrency trading and make advanced financial tools accessible to everyone. Our team of blockchain engineers, financial analysts, and security experts came together with one mission: to build the most secure, intuitive, and powerful crypto platform ever created.</p>
              <p className="section-text">Since our inception, we've processed multiple transactions, served millions of users worldwide, and maintained a 99.9% uptime record. We're not just a trading platform – we're the foundation for the future of digital finance.</p>
            </div>
            <div className="abt-contentRyt">
              <div className="abtstrz12"><strong>150+</strong><span>Cryptocurrencies</span></div>
              <div className="abtstrz12"><strong>HSMs</strong><span>Bank-grade encryption</span></div>
              <div className="abtstrz12"><strong>VASP</strong><span>Security & Compliance</span></div>
              <div className="abtstrz12"><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>

          <div className="gridAbt">
            <div className="cardAbt">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-8 h-8 text-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Community First</h3>
              <p>We believe in building with our community, not just for them. Every feature is shaped by user feedback.</p>
            </div>

            <div className="cardAbt">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target h-12 w-12 text-primary mb-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>Constantly pushing the boundaries of what's possible in crypto trading and blockchain technology.</p>
            </div>

            <div className="cardAbt">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe w-8 h-8 text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <h3>Global Access</h3>
              <p>Making crypto accessible to everyone, everywhere, with support for 50+ countries and currencies.</p>
            </div>

            <div className="cardAbt">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-8 h-8 text-white">
                  <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                  <circle cx="12" cy="8" r="6"></circle>
                </svg>
              </div>
              <h3>Excellence</h3>
              <p>Committed to delivering the highest quality products and services in the cryptocurrency space.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="why-us">
        <div className="container">
          <h2 className="SecHding">Why Choose<span> Ryllium</span></h2>
          <p className="subtitle">Everything you need to trade, invest, and manage your cryptocurrency portfolio with confidence and ease.</p>
          <div className="grid">
            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-7 h-7 text-white"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
              </div>
              <h3>Instant Deposits & Withdrawals</h3>
              <p>Fund your account instantly with multiple payment methods including bank transfers, cards, and digital wallets.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column w-7 h-7 text-white"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
              </div>
              <h3>Advanced Trading Tools</h3>
              <p>Professional-grade charts, indicators, and analytics to help you make informed trading decisions.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-7 h-7 text-white"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
              </div>
              <h3>Military-Grade Security</h3>
              <p>Cold storage, 2FA, biometric authentication, and insurance coverage for complete peace of mind.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-7 h-7 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support from our team of crypto experts.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-7 h-7 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Copy Trading</h3>
              <p>Follow and copy successful traders automatically. Learn from the best while you earn.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down w-7 h-7 text-white"><path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path></svg>
              </div>
              <h3>DeFi Integration</h3>
              <p>Access decentralized finance protocols directly from your Ryllium account for yield farming and staking.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins w-7 h-7 text-white"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m16.71 13.88.7.71-2.82 2.82"></path></svg>
              </div>
              <h3>150+ Cryptocurrencies</h3>
              <p>Trade Bitcoin, Ethereum, and hundreds of altcoins with competitive fees and deep liquidity.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-7 h-7 text-white"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3>Institutional Grade</h3>
              <p>API access, OTC trading, and white-label solutions for businesses and institutional investors.</p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-12 w-12 mb-6 text-accent"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3>Low Fees</h3>
              <p>Competitive trading fees starting from just 0.1% with volume discounts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaGOTQST">
        <div className="about-header">
          <h2 className="SecHding">Ready to Start <span>Trading ?</span></h2>
          <p className="subtitle">Join millions of traders who trust Ryllium for their cryptocurrency journey. Sign up today and get $25 in trading credits.</p>
        </div>
        <div className="hero-buttons">
          <Link href="/signup" className="btn-secondary">Create Account</Link>
          <Link href="/pricing" className="signin">View Pricing</Link>
        </div>
      </section>

      <section className="faq container" id="faqs">
        <div className="about-header">
          <div className="inline-fl"><span>Frequently Asked Questions</span></div>
          <h2 className="SecHding">Got <span>Questions?</span></h2>
          <p className="subtitle">Find answers to common questions about trading on Ryllium.</p>
        </div>
        <div className="fAq-r">
          <details><summary>How do I get started with Ryllium?</summary><p>Getting started with Ryllium is quick and simple. First, sign up for an account by providing your basic details and verifying your identity. Once registered, you can fund your account using the supported payment methods. After funding, you’ll have access to the trading dashboard where you can explore markets, execute trades, and track your portfolio in real time.</p></details>
          <details><summary>What cryptocurrencies can I trade?</summary><p>Ryllium supports a wide range of popular cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Ripple (XRP), and many others. Our team is continuously working to add more digital assets based on demand and market trends. You can view the full list of available coins directly in the trading dashboard.</p></details>
          <details><summary>Is Ryllium secure?</summary><p>Yes, Ryllium prioritizes the security of your funds and personal data. We use bank-grade encryption, multi-layer authentication, and cold wallet storage to protect assets. Our platform undergoes regular audits and complies with global security standards to ensure a safe trading environment.</p></details>
          <details><summary>What are the fees on Ryllium?</summary><p>Ryllium maintains a transparent and competitive fee structure. Trading fees are calculated as a small percentage of each transaction, with lower rates for higher-volume traders.</p></details>
          <details><summary>How do I withdraw my funds?</summary><p>Navigate to Withdraw, select method, and enter amount. Process time is typically 24–48 hours.</p></details>
        </div>
      </section>

      <section className="cta">
        <div className="about-header">
          <h2 className="SecHding">Still have <span>questions?</span></h2>
          <p className="subtitle">Our support team is here to help you 24/7. Get in touch and we'll respond as soon as possible.</p>
        </div>
        <div className="hero-buttons">
          <Link href="/contact" className="signin">Contact support</Link>
          <Link href="/chat" className="btn-secondary">Live Chat</Link>
        </div>
      </section>
{/* 
      <footer>
        <div className="hero-content">
          <center>
            <div className="footer-logo">
              <div className="brand"><span className="logo"></span><div className="Tag">Ryllium</div></div>
            </div>
          </center>
          <p className="section-text">The most trusted cryptocurrency exchange platform. Trade with confidence, security, and cutting-edge technology.</p>
          <div className="subscrb">
            <div className="payment-icons">
              <i className="fa-brands fa-cc-visa fa-2x visa"></i>
              <i className="fa-brands fa-cc-mastercard fa-2x mastercard"></i>
              <i className="fa-brands fa-apple-pay fa-2x applepay"></i>
              <i className="fa-brands fa-google-pay fa-2x googlepay"></i>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-copy">
            <p>© 2025 Ryllium. All rights reserved.</p>
            <ul>
              <li><a href="mailto:info@alpacross.com." style={{textDecoration:'none'}}>Contact Us</a></li>
              <li><Link href="/terms-and-conditions">Terms and Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer> */}

      <script dangerouslySetInnerHTML={{__html:`
        (function(){
          var hamburger=document.getElementById('hamburger');
          var mobileDrawer=document.getElementById('mobileDrawer');
          var closeDrawer=document.getElementById('closeDrawer');
          var overlay=document.getElementById('drawerOverlay');
          function open(){mobileDrawer.classList.add('open');overlay.classList.add('open');}
          function close(){mobileDrawer.classList.remove('open');overlay.classList.remove('open');}
          if(hamburger){hamburger.addEventListener('click',open);} 
          if(closeDrawer){closeDrawer.addEventListener('click',close);} 
          if(overlay){overlay.addEventListener('click',close);} 
        })();
      `}} />
    </>
  );
}


