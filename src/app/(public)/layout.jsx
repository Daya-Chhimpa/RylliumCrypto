export const metadata = { title: "Ryllium", description: "Next-gen crypto platform" };

import Link from "next/link";

export default function PublicLayout({ children }) {
  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <header className="navbar">
        <div className="container nav-content">
          <div className="brand">
            <span className="logo">R</span>
            <div className="Tag">Ryllium</div>
          </div>
          <nav className="nav-links">
            <Link href="/">Home</Link>
            <a href="#about">About</a>
            <a href="#why-us">why Us</a>
            <a href="#faqs">FAQs</a>
          </nav>
          <div className="nav-actions">
            <Link href="/signin" className="signin">Sign In</Link>
            <Link href="/signup" className="btn-primary">Get Started</Link>
          </div>
          <div className="hamburger" id="hamburger">☰</div>
        </div>
      </header>

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

      {children}

      <footer>
        <div className="hero-content">
          <center>
            <div className="footer-logo"><div className="brand"><span className="logo"></span><div className="Tag">Ryllium</div></div></div>
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
      </footer>

      <script dangerouslySetInnerHTML={{__html:`(function(){var h=document.getElementById('hamburger');var d=document.getElementById('mobileDrawer');var c=document.getElementById('closeDrawer');var o=document.getElementById('drawerOverlay');function open(){d.classList.add('open');o.classList.add('open');}function close(){d.classList.remove('open');o.classList.remove('open');}if(h){h.addEventListener('click',open);}if(c){c.addEventListener('click',close);}if(o){o.addEventListener('click',close);} })();`}} />
    </>
  );
}


