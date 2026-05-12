document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navBtn = document.querySelector('.nav-btn');

    // Create mobile menu overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    
    // Clone links for mobile
    const linksClone = navLinks.cloneNode(true);
    const btnClone = navBtn.cloneNode(true);
    
    mobileMenu.appendChild(linksClone);
    mobileMenu.appendChild(btnClone);
    document.body.appendChild(mobileMenu);

    // Style mobile menu dynamically or we can add it to CSS, 
    // let's add basic styles here to keep CSS clean from too many media queries
    mobileMenu.style.position = 'fixed';
    mobileMenu.style.top = '0';
    mobileMenu.style.left = '100%';
    mobileMenu.style.width = '100%';
    mobileMenu.style.height = '100vh';
    mobileMenu.style.backgroundColor = 'var(--primary-blue)';
    mobileMenu.style.display = 'flex';
    mobileMenu.style.flexDirection = 'column';
    mobileMenu.style.alignItems = 'center';
    mobileMenu.style.justifyContent = 'center';
    mobileMenu.style.gap = '30px';
    mobileMenu.style.transition = 'var(--transition-smooth)';
    mobileMenu.style.zIndex = '999';

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.style.color = 'var(--white)';
        link.style.fontSize = '1.5rem';
        link.style.textDecoration = 'none';
        
        // Close menu on click
        link.addEventListener('click', () => {
            mobileMenu.style.left = '100%';
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    hamburger.addEventListener('click', () => {
        if (mobileMenu.style.left === '100%') {
            mobileMenu.style.left = '0';
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenu.style.left = '100%';
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // 4. Smooth Scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Scroll-Driven Parallax for Work Rows
    const scrollRows = document.querySelectorAll('.scroll-row');
    const maxShift = 150; // Maximum horizontal shift in pixels

    function updateScrollRows() {
        scrollRows.forEach(row => {
            const wrapper = row.parentElement;
            const rect = wrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how far the section is through the viewport (0 to 1)
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewProgress = 1 - ((sectionTop + sectionHeight) / (windowHeight + sectionHeight));
            // Clamp to 0-1
            const progress = Math.max(0, Math.min(1, viewProgress));

            // Map progress (0->1) to shift (-maxShift -> +maxShift)
            const shift = (progress - 0.5) * 2 * maxShift;

            const direction = row.getAttribute('data-direction');
            if (direction === 'ltr') {
                row.style.transform = `translateX(${shift}px)`;
            } else {
                row.style.transform = `translateX(${-shift}px)`;
            }
        });

        requestAnimationFrame(updateScrollRows);
    }

    requestAnimationFrame(updateScrollRows);

    // 6. Lightbox Popup (Images + Videos)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.getElementById('lightbox-close');

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Reset both media
        lightboxImg.classList.remove('active-media');
        lightboxImg.src = '';
        lightboxVideo.classList.remove('active-media');
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }

    // Open lightbox for IMAGE cards
    document.querySelectorAll('.work-card[data-lightbox]').forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-lightbox');
            lightboxImg.src = imgSrc;
            lightboxImg.classList.add('active-media');
            lightboxVideo.classList.remove('active-media');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Open lightbox for VIDEO cards
    document.querySelectorAll('.work-card[data-video]').forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video');
            lightboxVideo.src = videoSrc;
            lightboxVideo.classList.add('active-media');
            lightboxImg.classList.remove('active-media');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Video card hover preview: play on hover, pause on leave
    document.querySelectorAll('.work-card-video').forEach(card => {
        const video = card.querySelector('video');
        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {}); // Ignore autoplay errors
        });
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

});
