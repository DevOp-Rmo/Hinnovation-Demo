document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Management ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check for saved theme preference, default to 'light' if none exists
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply logic based on the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
    
    // Apply saved or default theme on load
    applyTheme(currentTheme);
    
    // Toggle theme event
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- AOS Initialization ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const bgCursorGlow = document.querySelector('.bg-cursor-glow');
    
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            if(bgCursorGlow) {
                bgCursorGlow.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 2000, fill: "forwards" });
            }
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover-active');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover-active');
            });
        });
    }

    // --- tsParticles Background ---
    const getParticleConfig = (theme) => {
        const isDark = theme === 'dark';
        return {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                    resize: true,
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 0.8 } },
                },
            },
            particles: {
                color: { value: isDark ? "#3B82F6" : "#2563EB" },
                links: { color: isDark ? "#10B981" : "#059669", distance: 150, enable: true, opacity: isDark ? 0.3 : 0.6, width: 1 },
                move: { enable: true, speed: 0.8, outModes: { default: "bounce" } },
                number: { density: { enable: true, area: 800 }, value: 50 },
                opacity: { value: isDark ? 0.5 : 0.7 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
        };
    };

    let particlesLoader;
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", getParticleConfig(currentTheme)).then(container => {
            particlesLoader = container;
        });
    }

    // Wrap the theme change logic to update particles
    const oldApplyTheme = applyTheme;
    applyTheme = (theme) => {
        oldApplyTheme(theme);
        if (particlesLoader) {
            particlesLoader.options.load(getParticleConfig(theme));
            particlesLoader.refresh();
        }
    };

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            document.getElementById('navbar').classList.toggle('menu-active');
            const icon = mobileNav.classList.contains('active') ? 'x' : 'menu';
            mobileMenuBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
            if(typeof lucide !== 'undefined') lucide.createIcons();
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.getElementById('navbar').classList.remove('menu-active');
                mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
                if(typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
    }

    // --- Hero Slider Logic ---
    const slides = document.querySelectorAll('.slide');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let currentSlide = 0;
    let sliderInterval;

    const heroContent = [
        {
            title: 'Java Base <br><span class="gradient-text">Research Systems</span>',
            desc: 'Pioneering high-performance Java-based research tools and integrated software products since 2003.'
        },
        {
            title: 'Intelligent <br><span class="gradient-text">ERP Solutions</span>',
            desc: 'Streamline your organization with our robust, scalable ERP systems designed for educational and industrial excellence.'
        },
        {
            title: 'Modern <br><span class="gradient-text">Website Design</span>',
            desc: 'Creating premium, high-converting digital experiences that blend aesthetic beauty with technical precision.'
        },
        {
            title: 'Making <br><span class="gradient-text">Applications</span>',
            desc: 'From mobile to cloud, we build scalable full-stack applications that empower your digital future.'
        }
    ];

    function updateHeroText(index) {
        if (!heroTitle || !heroDesc) return;

        // Fade out
        heroTitle.style.opacity = '0';
        heroDesc.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroDesc.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroTitle.innerHTML = heroContent[index].title;
            heroDesc.textContent = heroContent[index].desc;

            // Fade in
            heroTitle.style.opacity = '1';
            heroDesc.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
            heroDesc.style.transform = 'translateY(0)';
        }, 500);
    }

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        updateHeroText(currentSlide);
        resetTimer();
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function resetTimer() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 8000);
    }

    // Event Listeners for Nav Buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Initial icon creation for newly added buttons
    if(typeof lucide !== 'undefined') lucide.createIcons();

    // Initialize first slide text
    if (heroTitle && heroDesc) {
        heroTitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        heroDesc.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        updateHeroText(0);
    }

    // Start Slider
    sliderInterval = setInterval(nextSlide, 8000); // Slower speed: 8 seconds per slide

    // --- Team Section Tiered Load More (5+5+5+5+2 = 22) ---
    const loadMoreTeamBtn = document.getElementById('load-more-team');
    if (loadMoreTeamBtn) {
        let loadStep = 0; // 0: 5, 1: 10, 2: 15, 3: 20, 4: 22 (All)

        // Helper: reveal a batch with staggered animation
        function revealBatch(members) {
            members.forEach((member, index) => {
                member.style.display = 'flex';
                member.classList.remove('team-card-reveal');
                // Force reflow so animation restarts
                void member.offsetWidth;
                member.style.animationDelay = `${index * 90}ms`;
                member.classList.add('team-card-reveal', 'aos-init', 'aos-animate');
            });
        }
        
        loadMoreTeamBtn.addEventListener('click', function() {
            const batchA = document.querySelectorAll('.batch-a');
            const batchB = document.querySelectorAll('.batch-b');
            const batchC = document.querySelectorAll('.batch-c');
            const batchD = document.querySelectorAll('.batch-d');
            
            if (loadStep === 0) {
                revealBatch(batchA);
                loadStep = 1;
                this.innerHTML = `Load More <i data-lucide="chevron-down" style="margin-left: 8px; width: 18px;"></i>`;
            } else if (loadStep === 1) {
                revealBatch(batchB);
                loadStep = 2;
                this.innerHTML = `Load More <i data-lucide="chevron-down" style="margin-left: 8px; width: 18px;"></i>`;
            } else if (loadStep === 2) {
                revealBatch(batchC);
                loadStep = 3;
                this.innerHTML = `Load More <i data-lucide="chevron-down" style="margin-left: 8px; width: 18px;"></i>`;
            } else if (loadStep === 3) {
                revealBatch(batchD);
                loadStep = 4;
                this.innerHTML = `Hide <i data-lucide="chevron-up" style="margin-left: 8px; width: 18px;"></i>`;
                this.classList.add('expanded');
            } else {
                // Reset: Hide all batches (Back to 5)
                [...batchA, ...batchB, ...batchC, ...batchD].forEach(member => {
                    member.style.display = 'none';
                    member.style.animationDelay = '';
                    member.classList.remove('aos-init', 'aos-animate', 'team-card-reveal');
                });
                loadStep = 0;
                this.innerHTML = `Load More <i data-lucide="chevron-down" style="margin-left: 8px; width: 18px;"></i>`;
                this.classList.remove('expanded');
                // Pulse-ring effect on reset
                this.classList.add('pulse-ring');
                setTimeout(() => this.classList.remove('pulse-ring'), 700);
                document.getElementById('team').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 150);
            }
        });
    }

    // --- 3D Hover Tilt Effect ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit max rotation degrees
            const maxRotate = 8;
            
            const rotateX = ((y - centerY) / centerY) * -maxRotate;
            const rotateY = ((x - centerX) / centerX) * maxRotate;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            // Reset transform on mouse leave
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            setTimeout(() => {
                if(!el.matches(':hover')){
                    el.style.transform = '';
                }
            }, 300);
        });
    });
    // --- The Orbital Launcher (Back to Top Redesign) ---
    const launcherBtn = document.getElementById('back-to-top');
    if (launcherBtn) {
        const ringCircle = launcherBtn.querySelector('.progress-ring-circle');
        const radius = ringCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        ringCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        ringCircle.style.strokeDashoffset = circumference;
        
        function updateProgress(percent) {
            // Recalculate radius/circumference in case of resize
            const currentRadius = ringCircle.r.baseVal.value;
            const currentCircumference = 2 * Math.PI * currentRadius;
            
            ringCircle.style.strokeDasharray = `${currentCircumference} ${currentCircumference}`;
            const offset = currentCircumference - (percent / 100) * currentCircumference;
            ringCircle.style.strokeDashoffset = offset;
            
            // Dynamic Neon Effect: Change glow intensity based on progress
            if (percent > 90) {
                ringCircle.style.filter = 'url(#neonGlow) brightness(1.5)';
            } else {
                ringCircle.style.filter = 'url(#neonGlow)';
            }
        }
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            updateProgress(scrollPercent);
            
            if (window.scrollY > 400) {
                launcherBtn.classList.add('visible');
            } else {
                launcherBtn.classList.remove('visible');
            }
        });
        
        launcherBtn.addEventListener('click', () => {
            if (launcherBtn.classList.contains('launching')) return;

            // Step 1: Ignition (Glow and Pulse)
            launcherBtn.classList.add('igniting');
            
            setTimeout(() => {
                // Step 2: The Launch
                launcherBtn.classList.remove('igniting');
                launcherBtn.classList.add('launching');
                
                // Smooth scroll to top with high precision
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Step 3: Reset after return
                setTimeout(() => {
                    launcherBtn.classList.remove('launching');
                    launcherBtn.classList.remove('visible');
                }, 800);
            }, 400); // 400ms "Ignition" phase
        });
    }
});
