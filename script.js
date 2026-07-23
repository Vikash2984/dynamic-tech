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
  ["Merit-style program built my confidence. I got the job I wanted.", "Monique", "Logistics Engineer"],
  ["I upskilled without spending time or money on college.", "Kory", "IT Software Developer"],
  ["Changed my life — transferable skills and real confidence.", "Briana", "IT Support Specialist"],
  ["Flexibility was great. Worked 50–60 hrs/week and still kept up.", "Heather", "Data Analyst"],
  ["The stepping stone I needed. My foot in the door.", "Laura", "EDI Coordinator"],
  ["New career in IT — opportunities I didn't have before.", "Joshua", "IT Support Analyst"],
  ["Would've cost more and taken longer at community college.", "Elizabeth", "Software Engineer"],
  ["I knew I had people in my corner, no matter how tough.", "Ebauni", "Business Analyst"],
  ["Gave me a chance to pursue what I actually wanted.", "Corey", "Cloud Ops Associate"],
  ["Learned how to pitch myself — resume, cover letter, all of it.", "Shonneri", "Operations Lead"],
  ["Hands-on training on real machines made all the difference.", "Ravi", "AC Technician"],
  ["From helper to supervisor in under a year.", "Priya", "Electrical Supervisor"]
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

const companies = ["JPMorganChase","Accenture","Infosys","Instacart","Lyft","DoorDash","Intact","Google","TCS","Wipro","Reliance","Tata Steel"];
document.getElementById('acTrack').innerHTML = [...companies,...companies].map(c=>`<span>${c}</span>`).join('');

// ===== contact form =====
document.getElementById('enquiryForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('formNote').textContent = "Thanks — we've received your enquiry and will call you shortly.";
  this.reset();
});
