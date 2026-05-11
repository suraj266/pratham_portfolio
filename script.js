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

});
