const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevButton = document.querySelector('.carousel-button-prev');
const nextButton = document.querySelector('.carousel-button-next');
let currentSlide = 0;
let carouselInterval;
let touchStartX = 0;
let touchEndX = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    slide.setAttribute('aria-hidden', 'true');
    dots[i].classList.remove('active');
    dots[i].setAttribute('aria-selected', 'false');
  });
  
  slides[index].classList.add('active');
  slides[index].setAttribute('aria-hidden', 'false');
  dots[index].classList.add('active');
  dots[index].setAttribute('aria-selected', 'true');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startCarousel() {
  showSlide(0);
  carouselInterval = setInterval(nextSlide, 3000);
}

function stopCarousel() {
  clearInterval(carouselInterval);
  carouselInterval = null;
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
          prevSlide();
      } else {
          nextSlide();
      }
  }
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      stopCarousel();
  });
});

prevButton.addEventListener('click', () => {
  prevSlide();
  stopCarousel();
});

nextButton.addEventListener('click', () => {
  nextSlide();
  stopCarousel();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
      stopCarousel();
  } else {
      startCarousel();
  }
});

const carousel = document.querySelector('.carousel-container');
carousel.addEventListener('touchstart', handleTouchStart);
carousel.addEventListener('touchend', handleTouchEnd);

carousel.addEventListener('mouseenter', stopCarousel);
carousel.addEventListener('mouseleave', startCarousel);

window.addEventListener('load', startCarousel);

window.addEventListener('focus', () => {
  if (!carouselInterval) {
      startCarousel();
  }
});

window.addEventListener('blur', () => {
  stopCarousel();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
      prevSlide();
      stopCarousel();
  } else if (event.key === 'ArrowRight') {
      nextSlide();
      stopCarousel();
  }
});
