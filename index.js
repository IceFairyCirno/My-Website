const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

document.getElementById("downloadCv").onclick = function() {
    window.alert("Nice Try Diddy\nContact Me for My CV")
};

const sections = document.querySelectorAll('section');
const linkById = new Map(
    Array.from(navLinks).map(link => [link.getAttribute('href')?.slice(1), link])
);

// Track intersection ratios to determine the most visible section
const sectionRatios = new Map();

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            sectionRatios.set(id, entry.intersectionRatio);
        });
        
        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeId = null;
        
        sectionRatios.forEach((ratio, id) => {
            if (ratio > maxRatio) {
                maxRatio = ratio;
                activeId = id;
            }
        });
        
        // Update active nav link
        if (activeId && maxRatio > 0.1) {
            navLinks.forEach(l => l.classList.remove('active'));
            const link = linkById.get(activeId);
            if (link) {
                link.classList.add('active');
            }
        }
    },
    { root: null, rootMargin: '-20% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
);

sections.forEach(sec => observer.observe(sec));

document.getElementById('year').textContent = new Date().getFullYear();

// Photo Carousel functionality
const profilePhoto = document.getElementById('profilePhoto');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicators = document.querySelectorAll('.indicator');

// Array of profile images
const profileImages = [
  'assets/profile_pic.png',
  'assets/profile_pic2.png',
  'assets/profile_pic3.png'
];

let currentImageIndex = 0;
let autoPlayInterval;

// Function to change image
function changeImage(index) {
  // Fade out
  profilePhoto.style.opacity = '0';
  
  setTimeout(() => {
    currentImageIndex = index;
    profilePhoto.src = profileImages[index];
    profilePhoto.style.opacity = '1';
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }, 250);
}

// Function to go to next image
function nextImage() {
  const nextIndex = (currentImageIndex + 1) % profileImages.length;
  changeImage(nextIndex);
}

// Function to go to previous image
function previousImage() {
  const prevIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
  changeImage(prevIndex);
}

// Start auto-play
function startAutoPlay() {
  autoPlayInterval = setInterval(nextImage, 5000); // Change every 5 seconds
}

// Stop auto-play
function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// Event listeners for navigation buttons
prevBtn.addEventListener('click', () => {
  previousImage();
  stopAutoPlay();
  startAutoPlay(); // Restart auto-play
});

nextBtn.addEventListener('click', () => {
  nextImage();
  stopAutoPlay();
  startAutoPlay(); // Restart auto-play
});

// Event listeners for indicators
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    changeImage(index);
    stopAutoPlay();
    startAutoPlay(); // Restart auto-play
  });
});

// Pause auto-play on hover
profilePhoto.addEventListener('mouseenter', stopAutoPlay);
profilePhoto.addEventListener('mouseleave', startAutoPlay);

// Start auto-play when page loads
startAutoPlay();

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const submitBtn = contactForm.querySelector('.btn-primary');

contactForm.addEventListener('submit', function(e) {
    // Change button text to show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Form will submit to Formspree automatically
    // You can add additional validation here if needed
});

// ==== Snowfall background (respect reduced motion) ====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const snowCanvas = document.getElementById('snowCanvas');
if (snowCanvas && !prefersReducedMotion) {
  const ctx = snowCanvas.getContext('2d');
  let width = snowCanvas.width = window.innerWidth;
  let height = snowCanvas.height = window.innerHeight;

  const flakes = [];
  const FLAKE_COUNT = Math.min(180, Math.floor((width * height) / 30000));
  const TWO_PI = Math.PI * 2;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function createFlake() {
    const size = rand(1, 3.2);
    return {
      x: rand(0, width),
      y: rand(-height, 0),
      r: size,
      speedY: rand(0.25, 0.9) + size * 0.05,
      driftX: rand(-0.4, 0.4),
      phase: rand(0, TWO_PI)
    };
  }

  for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(createFlake());

  function resize() {
    width = snowCanvas.width = window.innerWidth;
    height = snowCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  let lastTime = 0;
  function tick(ts) {
    const dt = Math.min(32, ts - lastTime);
    lastTime = ts;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(200, 240, 255, 0.9)';
    ctx.shadowColor = 'rgba(111,211,255,0.4)';
    ctx.shadowBlur = 6;

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.speedY * (dt / 16);
      f.x += Math.sin((f.y + f.phase) * 0.01) * 0.4 + f.driftX * (dt / 16);

      if (f.y - f.r > height) {
        flakes[i] = createFlake();
        flakes[i].y = -f.r;
      }

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, TWO_PI);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ==== Subtle 3D tilt on project cards ====
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  let rafId = null;
  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 6;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }
  function reset() {
    if (rafId) cancelAnimationFrame(rafId);
    card.style.transform = '';
  }
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', reset);
});

// ==== Ice crystal particle effects ====
function createIceParticle() {
  const particle = document.createElement('div');
  particle.className = 'ice-particle';
  particle.innerHTML = '❄';
  particle.style.cssText = `
    position: fixed;
    pointer-events: none;
    font-size: ${Math.random() * 8 + 8}px;
    color: rgba(200, 241, 255, 0.8);
    z-index: 9999;
    left: ${Math.random() * window.innerWidth}px;
    top: -20px;
    animation: ice-fall ${Math.random() * 3 + 2}s linear forwards;
  `;
  document.body.appendChild(particle);
  
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 5000);
}

// Add CSS for ice particles
const style = document.createElement('style');
style.textContent = `
  @keyframes ice-fall {
    to {
      transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Create ice particles periodically (respect reduced motion)
if (!prefersReducedMotion) {
  setInterval(createIceParticle, 2000);
}