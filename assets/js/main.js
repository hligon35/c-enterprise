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


  // Menu button toggles the entire nav overlay
  const menuBtn = document.querySelector('.menu-button');
  const siteNav = document.getElementById('site-nav');
  if(menuBtn && siteNav){
    menuBtn.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      siteNav.setAttribute('aria-hidden', String(!isOpen));
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    // Optional: close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      if(isOpen() && !siteNav.contains(e.target) && e.target !== menuBtn){
        closeMenu();
      }
    });
    document.addEventListener('keydown', (e) => {
      if(isOpen() && (e.key === 'Escape' || e.key === 'Esc')){
        closeMenu();
      }
    });
    function isOpen(){
      return siteNav.classList.contains('open');
    }
    function closeMenu(){
      siteNav.classList.remove('open');
      siteNav.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Menu button removed; dropdown handled via CSS hover on desktop and inline on mobile.

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

  // Theme removed: site uses single light theme via CSS variables.
  const root = document.body;

  // BACKGROUND COLOR FROM IMAGE
  function extractUrlFromCssBg(bg){
    if(!bg || bg === 'none') return null;
    // Handles url("..."), url('...'), url(...)
    const m = bg.match(/url\(["']?(.*?)["']?\)/i);
    return m && m[1] ? m[1] : null;
  }

  function averageColor(img){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const w = 16, h = 16;
    canvas.width = w; canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<data.length;i+=4){
      const a = data[i+3];
      if(a === 0) continue; // skip transparent
      r += data[i]; g += data[i+1]; b += data[i+2]; count++;
    }
    if(count === 0) return null;
    r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
  return { r, g, b };
  }

  function setPageBgFromImage(src){
    try{
      const img = new Image();
      img.onload = () => {
        try{
          const col = averageColor(img);
                if(col){
                  // Set a translucent overlay so the image is visible under it
                  const overlay = `rgba(${col.r}, ${col.g}, ${col.b}, 0.35)`;
                  root.style.setProperty('--bg-overlay', overlay);
                  // --bg remains the metallic base defined in CSS
                }
        }catch{}
      };
      // Ensure same-origin; assets are local
      img.crossOrigin = 'anonymous';
      img.src = src;
    }catch{}
  }

  function initDynamicBg(){
    let src = null;
    const hero = document.querySelector('.hero-media');
    if(hero){
      // Prefer an <img> child if present for accurate sampling
      const heroImg = hero.querySelector('img');
      if(heroImg && heroImg.getAttribute('src')){
        src = heroImg.getAttribute('src');
      } else {
        const bg = getComputedStyle(hero).backgroundImage;
        const u = extractUrlFromCssBg(bg);
        if(u) src = u;
      }
    }
    if(!src){
  // Prefer sampling the page background (lawn3). If we're in a subfolder (e.g., /services/), prefix with ../
  const isInServices = (typeof location !== 'undefined') && location.pathname && location.pathname.includes('/services/');
  const prefix = isInServices ? '../' : '';
  src = `${prefix}assets/images/lawn3.jpg`;
      // If that image fails later, code will still try hero media via computed style when present
    }
    setPageBgFromImage(src);
  }

  // Run after load to ensure CSS/bg computed and image is reachable
  if(document.readyState === 'complete') initDynamicBg();
  else window.addEventListener('load', initDynamicBg);
})();
