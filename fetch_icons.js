async function run() {
  for (const q of ['instagram', 'facebook', 'youtube']) {
    const res = await fetch('https://www.flaticon.com/free-icons/' + q);
    const txt = await res.text();
    const urls = txt.match(/https:\/\/cdn-icons-png\.flaticon\.com\/[^\"]+/g);
    console.log(q, urls ? Array.from(new Set(urls)).filter(u => u.includes('128')).slice(0, 1) : 'none');
  }
}
run();
