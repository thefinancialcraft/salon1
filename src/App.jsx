import { useState, useEffect, useRef } from "react";

const C = {
  maroon: "#9C2A2A", gold: "#D4AF37", teal: "#1A5F5F",
  dark: "#2C2C2C", ivory: "#F8F1E9", beige: "#EDE4D5",
  maroonHover: "#7a2020", goldLight: "#f0d060", white: "#fff"
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');
`;

const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; background: ${C.ivory}; color: ${C.dark}; }
  h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }
  .gold-line { display:flex;align-items:center;gap:12px;margin-bottom:1rem; }
  .gold-line::before,.gold-line::after{content:'';flex:1;height:1px;background:${C.gold};}
  .gold-line span{color:${C.gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'Poppins',sans-serif;}
  .btn-primary{background:${C.maroon};color:#fff;border:none;padding:12px 28px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:500;cursor:pointer;border-radius:2px;letter-spacing:1px;transition:all .3s;}
  .btn-primary:hover{background:${C.maroonHover};}
  .btn-outline{background:transparent;color:${C.gold};border:1.5px solid ${C.gold};padding:11px 28px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:500;cursor:pointer;border-radius:2px;letter-spacing:1px;transition:all .3s;}
  .btn-outline:hover{background:${C.gold};color:${C.dark};}
  .section-tag{font-family:'Poppins',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.gold};font-weight:500;}
  input,select,textarea{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:2px;font-family:'Poppins',sans-serif;font-size:14px;background:#fff;color:${C.dark};outline:none;transition:border .2s;}
  input:focus,select:focus,textarea:focus{border-color:${C.gold};}
  label{font-size:13px;font-weight:500;color:${C.dark};display:block;margin-bottom:6px;}


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

const NAV_LINKS = ["Home","About","Services","Gallery","Contact"];

const SERVICES = [
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/15589/15589757.png" style={{width: 24, height: 24}} alt="Hair Styling" />, name:"Hair Styling", desc:"Cuts, blowouts & precision styling for all textures", price:"₹500", tag:"Men & Women", image: "https://i.pinimg.com/736x/b5/a4/5a/b5a45a6ffb25e4fa3a9b48ca94052876.jpg" },
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/4448/4448660.png" style={{width: 24, height: 24}} alt="Hair Coloring" />, name:"Hair Coloring", desc:"Global, highlights, balayage & fashion colors", price:"₹1,500", tag:"Men & Women", image: "https://i.pinimg.com/736x/b8/f2/8f/b8f28f09b7af9518b4e0629f318447bb.jpg" },
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/7305/7305214.png" style={{width: 24, height: 24}} alt="Skin & Facials" />, name:"Skin & Facials", desc:"Glow, anti-aging, gold & hydration facials", price:"₹800", tag:"Women & Men", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400&h=250" },
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/2821/2821012.png" style={{width: 24, height: 24}} alt="Grooming" />, name:"Men's Grooming", desc:"Beard styling, shaving & scalp treatments", price:"₹400", tag:"Men", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400&h=250" },
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/706/706482.png" style={{width: 24, height: 24}} alt="Bridal Makeup" />, name:"Bridal Makeup", desc:"HD, airbrush & pre-bridal packages", price:"₹8,000", tag:"Women", image: "https://blogproxy.andaazfashion.com/wp-content/uploads/2017/09/bridal.jpg" },
  { icon:<img src="https://cdn-icons-png.flaticon.com/128/599/599752.png" style={{width: 24, height: 24}} alt="Nails & Spa" />, name:"Nails & Spa", desc:"Manicure, pedicure, nail art & relaxation spa", price:"₹600", tag:"Men & Women", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400&h=250" },
];

const TESTIMONIALS = [
  { name:"Priya Sharma", loc:"South Delhi", rating:5, text:"Absolutely stunning results! The bridal makeup team transformed me completely. Everyone kept asking who did my makeup at the wedding.", avatar:"PS" },
  { name:"Rahul Mehra", loc:"Gurgaon", rating:5, text:"Best men's grooming salon I've visited in Delhi NCR. The beard styling and scalp treatment are worth every rupee.", avatar:"RM" },
  { name:"Ananya Singh", loc:"Noida", rating:5, text:"The keratin treatment here is exceptional. My hair has never felt this smooth and the staff is incredibly professional.", avatar:"AS" },
  { name:"Vikram Kapoor", loc:"Dwarka", rating:5, text:"Premium experience from start to finish. The ambience, service quality and attention to detail — everything is 5-star.", avatar:"VK" },
];

const TEAM = [
  { name:"Riya Khanna", role:"Senior Hair Stylist", exp:"8 Years", specialty:"Coloring & Balayage" },
  { name:"Arjun Malhotra", role:"Men's Grooming Expert", exp:"6 Years", specialty:"Beard & Scalp" },
  { name:"Sunita Verma", role:"Bridal Makeup Artist", exp:"10 Years", specialty:"HD & Airbrush" },
  { name:"Kabir Anand", role:"Skin Specialist", exp:"7 Years", specialty:"Facials & Treatments" },
];

const ALL_SERVICES = {
  "Hair Care & Styling": [
    { name:"Haircut (Women)", price:"₹500–₹1,200", dur:"45 min", for:"Women", desc:"Precision cuts tailored to your face shape and hair texture.", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=250&fit=crop" },
    { name:"Haircut (Men)", price:"₹300–₹700", dur:"30 min", for:"Men", desc:"Classic and contemporary cuts for a sharp, sophisticated look.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=250&fit=crop" },
    { name:"Hair Spa", price:"₹800–₹1,500", dur:"60 min", for:"Both", desc:"Deep conditioning treatment to restore moisture and vitality.", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=250&fit=crop" },
    { name:"Smoothening", price:"₹3,500–₹6,000", dur:"3 hrs", for:"Both", desc:"Frizz-free, silky smooth hair that lasts for months.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=250&fit=crop" },
    { name:"Keratin Treatment", price:"₹4,000–₹8,000", dur:"3 hrs", for:"Both", desc:"Protein-infused therapy for repaired, glossy hair.", image: "https://i.pinimg.com/736x/b5/a4/5a/b5a45a6ffb25e4fa3a9b48ca94052876.jpg" },
    { name:"Hair Extensions", price:"₹5,000+", dur:"4 hrs", for:"Women", desc:"Premium human hair extensions for instant length and volume.", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=250&fit=crop" },
  ],
  "Skin & Facials": [
    { name:"Glow Facial", price:"₹800–₹1,500", dur:"60 min", for:"Both", desc:"Instant radiance boost using vitamin C and brightening serums.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop" },
    { name:"Anti-Aging Facial", price:"₹1,500–₹2,500", dur:"75 min", for:"Both", desc:"Firming and lifting treatment to reduce fine lines.", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=250&fit=crop" },
    { name:"Gold Facial", price:"₹2,000–₹3,500", dur:"90 min", for:"Both", desc:"Luxurious 24K gold infused facial for ultimate bridal glow.", image: "https://images.unsplash.com/photo-1512496015851-a1c814b7bb34?w=400&h=250&fit=crop" },
    { name:"Acne Treatment", price:"₹1,000–₹2,000", dur:"60 min", for:"Both", desc:"Deep cleansing and purifying treatment for clear skin.", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=250&fit=crop" },
    { name:"Cleanup", price:"₹400–₹800", dur:"30 min", for:"Both", desc:"Quick pore-cleansing and exfoliation for a fresh look.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop" },
    { name:"D-Tan & Brightening", price:"₹600–₹1,200", dur:"45 min", for:"Both", desc:"Remove sun tan and even out skin tone effectively.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=250&fit=crop" },
  ],
  "Men's Grooming": [
    { name:"Beard Styling & Trim", price:"₹200–₹500", dur:"20 min", for:"Men", desc:"Sharp outlines and perfect lengths for your beard.", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=250&fit=crop" },
    { name:"Royal Shave", price:"₹300–₹600", dur:"30 min", for:"Men", desc:"Traditional hot towel wet shave for the ultimate experience.", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=250&fit=crop" },
    { name:"Scalp Treatment", price:"₹800–₹1,500", dur:"45 min", for:"Men", desc:"Nourishing treatment for dandruff control and hair fall.", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=250&fit=crop" },
    { name:"Men's Facial", price:"₹600–₹1,200", dur:"45 min", for:"Men", desc:"Deep cleansing facial tailored specifically for men's skin.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop" },
    { name:"Hair Color (Men)", price:"₹500–₹1,200", dur:"60 min", for:"Men", desc:"Grey coverage and fashion colors for a youthful look.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=250&fit=crop" },
    { name:"Full Grooming Package", price:"₹1,500–₹3,000", dur:"2 hrs", for:"Men", desc:"Complete makeover including haircut, shave, and cleanup.", image: "https://images.unsplash.com/photo-1516975080661-46bf8bf25b03?w=400&h=250&fit=crop" },
  ],
  "Bridal & Makeup": [
    { name:"HD Bridal Makeup", price:"₹8,000–₹15,000", dur:"3 hrs", for:"Women", desc:"Flawless, camera-ready finish that lasts all day.", image: "https://blogproxy.andaazfashion.com/wp-content/uploads/2017/09/bridal.jpg" },
    { name:"Airbrush Makeup", price:"₹10,000–₹18,000", dur:"3 hrs", for:"Women", desc:"Lightweight, waterproof makeup for a natural, glowing look.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=250&fit=crop" },
    { name:"Engagement Makeup", price:"₹5,000–₹10,000", dur:"2 hrs", for:"Women", desc:"Soft and elegant makeup tailored for your special ring ceremony.", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop" },
    { name:"Pre-Bridal Package", price:"₹15,000–₹30,000", dur:"Multiple", for:"Women", desc:"Complete head-to-toe grooming sessions before the big day.", image: "https://images.unsplash.com/photo-1516975080661-46bf8bf25b03?w=400&h=250&fit=crop" },
    { name:"Party Makeup", price:"₹2,000–₹5,000", dur:"90 min", for:"Women", desc:"Glamorous makeup and hair styling for events and parties.", image: "https://images.unsplash.com/photo-1512496015851-a1c814b7bb34?w=400&h=250&fit=crop" },
    { name:"Mehndi Look", price:"₹3,000–₹6,000", dur:"2 hrs", for:"Women", desc:"Vibrant, playful makeup to complement your Mehndi outfit.", image: "https://images.unsplash.com/photo-1595959553556-9d332617f651?w=400&h=250&fit=crop" },
  ],
  "Nails & Relaxation": [
    { name:"Classic Manicure", price:"₹400–₹800", dur:"45 min", for:"Both", desc:"Cuticle care, shaping, and polish for elegant hands.", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop" },
    { name:"Classic Pedicure", price:"₹500–₹900", dur:"45 min", for:"Both", desc:"Soothing foot soak, scrub, and perfect nail grooming.", image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=250&fit=crop" },
    { name:"Nail Art", price:"₹300–₹800", dur:"60 min", for:"Both", desc:"Custom designs, ombre, and 3D art by expert technicians.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=250&fit=crop" },
    { name:"Gel Nails", price:"₹800–₹1,500", dur:"90 min", for:"Both", desc:"Long-lasting gel polish with zero chipping for weeks.", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=400&h=250&fit=crop" },
    { name:"Body Spa", price:"₹2,000–₹4,000", dur:"2 hrs", for:"Both", desc:"Full body massage to relieve tension and rejuvenate.", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop" },
    { name:"Head Massage", price:"₹400–₹800", dur:"30 min", for:"Both", desc:"Relaxing Indian head massage using warm herbal oils.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=250&fit=crop" },
  ],
};

const STATS = [
  { val:"12,000+", label:"Happy Clients" },
  { val:"6+", label:"Years of Excellence" },
  { val:"25+", label:"Expert Stylists" },
  { val:"4.9★", label:"Google Rating" },
];

const GALLERY_ITEMS = [
  { label:"Bridal Glow", cat:"Bridal", color:"#9C2A2A" },
  { label:"Modern Bob", cat:"Hair", color:"#D4AF37" },
  { label:"Men's Fade", cat:"Grooming", color:"#1A5F5F" },
  { label:"Gold Facial", cat:"Skin", color:"#8B4513" },
  { label:"Balayage", cat:"Color", color:"#9C2A2A" },
  { label:"Nail Art", cat:"Nails", color:"#D4AF37" },
  { label:"Beard Sculpt", cat:"Grooming", color:"#2C2C2C" },
  { label:"Bridal HD", cat:"Bridal", color:"#1A5F5F" },
];

const CATEGORIES = [
  { name: "Hair Styling", image: "https://i.pinimg.com/736x/b5/a4/5a/b5a45a6ffb25e4fa3a9b48ca94052876.jpg", desc: "Premium Cuts & Styling" },
  { name: "Bridal Makeup", image: "https://blogproxy.andaazfashion.com/wp-content/uploads/2017/09/bridal.jpg", desc: "Your Special Day" },
  { name: "Skin & Facials", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400&h=500", desc: "Radiant Glow" },
  { name: "Men's Grooming", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400&h=500", desc: "Sharp & Clean" },
  { name: "Nails & Spa", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400&h=500", desc: "Relax & Rejuvenate" }
];

function StarRating({ n }) {
  return <span style={{ color: C.gold, fontSize: 14 }}>{"★".repeat(n)}</span>;
}

function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(248,241,233,0.97)" : "rgba(248,241,233,0.7)",
      backdropFilter: "blur(10px)",
      borderBottom: scrolled ? `1px solid ${C.gold}33` : "none",
      transition: "all .3s", padding: "0 24px"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setPage("Home")}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.maroon, letterSpacing: 1 }}>Opulent Aura</div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: C.gold, fontFamily: "'Poppins', sans-serif", marginTop: -2 }}>LUXURY SALON & SPA</div>
        </div>
        <div className="desktop-only" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
              color: page === l ? C.maroon : C.dark, letterSpacing: .5,
              borderBottom: page === l ? `2px solid ${C.gold}` : "2px solid transparent",
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
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map(l => (
          <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 500,
            color: page === l ? C.maroon : C.dark, letterSpacing: 1,
            padding: "12px 0", textAlign: "left", borderBottom: `1px solid ${C.beige}`
          }}>{l}</button>
        ))}
        <button className="btn-primary" style={{ fontSize: 14, padding: "12px", marginTop: 16, width: "100%" }} onClick={() => { setPage("Contact"); setMenuOpen(false); }}>
          Book Appointment
        </button>
      </div>
    </nav>
  );
}

function TrustBar() {
  const items = ["12,000+ Happy Clients", "Certified Expert Stylists", "Premium Imported Products", "Hygienic & Safe Standards", "Open 10 AM – 9 PM"];
  return (
    <div style={{ background: C.maroon, padding: "8px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 40, animation: "scroll 20s linear infinite", whiteSpace: "nowrap" }}>
        {[...items, ...items].map((it, i) => (
          <span key={i} style={{ color: C.gold, fontSize: 12, letterSpacing: 2, fontFamily: "'Poppins', sans-serif" }}>
            ◆ {it}
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

function CategoryCarousel({ setPage }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -310 : 310, behavior: 'smooth' });
    }
  };

  return (
    <div className="section-pad" style={{ padding: "80px 24px", background: C.beige, position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-tag">Explore by Category</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, marginTop: 8, color: C.dark }}>Our Departments</h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => scroll('left')} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.gold}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.dark, fontSize: 18, transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.background = C.beige} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>←</button>
            <button onClick={() => scroll('right')} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.gold}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.dark, fontSize: 18, transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.background = C.beige} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>→</button>
          </div>
        </div>
        
        <div ref={scrollRef} style={{ 
          display: "flex", gap: 24, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none",
          paddingBottom: 20, scrollSnapType: "x mandatory"
        }}>
          {CATEGORIES.map(c => (
            <div key={c.name} style={{ 
              minWidth: 280, width: 280, height: 380, borderRadius: 4, overflow: "hidden", 
              position: "relative", cursor: "pointer", scrollSnapAlign: "start",
              boxShadow: "0 8px 24px rgba(0,0,0,.08)", flexShrink: 0
            }} onClick={() => setPage("Services")}
              onMouseEnter={e => e.currentTarget.children[0].style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.children[0].style.transform = "scale(1)"}
            >
              <div style={{ position: "absolute", inset: 0, background: `url('${c.image}') center/cover`, transition: "transform 0.5s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,10,0.9) 0%, rgba(26,10,10,0) 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", marginBottom: 4 }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: C.gold, letterSpacing: 1 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </div>
  );
}

function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div className="hero-pad" style={{ minHeight: "100vh", background: `linear-gradient(160deg, #1a0a0a 0%, #3a1010 40%, #5a1a1a 70%, #2C1010 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "120px 24px 60px" /* hero */
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: .06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23D4AF37' stroke-width='.5'/%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='%23D4AF37' stroke-width='.5'/%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='%23D4AF37' stroke-width='.5'/%3E%3Cpath d='M60 10 L60 110 M10 60 L110 60 M25 25 L95 95 M95 25 L25 95' stroke='%23D4AF37' stroke-width='.3' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 120
        }} />
        <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div className="section-tag" style={{ color: C.gold, marginBottom: 16 }}>Welcome to Delhi NCR's Premier Salon</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,6vw,68px)", color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
            Redefining Beauty &<br /><span style={{ color: C.gold }}>Grooming Excellence</span>
          </h1>
          <p style={{ color: "#E8D5C4", fontSize: 17, lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Experience premium salon services for men and women — crafted to enhance your confidence, personality, and style in the heart of Delhi NCR.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 15 }} onClick={() => setPage("Contact")}>Book Appointment</button>
            <button className="btn-outline" style={{ fontSize: 15 }} onClick={() => setPage("Services")}>Explore Services</button>
          </div>
          <div className="stats-flex" style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.gold, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#B0A090", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Carousel */}
      <CategoryCarousel setPage={setPage} />

      {/* Services */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-tag">Our Expertise</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, marginTop: 8, color: C.dark }}>Signature Services</h2>
            <div style={{ width: 60, height: 2, background: C.gold, margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 28 }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{
                background: "#fff", border: `1px solid ${C.beige}`, borderRadius: 4,
                overflow: "hidden", cursor: "pointer", transition: "all .3s",
                boxShadow: "0 2px 12px rgba(156,42,42,.04)"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(156,42,42,.12)"; e.currentTarget.querySelector('.card-img').style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.beige; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(156,42,42,.04)"; e.currentTarget.querySelector('.card-img').style.transform = "scale(1)"; }}
                onClick={() => setPage("Services")}
              >
                <div style={{ height: 250, overflow: "hidden" }}>
                  <div className="card-img" style={{ height: "100%", background: `url('${s.image}') center/cover`, transition: "transform 0.5s ease" }} />
                </div>
                <div style={{ padding: 24, position: "relative", background: "#fff", zIndex: 2 }}>
                  <div style={{ position: "absolute", top: -20, right: 24, width: 40, height: 40, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10, color: C.dark }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: C.maroon, fontWeight: 600, fontSize: 16 }}>Starting {s.price}</span>
                    <span style={{ background: C.beige, color: C.teal, fontSize: 11, padding: "4px 10px", borderRadius: 2, fontWeight: 500 }}>{s.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button className="btn-outline" onClick={() => setPage("Services")}>View All Services</button>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.dark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-tag">Why Opulent Aura</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, marginTop: 8, color: "#fff" }}>The Opulent Difference</h2>
            <div style={{ width: 60, height: 2, background: C.gold, margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 28 }}>
            {[
              { image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/3798/3798607.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Luxury" />, title:"Luxury Ambience", desc:"Experience tranquility in our plush interiors designed for your ultimate relaxation and comfort." },
              { image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/1490/1490749.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Premium" />, title:"Premium Products", desc:"We use only professional-grade imported brands — safe for all Indian skin & hair types" },
              { image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/3359/3359518.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Hygiene" />, title:"Hygienic Standards", desc:"Hospital-grade sterilization for all tools. Disposable items used wherever applicable" },
              { image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/10465/10465661.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Consultation" />, title:"Personal Consultation", desc:"Every client gets a dedicated consultation to understand your unique needs & goals" },
              { image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/2460/2460737.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Booking" />, title:"Easy Booking", desc:"Book in 2 minutes via WhatsApp, call or our online form. Instant confirmation" },
              { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400&h=250", icon:<img src="https://cdn-icons-png.flaticon.com/128/1019/1019709.png" style={{width: 22, height: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"}} alt="Payment" />, title:"Flexible Payment", desc:"Cash, UPI, card & EMI available. Special packages for bridal & family bookings" },
            ].map(f => (
              <div key={f.title} style={{ 
                background: "#1a1a1a", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.gold}22`,
                transition: "transform 0.3s", cursor: "pointer", boxShadow: "0 12px 32px rgba(0,0,0,0.4)"
              }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ height: 200, background: `url('${f.image}') center/cover`, position: "relative" }}>
                   <div style={{ position: "absolute", bottom: -24, left: 24, width: 48, height: 48, background: C.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "4px solid #1a1a1a", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>{f.icon}</div>
                </div>
                <div style={{ padding: "40px 24px 32px" }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", marginBottom: 10 }}>{f.title}</h4>
                  <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.beige }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-tag">Client Stories</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, marginTop: 8 }}>What Our Clients Say</h2>
            <div style={{ width: 60, height: 2, background: C.gold, margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: "#fff", padding: 28, borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
                <StarRating n={t.rating} />
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: "14px 0 20px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: C.maroon,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 600, fontSize: 14, border: `2px solid ${C.gold}`
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.maroon, textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-tag" style={{ color: C.gold }}>Limited Slots Available</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: "#fff", margin: "16px 0 20px" }}>
            Ready for Your Transformation?
          </h2>
          <p style={{ color: "#E8D5C4", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Book your appointment today and experience the Opulent Aura difference. Mention this website for 15% off your first visit.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: C.gold, color: C.dark, border: "none", padding: "14px 32px", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", borderRadius: 2, letterSpacing: 1 }} onClick={() => setPage("Contact")}>
              Book Appointment
            </button>
            <button className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>
              <span style={{display: "flex", alignItems: "center", gap: 8, justifyContent: "center"}}><img src="https://cdn-icons-png.flaticon.com/128/3059/3059502.png" style={{width: 16, height: 16, filter: "brightness(0) invert(1)"}} alt="Phone" /> +91 98765 43210</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <div className="section-pad" style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.dark} 0%, #4a1a1a 100%)`, textAlign: "center" }}>
        <div className="section-tag" style={{ color: C.gold }}>Our Story</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#fff", margin: "16px 0 20px" }}>Where Style Meets Luxury</h1>
        <p style={{ color: "#C8B8A8", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
          Born from a passion for artistry and a deep understanding of Indian beauty needs, Opulent Aura has redefined premium grooming in Delhi NCR since 2019.
        </p>
      </div>

      {/* Stats */}
      <div style={{ background: C.gold, padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.dark }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#5a3a00", letterSpacing: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div className="section-tag">Our Journey</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, margin: "12px 0 24px" }}>From a Single Chair to Delhi NCR's Most Loved Salon</h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "#555", marginBottom: 20 }}>
              Opulent Aura was founded in 2019 by renowned stylist duo Riya Khanna and Arjun Malhotra with a single vision — to bring world-class salon experiences to Indian clients without compromising on cultural understanding and authenticity.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "#555", marginBottom: 28 }}>
              What started as a boutique salon in South Delhi has grown into a destination that thousands of clients across Delhi, Gurgaon, Noida and Faridabad trust for every occasion — from everyday grooming to bridal transformations.
            </p>
            <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 20 }}>
              <p style={{ fontSize: 16, fontStyle: "italic", color: C.maroon, fontFamily: "'Playfair Display', serif", lineHeight: 1.7 }}>
                "We don't just enhance appearances — we amplify confidence and celebrate individuality."
              </p>
              <p style={{ fontSize: 13, color: "#888", marginTop: 8 }}>— Riya Khanna, Co-Founder</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { bg: C.maroon, label: "Est. 2019", sub: "South Delhi" },
              { bg: C.teal, label: "25+ Experts", sub: "Certified" },
              { bg: C.gold, label: "100% Safe", sub: "Hygienic" },
              { bg: C.dark, label: "5★ Rated", sub: "Google Reviews" },
            ].map(c => (
              <div key={c.label} style={{
                background: c.bg, padding: "32px 20px", borderRadius: 4, textAlign: "center"
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", fontWeight: 700 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 6, letterSpacing: 1 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.beige }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-tag">Our Experts</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, marginTop: 8 }}>Meet the Artists</h2>
            <div style={{ width: 60, height: 2, background: C.gold, margin: "16px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 28 }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ background: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                <div style={{
                  height: 180, background: `linear-gradient(135deg, ${C.maroon} 0%, ${C.dark} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", background: C.gold,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.dark, fontWeight: 700,
                    border: "3px solid rgba(255,255,255,.3)"
                  }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>{t.name}</h4>
                  <p style={{ color: C.maroon, fontSize: 13, fontWeight: 500, margin: "4px 0 8px" }}>{t.role}</p>
                  <p style={{ fontSize: 12, color: "#888" }}>Experience: {t.exp}</p>
                  <p style={{ fontSize: 12, color: C.teal, fontWeight: 500, marginTop: 4 }}>★ {t.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ setPage }) {
  const [activeTab, setActiveTab] = useState(Object.keys(ALL_SERVICES)[0]);
  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section-pad" style={{ padding: "60px 24px 40px", background: C.dark, textAlign: "center" }}>
        <div className="section-tag" style={{ color: C.gold }}>Complete Menu</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#fff", margin: "16px 0 16px" }}>Our Services</h1>
        <p style={{ color: "#C8B8A8", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Premium treatments tailored for every individual — men, women, and brides.</p>
      </div>

      <div style={{ background: C.maroon, padding: "0 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {Object.keys(ALL_SERVICES).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
              color: activeTab === cat ? C.gold : "rgba(255,255,255,.7)",
              borderBottom: activeTab === cat ? `2px solid ${C.gold}` : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all .2s"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="section-pad" style={{ padding: "60px 24px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 24 }}>
            {ALL_SERVICES[activeTab].map(s => (
              <div key={s.name} style={{
                background: "#fff", border: `1px solid ${C.beige}`, borderRadius: 4, overflow: "hidden",
                transition: "all .3s", cursor: "pointer", display: "flex", flexDirection: "column",
                boxShadow: "0 4px 12px rgba(0,0,0,.04)"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(156,42,42,.12)"; e.currentTarget.querySelector('.service-img').style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.beige; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.04)"; e.currentTarget.querySelector('.service-img').style.transform = "scale(1)"; }}
                onClick={() => setPage("Contact")}
              >
                <div style={{ height: 200, overflow: "hidden", borderBottom: `1px solid ${C.beige}` }}>
                  <div className="service-img" style={{ height: "100%", background: `url('${s.image}') center/cover`, transition: "transform 0.5s ease" }} />
                </div>
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8, color: C.dark }}>{s.name}</h4>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{s.desc}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid #f5f5f5` }}>
                    <div>
                      <div style={{ color: C.maroon, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.price}</div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}><img src="https://cdn-icons-png.flaticon.com/128/2088/2088617.png" style={{width: 12, height: 12}} alt="Time" /> {s.dur}</span>
                        <span style={{
                          fontSize: 10, background: s.for === "Men" ? "#E8F4F8" : s.for === "Women" ? "#FDE8F0" : C.beige,
                          color: s.for === "Men" ? C.teal : s.for === "Women" ? C.maroon : "#666",
                          padding: "2px 8px", borderRadius: 2, fontWeight: 600, letterSpacing: 0.5
                        }}>{s.for.toUpperCase()}</span>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ fontSize: 12, padding: "8px 16px" }} onClick={(e) => { e.stopPropagation(); setPage("Contact"); }}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.beige }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-tag">Best Value</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, marginTop: 8 }}>Curated Packages</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 24 }}>
            {[
              { name: "Refresh Package", price: "₹1,999", items: ["Haircut", "Cleanup", "Head Massage", "Eyebrow Threading"], tag: "Women", popular: false },
              { name: "Groom Package", price: "₹2,499", items: ["Haircut + Style", "Beard Trim", "Men's Facial", "Scalp Treatment"], tag: "Men", popular: true },
              { name: "Bridal Starter", price: "₹12,999", items: ["HD Makeup", "Hairstyling", "Manicure", "Pedicure", "Cleanup"], tag: "Women", popular: false },
            ].map(p => (
              <div key={p.name} style={{
                background: "#fff", borderRadius: 4, padding: 32, textAlign: "center",
                border: p.popular ? `2px solid ${C.gold}` : `1px solid ${C.beige}`,
                position: "relative", boxShadow: p.popular ? `0 8px 32px rgba(212,175,55,.15)` : "none"
              }}>
                {p.popular && <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: C.gold, color: C.dark, fontSize: 11, fontWeight: 700,
                  padding: "4px 20px", borderRadius: 2, letterSpacing: 1
                }}>MOST POPULAR</div>}
                <div style={{ fontSize: 11, color: C.teal, letterSpacing: 2, fontWeight: 600, marginBottom: 8 }}>FOR {p.tag.toUpperCase()}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: C.maroon, fontWeight: 700, marginBottom: 20 }}>{p.price}</div>
                {p.items.map(it => (
                  <div key={it} style={{ fontSize: 14, color: "#555", padding: "8px 0", borderBottom: `1px solid ${C.beige}` }}>✓ {it}</div>
                ))}
                <button className="btn-primary" style={{ marginTop: 24, width: "100%" }} onClick={() => setPage("Contact")}>Book Package</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Bridal", "Hair", "Grooming", "Skin", "Color", "Nails"];
  const filtered = filter === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.cat === filter);
  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section-pad" style={{ padding: "60px 24px", background: C.dark, textAlign: "center" }}>
        <div className="section-tag" style={{ color: C.gold }}>Transformations</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#fff", margin: "16px 0" }}>Our Gallery</h1>
        <p style={{ color: "#C8B8A8" }}>Real transformations. Real confidence. Real beauty.</p>
      </div>
      <div style={{ padding: "32px 24px 0", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "8px 20px", border: `1px solid ${filter === c ? C.gold : "#ddd"}`,
              background: filter === c ? C.gold : "#fff", color: filter === c ? C.dark : "#555",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
              borderRadius: 2, transition: "all .2s"
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "40px 24px 80px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 16 }}>
          {filtered.map((g, i) => (
            <div key={i} style={{
              height: 280, background: `linear-gradient(160deg, ${g.color} 0%, ${g.color}cc 60%, #1a1a1a 100%)`,
              borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: 20, cursor: "pointer", position: "relative", overflow: "hidden", transition: "transform .3s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: .05, background: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E\") center/40px" }} />
              <span style={{ background: C.gold, color: C.dark, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 2, width: "fit-content", letterSpacing: 1, marginBottom: 8 }}>{g.cat.toUpperCase()}</span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 600 }}>{g.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4 }}>Opulent Aura Salon</div>
            </div>
          ))}
        </div>
      </div>

      {/* Before & After */}
      <div className="section-pad" style={{ padding: "80px 24px", background: C.beige }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-tag">Proof of Excellence</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, marginTop: 8 }}>Before & After</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24 }}>
            {[
              { cat: "Hair Coloring", before: "Natural Black", after: "Caramel Balayage" },
              { cat: "Men's Grooming", before: "Overgrown Beard", after: "Sculpted Fade" },
              { cat: "Skin Treatment", before: "Uneven Tone", after: "Radiant Glow" },
            ].map(b => (
              <div key={b.cat} style={{ background: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 160 }}>
                  <div style={{ background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888", letterSpacing: 2 }}>BEFORE</div>
                      <div style={{ fontSize: 14, color: "#ccc", marginTop: 8, fontStyle: "italic" }}>{b.before}</div>
                    </div>
                  </div>
                  <div style={{ background: C.maroon, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2 }}>AFTER</div>
                      <div style={{ fontSize: 14, color: "#fff", marginTop: 8, fontStyle: "italic" }}>{b.after}</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 16, textAlign: "center" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.dark }}>{b.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", gender: "",
    category: "", service: "", package: "", message: "",
    date: "", time: "", stylist: "", source: "", occasion: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const TIMES = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
  const STYLISTS = ["No Preference","Riya Khanna","Arjun Malhotra","Sunita Verma","Kabir Anand"];
  if (submitted) return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: C.ivory, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px" }}>
      <div>
        <div style={{ marginBottom: 24 }}><img src="https://cdn-icons-png.flaticon.com/128/3798/3798607.png" style={{width: 64, height: 64}} alt="Sparkle" /></div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: C.maroon, marginBottom: 16 }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px" }}>
          Thank you, {form.name}! Your appointment request has been received. Our team will call you at <strong>{form.phone}</strong> within 30 minutes to confirm your slot.
        </p>
        <div style={{ background: "#fff", border: `1px solid ${C.gold}`, padding: 28, borderRadius: 4, maxWidth: 360, margin: "0 auto 32px", textAlign: "left" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16, color: C.dark }}>Booking Summary</div>
          {[["Service", form.service || form.category], ["Date", form.date], ["Time", form.time], ["Stylist", form.stylist || "As Assigned"]].map(([l, v]) => v && (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.beige}`, fontSize: 14 }}>
              <span style={{ color: "#888" }}>{l}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({ name: "", phone: "", email: "", gender: "", category: "", service: "", package: "", message: "", date: "", time: "", stylist: "", source: "", occasion: "" }); }}>Book Another</button>
      </div>
    </div>
  );
  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section-pad" style={{ padding: "60px 24px", background: C.dark, textAlign: "center" }}>
        <div className="section-tag" style={{ color: C.gold }}>Get In Touch</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#fff", margin: "16px 0" }}>Book Your Appointment</h1>
        <p style={{ color: "#C8B8A8" }}>Premium experience, 2-minute booking. Instant confirmation.</p>
      </div>

      <div className="section-pad" style={{ padding: "60px 24px", background: C.ivory }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60, alignItems: "start" }}>
          {/* Contact Info */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 24 }}>Reach Us</h3>
            {[
              { icon: <img src="https://cdn-icons-png.flaticon.com/128/3891/3891055.png" style={{width: 24, height: 24}} alt="Address" />, title: "Address", val: "B-47, Defence Colony, South Delhi – 110024" },
              { icon: <img src="https://cdn-icons-png.flaticon.com/128/3059/3059502.png" style={{width: 24, height: 24}} alt="Phone" />, title: "Phone", val: "+91 98765 43210" },
              { icon: <img src="https://cdn-icons-png.flaticon.com/128/3178/3178158.png" style={{width: 24, height: 24}} alt="Email" />, title: "Email", val: "hello@opulentaura.in" },
              { icon: <img src="https://cdn-icons-png.flaticon.com/128/2088/2088617.png" style={{width: 24, height: 24}} alt="Hours" />, title: "Hours", val: "Monday – Sunday: 10 AM – 9 PM" },
              { icon: <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" style={{width: 24, height: 24}} alt="WhatsApp" />, title: "WhatsApp", val: "+91 98765 43210" },
            ].map(c => (
              <div key={c.title} style={{ display: "flex", gap: 16, marginBottom: 20, padding: "16px 20px", background: "#fff", borderRadius: 4, border: `1px solid ${C.beige}` }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>{c.title.toUpperCase()}</div>
                  <div style={{ fontSize: 14, color: C.dark, fontWeight: 500 }}>{c.val}</div>
                </div>
              </div>
            ))}
            <div style={{ background: C.maroon, padding: 24, borderRadius: 4, marginTop: 8 }}>
              <div style={{ fontSize: 14, color: C.gold, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><img src="https://cdn-icons-png.flaticon.com/128/66/66834.png" style={{width: 16, height: 16}} alt="Offer" /> FIRST VISIT OFFER</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>15% OFF</div>
              <div style={{ fontSize: 13, color: "#E8D5C4" }}>Mention "Website" at the salon to avail. Valid for new clients.</div>
            </div>
          </div>

          {/* Booking Form */}
          <div style={{ background: "#fff", border: `1px solid ${C.beige}`, borderRadius: 4, padding: 36 }}>
            {/* Steps */}
            <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
              {["Personal", "Service", "Schedule"].map((s, i) => (
                <div key={s} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", margin: "0 auto 6px",
                    background: step > i + 1 ? C.gold : step === i + 1 ? C.maroon : C.beige,
                    color: step > i + 1 ? C.dark : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600, transition: "all .3s"
                  }}>{step > i + 1 ? "✓" : i + 1}</div>
                  <div style={{ fontSize: 12, color: step === i + 1 ? C.maroon : "#888", fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
                  {i < 2 && <div style={{ position: "absolute" }} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Personal Details</h4>
                <div style={{ display: "grid", gap: 16 }}>
                  <div><label>Full Name *</label><input placeholder="e.g. Priya Sharma" value={form.name} onChange={e => upd("name", e.target.value)} /></div>
                  <div><label>Phone Number *</label><input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => upd("phone", e.target.value)} /></div>
                  <div><label>Email Address</label><input placeholder="your@email.com" value={form.email} onChange={e => upd("email", e.target.value)} /></div>
                  <div><label>Gender</label>
                    <select value={form.gender} onChange={e => upd("gender", e.target.value)}>
                      <option value="">Select Gender</option>
                      <option>Male</option><option>Female</option><option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => form.name && form.phone && setStep(2)}>Continue →</button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Service Details</h4>
                <div style={{ display: "grid", gap: 16 }}>
                  <div><label>Service Category *</label>
                    <select value={form.category} onChange={e => upd("category", e.target.value)}>
                      <option value="">Select Category</option>
                      {Object.keys(ALL_SERVICES).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {form.category && <div><label>Specific Service</label>
                    <select value={form.service} onChange={e => upd("service", e.target.value)}>
                      <option value="">Select Service</option>
                      {ALL_SERVICES[form.category]?.map(s => <option key={s.name}>{s.name}</option>)}
                    </select>
                  </div>}
                  <div><label>Package Type</label>
                    <select value={form.package} onChange={e => upd("package", e.target.value)}>
                      <option value="">Select Package</option>
                      <option>Regular</option><option>Premium</option><option>Bridal</option>
                    </select>
                  </div>
                  <div><label>Occasion</label>
                    <select value={form.occasion} onChange={e => upd("occasion", e.target.value)}>
                      <option value="">Select (Optional)</option>
                      <option>Wedding</option><option>Engagement</option><option>Birthday</option><option>Anniversary</option><option>Regular Visit</option>
                    </select>
                  </div>
                  <div><label>Special Requests</label>
                    <textarea rows={3} placeholder="Any specific requirements, allergies, or preferences..." value={form.message} onChange={e => upd("message", e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Continue →</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Schedule Appointment</h4>
                <div style={{ display: "grid", gap: 16 }}>
                  <div><label>Preferred Date *</label><input type="date" value={form.date} onChange={e => upd("date", e.target.value)} min={new Date().toISOString().split("T")[0]} /></div>
                  <div><label>Preferred Time Slot *</label>
                    <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 4 }}>
                      {TIMES.map(t => (
                        <button key={t} onClick={() => upd("time", t)} style={{
                          padding: "8px 4px", border: `1px solid ${form.time === t ? C.gold : "#ddd"}`,
                          background: form.time === t ? C.gold : "#fff",
                          color: form.time === t ? C.dark : "#555",
                          cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: 12,
                          borderRadius: 2, transition: "all .2s", fontWeight: form.time === t ? 600 : 400
                        }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div><label>Preferred Stylist (Optional)</label>
                    <select value={form.stylist} onChange={e => upd("stylist", e.target.value)}>
                      {STYLISTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label>How did you hear about us?</label>
                    <select value={form.source} onChange={e => upd("source", e.target.value)}>
                      <option value="">Select</option>
                      <option>Google Search</option><option>Instagram</option><option>Friend / Family</option>
                      <option>JustDial</option><option>Walkby</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-primary" style={{ flex: 2 }} onClick={() => form.date && form.time && setSubmitted(true)}>
                    Confirm Booking ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "60px 24px 80px", background: C.beige }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-tag">Common Questions</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, marginTop: 8 }}>FAQs</h2>
          </div>
          {[
            { q: "Do I need to book in advance?", a: "Walk-ins are welcome, but we recommend booking at least 24–48 hours in advance, especially on weekends and for bridal appointments." },
            { q: "What payment methods do you accept?", a: "We accept Cash, all UPI apps (GPay, PhonePe, Paytm), Credit/Debit cards and Razorpay. EMI available for bridal packages above ₹10,000." },
            { q: "Are your products safe for sensitive skin?", a: "Yes. We use only professional-grade products. During your consultation, our experts assess your skin and hair type before recommending any treatment." },
            { q: "Do you offer home services?", a: "Yes! We offer bridal and special occasion home services across Delhi NCR. Additional charges apply based on location. Contact us for a custom quote." },
            { q: "What is your cancellation policy?", a: "Appointments can be rescheduled free of charge with at least 4 hours notice. Same-day cancellations may incur a 20% charge." },
          ].map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid #ddd`, padding: "20px 0" }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 500, color: C.dark
      }}>
        {q}
        <span style={{ color: C.gold, fontSize: 20, transition: "transform .2s", transform: open ? "rotate(45deg)" : "" }}>+</span>
      </button>
      {open && <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8, marginTop: 12, paddingRight: 24 }}>{a}</p>}
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: C.maroon, padding: "60px 24px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 40, paddingBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#fff", fontWeight: 700 }}>Opulent Aura</div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.gold, marginBottom: 16 }}>LUXURY SALON & SPA</div>
            <p style={{ fontSize: 13, color: "#E8D5C4", lineHeight: 1.8 }}>Delhi NCR's premier luxury unisex salon — where beauty meets artistry and every client leaves transformed.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[
                "https://cdn-icons-png.flaticon.com/128/3955/3955024.png",
                "https://cdn-icons-png.flaticon.com/128/20/20837.png",
                "https://cdn-icons-png.flaticon.com/128/3670/3670147.png",
                "https://cdn-icons-png.flaticon.com/128/733/733585.png"
              ].map((iconUrl, i) => (
                <div key={i} style={{ width: 36, height: 36, background: "rgba(255,255,255,.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <img src={iconUrl} style={{ width: 16, height: 16, filter: "brightness(0) invert(1)" }} alt="Social" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: C.gold, fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>QUICK LINKS</h4>
            {NAV_LINKS.map(l => <div key={l} style={{ cursor: "pointer", color: "#E8D5C4", fontSize: 14, marginBottom: 10 }} onClick={() => setPage(l)}>{l}</div>)}
          </div>
          <div>
            <h4 style={{ color: C.gold, fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>SERVICES</h4>
            {["Hair Styling & Color", "Skin & Facials", "Men's Grooming", "Bridal Makeup", "Nails & Spa", "Body Treatments"].map(s => (
              <div key={s} style={{ color: "#E8D5C4", fontSize: 14, marginBottom: 10, cursor: "pointer" }} onClick={() => setPage("Services")}>{s}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: C.gold, fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>CONTACT</h4>
            <div style={{ fontSize: 13, color: "#E8D5C4", lineHeight: 1.9 }}>
              <p style={{display: "flex", alignItems: "center", gap: 8}}><img src="https://cdn-icons-png.flaticon.com/128/3891/3891055.png" style={{width: 14, height: 14, filter: "brightness(0) invert(0.9)"}} alt="Location" /> B-47, Defence Colony</p>
              <p style={{paddingLeft: 22}}>South Delhi – 110024</p>
              <p style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}><img src="https://cdn-icons-png.flaticon.com/128/3059/3059502.png" style={{width: 14, height: 14, filter: "brightness(0) invert(0.9)"}} alt="Phone" /> +91 98765 43210</p>
              <p style={{display: "flex", alignItems: "center", gap: 8, marginTop: 4}}><img src="https://cdn-icons-png.flaticon.com/128/3178/3178158.png" style={{width: 14, height: 14, filter: "brightness(0) invert(0.9)"}} alt="Email" /> hello@opulentaura.in</p>
              <p style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}><img src="https://cdn-icons-png.flaticon.com/128/2088/2088617.png" style={{width: 14, height: 14, filter: "brightness(0) invert(0.9)"}} alt="Hours" /> Mon–Sun: 10 AM – 9 PM</p>
              <p style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}><img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" style={{width: 14, height: 14, filter: "brightness(0) invert(0.9)"}} alt="WhatsApp" /> +91 98765 43210</p>
            </div>
            <button className="btn-primary" style={{ marginTop: 20, width: "100%", background: C.gold, color: C.dark }} onClick={() => setPage("Contact")}>Book Appointment</button>
          </div>
        </div>
        <div style={{ borderTop: `1px solid rgba(212,175,55,.3)`, padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "#C8A8A8" }}>© 2025 Opulent Aura Luxury Salon. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "#C8A8A8", display: "flex", alignItems: "center", gap: 4 }}>Designed with <img src="https://cdn-icons-png.flaticon.com/128/18926/18926607.png" style={{width: 14, height: 14}} alt="Love" /> for Indian beauty</p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppBtn({ setPage }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
      <button onClick={() => setPage("Contact")} style={{
        background: C.maroon, color: "#fff", border: "none", padding: "10px 18px",
        borderRadius: 24, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
        cursor: "pointer", boxShadow: "0 4px 20px rgba(156,42,42,.4)", letterSpacing: .5
      }}><span style={{display: "flex", alignItems: "center", gap: 6}}><img src="https://cdn-icons-png.flaticon.com/128/2838/2838779.png" style={{width: 14, height: 14, filter: "brightness(0) invert(1)"}} alt="Book" /> Book Now</span></button>
      <div style={{
        width: 52, height: 52, background: "#25D366", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,.4)", cursor: "pointer", fontSize: 26
      }}><img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" style={{width: 30, height: 30, filter: "brightness(0) invert(1)"}} alt="WhatsApp" /></div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  return (
    <>
      <style>{fonts + globalCSS}</style>
      <Navbar page={page} setPage={setPage} />
      <TrustBar />
      <div style={{ paddingTop: 8 }}>
        {page === "Home" && <HomePage setPage={setPage} />}
        {page === "About" && <AboutPage />}
        {page === "Services" && <ServicesPage setPage={setPage} />}
        {page === "Gallery" && <GalleryPage />}
        {page === "Contact" && <ContactPage />}
      </div>
      <Footer setPage={setPage} />
      <WhatsAppBtn setPage={setPage} />
    </>
  );
}
