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

const sections = document.querySelectorAll('section');
const linkById = new Map(
    Array.from(navLinks).map(link => [link.getAttribute('href')?.slice(1), link])
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = linkById.get(id);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    },
    { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0.1 }
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