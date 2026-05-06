const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/gridTemplateColumns: "gridTemplateColumns: \\"repeat\(auto-fit, minmax\(([0-9]+px),1fr\)\)\\"" \/\* grid \*\//g, 'gridTemplateColumns: "repeat(auto-fit, minmax($1,1fr))"');
// Wait, the double quotes in App.jsx are `gridTemplateColumns: "gridTemplateColumns: "repeat..."" /* grid */`. So the inner quotes are literally quotes.
// Let's just use regex to match that specifically.
code = code.replace(/gridTemplateColumns: "gridTemplateColumns: "repeat\(auto-fit, minmax\(([0-9]+px),1fr\)\)"" \/\* grid \*\//g, 'gridTemplateColumns: "repeat(auto-fit, minmax($1,1fr))"');

// Wait, the footer grid might have the same issue?
// Wait, the footer grid was replaced with:
// `<div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 40, paddingBottom: 48 }}>`
// Let's check if the previous replace modified the footer grid. The previous script ran:
// `code.replace(/gridTemplateColumns: "repeat\(auto-fit, minmax\([0-9]+px,1fr\)\)"/g, ...)`
// Then the next replace was for footer grid.
// Let's just fix the broken ones.
fs.writeFileSync('src/App.jsx', code);
