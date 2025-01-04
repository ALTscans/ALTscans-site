document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoplayInterval;
    let isTransitioning = false;

    function updateSlide(index, direction = null) {
        if (isTransitioning) return;
        isTransitioning = true;

        const currentSlideElement = slides[currentSlide];
        currentSlideElement.classList.add('fade-out');

        setTimeout(() => {
        currentSlideElement.classList.remove('active', 'fade-out');
        currentSlide = index;
        
        track.style.transform = `translateX(-${index * 25}%)`;
        slides[index].classList.add('active');
        
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
            indicator.setAttribute('aria-selected', i === index);
        });

        if (direction) {
            const button = direction === 'prev' ? prevButton : nextButton;
            button.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
            button.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
        }, 500);
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slideCount;
        updateSlide(newIndex, 'next');
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slideCount) % slideCount;
        updateSlide(newIndex, 'prev');
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
        if (index !== currentSlide) {
            updateSlide(index);
            stopAutoplay();
            startAutoplay();
        }
        });

        indicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (index !== currentSlide) {
            updateSlide(index);
            stopAutoplay();
            startAutoplay();
            }
        }
        });
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        startAutoplay();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplay();
    });

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay);
    track.addEventListener('touchend', startAutoplay);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
        startAutoplay();
        } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
        startAutoplay();
        }
    });

    startAutoplay();
    });

function handleClick(element, url) {
    element.classList.add('clicking');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

let prof = document.getElementById("profile-action");
prof.onclick = function() {
    location.href = "/login.html"
};