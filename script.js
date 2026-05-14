const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('nav');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileLinks = document.getElementById('mobile-links');
const stats = document.querySelectorAll('[data-target]');
const progressElements = document.querySelectorAll('.progress-fill');
const revealElements = document.querySelectorAll('.reveal');
const typedText = document.getElementById('typed-text');

const roles = ['Frontend Development', 'UI/UX Strategy', 'Automation Workflows', 'Design Systems'];
let roleIndex = 0;
let charIndex = 0;
let typingForward = true;

function updateTypedText() {
  const current = roles[roleIndex];
  if (typingForward) {
    charIndex += 1;
    if (charIndex > current.length) {
      typingForward = false;
      setTimeout(updateTypedText, 1800);
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex < 0) {
      typingForward = true;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(updateTypedText, 300);
      return;
    }
  }
  typedText.textContent = current.slice(0, charIndex);
  setTimeout(updateTypedText, typingForward ? 90 : 45);
}

function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('shadowed');
  } else {
    navbar.classList.remove('shadowed');
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(entry) {
  const element = entry.target;
  const target = Number(element.dataset.target);
  const startTime = performance.now();
  function update(time) {
    const progress = Math.min((time - startTime) / 1500, 1);
    element.textContent = Math.floor(target * easeOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${target}+`;
    }
  }
  requestAnimationFrame(update);
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.dataset.target) {
      animateCounter(entry);
      observer.unobserve(entry.target);
    }
    if (entry.target.classList.contains('progress-fill')) {
      entry.target.style.width = `${entry.target.dataset.width}%`;
      observer.unobserve(entry.target);
    }
    if (entry.target.classList.contains('reveal')) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}

const observer = new IntersectionObserver(handleIntersect, {
  threshold: 0.2,
});

stats.forEach(stat => observer.observe(stat));
progressElements.forEach(bar => observer.observe(bar));
revealElements.forEach(item => observer.observe(item));

window.addEventListener('scroll', handleScroll);
updateTypedText();

if (mobileMenuToggle && mobileLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileLinks.classList.toggle('open');
  });
}

mobileLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileLinks.classList.remove('open'));
});
