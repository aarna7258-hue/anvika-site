document.addEventListener('DOMContentLoaded', () => {
  // Make everything visible immediately
  document.querySelectorAll('.reveal, .fade-up, [data-reveal]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });
});