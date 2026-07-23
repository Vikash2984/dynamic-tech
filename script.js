// ===== rotating hero words (Merit America-style slide) =====
(function(){
  const line = document.querySelector('.hp-rline');
  if(!line) return;
  const words = line.querySelectorAll('.hp-cw');
  const last = words.length - 1;
  let cur = 0;
  const DWELL = 1600;
  const show = i => {
    words.forEach((w,k) => w.classList.toggle('is-active', k===i));
    line.style.transform = 'translateX(' + (-words[i].offsetLeft) + 'px)';
  };
  const step = () => {
    if(cur < last){ cur++; show(cur); setTimeout(step, DWELL); }
    else { setTimeout(() => { line.style.transition='none'; cur=0; show(0); requestAnimationFrame(()=>{ line.style.transition=''; setTimeout(step, DWELL); }); }, DWELL*1.4); }
  };
  const start = () => { show(0); setTimeout(step, DWELL); };
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.addEventListener('resize', () => { const t=line.style.transition; line.style.transition='none'; show(cur); requestAnimationFrame(()=>{ line.style.transition=t; }); });
})();

// ===== nav: burger + active tab spy + smooth tab jump =====
// ===== cover flow carousel =====
(function(){
  const flow = document.getElementById('coverFlow');
  if(!flow) return;
  const cards = Array.from(flow.querySelectorAll('.cf-card'));
  const n = cards.length;
  let center = 0;
  const layout = () => {
    cards.forEach((c,i) => {
      let d = i - center;
      if(d > n/2) d -= n;
      if(d < -n/2) d += n;
      c.dataset.pos = (Math.abs(d) <= 2) ? String(d) : 'hide';
    });
  };
  cards.forEach((c,i) => c.addEventListener('click', () => { center = i; layout(); reset(); }));
  let timer;
  const reset = () => { clearInterval(timer); timer = setInterval(() => { center = (center+1) % n; layout(); }, 3200); };
  layout(); reset();
})();

const burger = document.getElementById('burger');
const navLinks = document.querySelector('.ma-nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));

const scroller = document.getElementById('scroller');
document.querySelectorAll('[data-tab]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){ scroller.scrollTo({top: target.offsetTop, behavior:'smooth'}); }
    navLinks.classList.remove('open');
    // preselect course in contact form
    const c = a.dataset.course;
    if(c){ const sel = document.getElementById('courseSelect'); if(sel) sel.value = c; }
  });
});

// active nav underline via IntersectionObserver on scroller
const navA = document.querySelectorAll('.ma-nav-links a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navA.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, {root: scroller, threshold: 0.55});
document.querySelectorAll('.snap-sec').forEach(s => spy.observe(s));

// ===== alumni parallax carousels (auto-populate) =====
const testimonials = [
  ["Placed at Imdad, UAE — earning AED 3,400/month.", "MD Jawed", "Imdad · UAE"],
  ["Placed at Bara Kali LLP, UAE — earning AED 2,500/month.", "Arman Ansari", "Bara Kali LLP · UAE"],
  ["Placed at Gisco, UAE — earning AED 2,100/month.", "Jissu", "Gisco · UAE"],
  ["Placed at Ejadah, UAE — earning AED 2,500/month.", "Adil", "Ejadah · UAE"],
  ["Placed at Ejadah, UAE — earning AED 1,800/month.", "MD Samir Ansari", "Ejadah · UAE"],
  ["Placed at Gisco, UAE — earning AED 1,300/month.", "Samir Khan", "Gisco · UAE"],
  ["Placed at Gisco, UAE — earning AED 1,300/month.", "MD Samir", "Gisco · UAE"],
  ["Placed at Gisco, UAE — earning AED 1,300/month.", "Sultan Khan", "Gisco · UAE"],
  ["Placed at Lux Design Villas, UAE — earning AED 1,400/month.", "Rohit Ansari", "Lux Design Villas · UAE"],
  ["Placed at Gisco, UAE — earning AED 1,300/month.", "MD Farhan", "Gisco · UAE"],
  ["Placed at Oxy Pro, UAE — earning AED 1,500/month.", "MD Asif", "Oxy Pro · UAE"],
  ["Placed in Kuwait — earning KWD 250/month.", "MD Imran", "Kuwait"],
  ["Placed in Saudi Arabia — earning SAR 2,500/month.", "Arzu", "Saudi Arabia"],
  ["Placed in Saudi Arabia — earning SAR 1,800/month.", "Faizal Khan", "Saudi Arabia"]
];
function card(t){
  const [q,n,r] = t;
  const initials = n.split(' ').map(x=>x[0]).join('');
  return `<div class="acard"><p>${q}</p><div class="who"><div class="av">${initials}</div><div><b>${n}</b><span>${r}</span></div></div></div>`;
}
const half = Math.ceil(testimonials.length/2);
const rowA = testimonials.slice(0, half), rowB = testimonials.slice(half);
document.getElementById('ptrackA').innerHTML = [...rowA, ...rowA].map(card).join('');
document.getElementById('ptrackB').innerHTML = [...rowB, ...rowB].map(card).join('');

const companies = ["Izadah — UAE","Al Dhabi Group — UAE","Arees — Saudi Arabia","Madinat Jalfar — UAE","Marmoom — UAE","ZRT Contracting LLC — UAE","El Seif Engineering — Saudi Arabia","Whitespot — UAE","Elegancia — Rwanda","BK Gulf LLC — UAE","Oxypro — UAE","LG","Samsung","Hitachi","Blue Star","Daikin","Carrier","Whirlpool","Panasonic","O General","Mitsubishi"];
document.getElementById('acTrack').innerHTML = [...companies,...companies].map(c=>`<span>${c}</span>`).join('');

// ===== contact form =====
document.getElementById('enquiryForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('formNote').textContent = "Thanks — we've received your enquiry and will call you shortly.";
  this.reset();
});
