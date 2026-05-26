// ── Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// ── Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(16, 7, 32, 0.95)'
    : 'rgba(16, 7, 32, 0.8)';
});

// ── Art card click — fun wobble
document.querySelectorAll('.art-card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.transform = 'scale(0.95) rotate(-2deg)';
    setTimeout(() => { card.style.transform = ''; }, 300);
  });
});
