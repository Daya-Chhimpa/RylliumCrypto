export default function TermsPage() {
  const html = `
  <h1 style="color:#ff8600;font-size:2em;line-height:50px">Terms and Conditions</h1>
  <p style="color:#777;">By registering a new User Account and/or using any of the Services and/or visiting any section of this Site, the User agrees to be legally bound by: all of the conditions specified in these Terms and Conditions (hereinafter referred to as “Terms”), Privacy Policy, and any terms and conditions of promotions, bonuses, and special offers which may be found on the Site from time to time.</p>
  <p style="color:#777;">Please read the Terms carefully before accepting them. You agree that you are free to choose whether to use the Services on the Site and do so at your sole option, discretion, and risk.</p>
  <h2 style="color:#ff8600;line-height:50px">1. Disclaimers</h2>
  <p style="color:#777;">Bitcoin and other cryptocurrencies are virtual currencies, digital representations of value that are neither issued by a central bank of any state or public authority attached to a conventional currency, but may be used by any natural or legal persons as a means of exchange and can be transferred, stored or traded electronically.</p>
  <h2 style="color:#ff8600;line-height:50px">2. Definitions</h2>
  <p style="color:#777;">Terms beginning with a capital letter have hereinafter defined meaning:<br><br><b>Polish Act on Personal Data Protection:</b> Refers to the provisions of the Act of 10 May 2018 on the protection of personal data implementing GDPR.<br><b>Agreement:</b> means the agreement between the Company and the User on provision of Services.<br><b>Alternative authentication:</b> means alternative method of verification of the identity of the User by using a series of supplementary questions.<br><b>AML policy:</b> means the internal set of rules and procedures on prevention of money laundering and financing of terrorism in accordance with Polish AML Act of 1 March 2018.<br></p>
  <h2 style="color:#ff8600;line-height:50px">3. The Agreement</h2>
  <p style="color:#777;">3.1. The User enters into the Agreement upon the completion of the Registration.<br>3.2. Terms and Conditions form the integral part of the Agreement and set out detailed rights and obligations regarding the provision of the Services by the Company and use of such Services by the User.</p>
  <h2 style="color:#ff8600;line-height:50px">19. Personal Data Protection</h2>
  <p style="color:#777;">19.1. The processing of personal data is carried out in accordance with the GDPR and Polish Act on Personal Data Protection of 2018.<br><br>The User hereby voluntarily provides consent to the Company, within the meaning of GDPR and applicable Polish legislation, for the processing of his personal data entered in Profile for performance of the Agreement, for Registration, control and marketing purposes in the course of the business of the Company as a data controller. The User provides the consent for the duration of the Agreement with the Company and for a period of ten (10) years after the termination of the Agreement, but at least for the period necessary to protect the rights of the Company and to meet statutory obligations. The Company is authorized to process personal data in a systematic manner, by automated or other means through an information system.<br><br>The supervisory authority in Poland is the <b>President of the Personal Data Protection Office (UODO)</b> (<a href="https://uodo.gov.pl" style="color:#ff8600;">www.uodo.gov.pl</a>).</p>
  <h2 style="color:#ff8600;line-height:50px">20. Choice of law and dispute settlement</h2>
  <p style="color:#777;">20.1. Whereas the Company intends to enter into Agreement with Users of various nationalities all over the world, the Agreement is governed by and is to be construed in accordance with the laws of the Republic of Poland.<br><br>20.2. Any claims shall first be sent to the other party describing basis and essential feature of the claim. The parties shall try to solve all disputes by means of negotiation.<br><br>20.3. Any disputes (including claims for set off and counterclaims) which may arise in connection with the creation, validity, effect, interpretation or performance of, or the legal relationships established by the Terms or otherwise arising in connection with the Terms, that was not resolved in the negotiation shall be decided by the respective <b>Polish courts</b>.</p>
  <h2 style="color:#ff8600;line-height:50px">21. Changes to the Terms and incorporated documents</h2>
  <p style="color:#777;">Same provisions as original (only jurisdiction and compliance adapted to Poland).</p>
  <h2 style="color:#ff8600;line-height:50px">22. Concluding provisions</h2>
  <p style="color:#777;">Same provisions as original, but references to AML = Polish AML Act, and courts = Poland.</p>
  <p style="color:#777; margin-top:20px;"><i>Last amended on April 25th, 2025 (Poland)</i></p>`;

  return (
    <div className="container" style={{marginTop:20, marginBottom:20}}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}


