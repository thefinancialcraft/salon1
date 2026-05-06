const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update globalCSS
const responsiveCSS = `
  /* Responsive CSS */
  @media (max-width: 768px) {
    body { font-size: 14px; }
    h1 { font-size: 36px !important; line-height: 1.2; }
    h2 { font-size: 28px !important; }
    h3 { font-size: 22px !important; }
    h4 { font-size: 18px !important; }
    
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
    
    .section-pad { padding-left: 16px !important; padding-right: 16px !important; padding-top: 40px !important; padding-bottom: 40px !important; }
    .hero-pad { padding-left: 16px !important; padding-right: 16px !important; padding-top: 100px !important; padding-bottom: 40px !important; }
    
    /* Grid overrides */
    .responsive-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    
    /* Stats */
    .stats-flex { flex-direction: column !important; gap: 16px !important; margin-top: 32px !important; }
  }
  .mobile-only { display: none; }
  
  .mobile-menu {
    position: fixed; top: 64px; left: 0; right: 0; background: #F8F1E9;
    padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-bottom: 2px solid #D4AF37;
    z-index: 999; display: flex; flex-direction: column; gap: 16px;
    transform: translateY(-150%); transition: transform 0.3s ease; opacity: 0; pointer-events: none;
  }
  .mobile-menu.open {
    transform: translateY(0); opacity: 1; pointer-events: auto;
  }
  .menu-btn {
    background: none; border: none; font-size: 24px; color: #9C2A2A; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
`;

code = code.replace(/(const globalCSS = \`[\s\S]*?)(\`;)/, "$1\n" + responsiveCSS + "$2");

// 2. Add classes to elements
code = code.replace(/<div style={{ padding: "80px 24px"/g, '<div className="section-pad" style={{ padding: "80px 24px"');
code = code.replace(/<div style={{ padding: "60px 24px"/g, '<div className="section-pad" style={{ padding: "60px 24px"');
code = code.replace(/<div style={{ padding: "80px 24px 40px"/g, '<div className="section-pad" style={{ padding: "80px 24px 40px"');
code = code.replace(/<div style={{ padding: "80px 24px 60px"/g, '<div className="section-pad" style={{ padding: "80px 24px 60px"');
code = code.replace(/<div style={{ padding: "60px 24px 40px"/g, '<div className="section-pad" style={{ padding: "60px 24px 40px"');

// Hero padding
code = code.replace(/padding: "120px 24px 60px"/g, 'padding: "120px 24px 60px" /* hero */');
code = code.replace(/<div style={{\s*minHeight: "100vh",/g, '<div className="hero-pad" style={{ minHeight: "100vh",');

// Grids
code = code.replace(/gridTemplateColumns: "repeat\(auto-fit, minmax\([0-9]+px,1fr\)\)"/g, 'gridTemplateColumns: "$&" /* grid */');
// Add responsive-grid class to the parent of these
code = code.replace(/<div style={{ display: "grid", gridTemplateColumns: "repeat/g, '<div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat');

// Stats flex
code = code.replace(/<div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>/g, '<div className="stats-flex" style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>');

// Footer grid
code = code.replace(/<div style={{ display: "grid", gridTemplateColumns: "repeat\(auto-fit, minmax\(200px,1fr\)\)", gap: 40, paddingBottom: 48 }}>/g, '<div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 40, paddingBottom: 48 }}>');

// Navbar mobile menu
const navOld = `        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
              color: page === l ? C.maroon : C.dark, letterSpacing: .5,
              borderBottom: page === l ? \`2px solid \${C.gold}\` : "2px solid transparent",
              paddingBottom: 2, transition: "all .2s"
            }}>{l}</button>
          ))}
          <button className="btn-primary" style={{ fontSize: 12, padding: "9px 20px" }} onClick={() => setPage("Contact")}>
            Book Now
          </button>
        </div>`;

const navNew = `        <div className="desktop-only" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
              color: page === l ? C.maroon : C.dark, letterSpacing: .5,
              borderBottom: page === l ? \`2px solid \${C.gold}\` : "2px solid transparent",
              paddingBottom: 2, transition: "all .2s"
            }}>{l}</button>
          ))}
          <button className="btn-primary" style={{ fontSize: 12, padding: "9px 20px" }} onClick={() => setPage("Contact")}>
            Book Now
          </button>
        </div>
        <button className="mobile-only menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
      <div className={\`mobile-menu \${menuOpen ? "open" : ""}\`}>
        {NAV_LINKS.map(l => (
          <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 500,
            color: page === l ? C.maroon : C.dark, letterSpacing: 1,
            padding: "12px 0", textAlign: "left", borderBottom: \`1px solid \${C.beige}\`
          }}>{l}</button>
        ))}
        <button className="btn-primary" style={{ fontSize: 14, padding: "12px", marginTop: 16, width: "100%" }} onClick={() => { setPage("Contact"); setMenuOpen(false); }}>
          Book Appointment
        </button>`;

code = code.replace(navOld, navNew);

fs.writeFileSync('src/App.jsx', code);
console.log("Success");
