// Basic client-side behavior
// - Mobile nav toggle
// - Current year
// - mailto form prefill workaround

(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const y = document.getElementById('year');
  if(y){ y.textContent = new Date().getFullYear(); }

  // mailto prefill: build a mailto URL including subject and body
  window.ces = window.ces || {};
  window.ces.onMailtoSubmit = function(e){
    const form = e.target;
    const email = 'hello@ceservices.example';
    const name = form.querySelector('#name')?.value || '';
    const phone = form.querySelector('#phone')?.value || '';
    const address = form.querySelector('#address')?.value || '';
    const services = form.querySelector('#services')?.value || '';
    const message = form.querySelector('#message')?.value || '';
    const subject = encodeURIComponent(`Lawn care quote request – ${name || 'New lead'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${form.querySelector('#email')?.value || ''}\nPhone: ${phone}\nAddress: ${address}\nServices: ${services}\n\nMessage:\n${message}`
    );
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = url;
    e.preventDefault();
    return false;
  }

  // THEME MANAGEMENT
  // Modes: 'auto' (default), 'light', 'dark'
  const THEME_KEY = 'ces_theme_mode';
  const root = document.body;
  const btn = document.getElementById('themeToggle');

  function inDaylightHours(d){
    // Switch at 7am and 7pm local time
    const h = d.getHours();
    return h >= 7 && h < 19; // 7:00 <= h < 19:00
  }

  function prefersDark(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(mode){
    let theme = 'dark';
    if(mode === 'light' || mode === 'dark'){
      theme = mode;
    } else {
      // auto mode: day => light, night => dark; use system as secondary hint
      const day = inDaylightHours(new Date());
      theme = day ? 'light' : 'dark';
      // Optional: if at boundary or ambiguous, fallback to system
      if(!day && !prefersDark()) theme = 'dark';
    }
    root.setAttribute('data-theme', theme);
    if(btn){ btn.textContent = theme === 'dark' ? 'Light' : 'Dark'; }
  }

  function getSavedMode(){
    return localStorage.getItem(THEME_KEY) || 'auto';
  }
  function saveMode(mode){
    localStorage.setItem(THEME_KEY, mode);
  }

  // Cycle: auto -> light -> dark -> auto
  function nextMode(mode){
    if(mode === 'auto') return 'light';
    if(mode === 'light') return 'dark';
    return 'auto';
  }

  let mode = getSavedMode();
  applyTheme(mode);

  if(btn){
    btn.addEventListener('click', () => {
      mode = nextMode(mode);
      saveMode(mode);
      applyTheme(mode);
    });
  }

  // Auto re-evaluate theme at the top of each hour
  setInterval(() => {
    if(mode === 'auto') applyTheme(mode);
  }, 60 * 60 * 1000);
})();
