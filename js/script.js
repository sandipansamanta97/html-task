
        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.pageX + 'px';
            cursor.style.top = e.pageY + 'px';
        });
        
        document.querySelectorAll('a, button, .interactive-card, .portfolio-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const navContainer = document.getElementById('nav-container');
            const backToTop = document.getElementById('back-to-top');
            
            if (window.scrollY > 100) {
                navContainer.classList.add('scrolled');
            } else {
                navContainer.classList.remove('scrolled');
            }
            
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            // Update active nav link based on scroll position
            updateActiveNavLink();
            
            // Animate skills on scroll
            animateSkills();
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
        
        // Back to top
        document.getElementById('back-to-top').addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Update active nav link based on scroll position
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // Animated counter for stats
        function animateCounter() {
            const stats = document.querySelectorAll('.stat-number');
            const circles = document.querySelectorAll('circle[id^="circle"]');
            
            const targets = [250, 150, 98];
            const durations = [2000, 1800, 1500];
            
            stats.forEach((stat, index) => {
                let current = 0;
                const increment = targets[index] / (durations[index] / 16);
                
                const updateCounter = () => {
                    if (current < targets[index]) {
                        current += increment;
                        stat.textContent = Math.floor(current);
                        if (circles[index]) {
                            const circumference = 2 * Math.PI * 58;
                            const offset = circumference - (current / targets[index]) * circumference;
                            circles[index].style.strokeDasharray = `${circumference} ${circumference}`;
                            circles[index].style.strokeDashoffset = offset;
                            circles[index].style.stroke = index === 2 ? '#00a91c' : '#005ea2';
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = targets[index] + (index === 2 ? '%' : '+');
                    }
                };
                
                updateCounter();
            });
        }
        
        // Trigger counter animation when stats section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.hero-section'));
        
        // Animate skills on scroll
        function animateSkills() {
            const skillBars = document.querySelectorAll('.skill-progress');
            const skillPercents = document.querySelectorAll('.skill-percent');
            
            skillBars.forEach((bar, index) => {
                const rect = bar.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
                
                if (isInView && !bar.dataset.animated) {
                    const targetWidth = bar.dataset.width;
                    bar.style.width = targetWidth + '%';
                    bar.dataset.animated = true;
                    
                    // Animate percentage
                    let current = 0;
                    const target = parseInt(skillPercents[index].dataset.target);
                    const increment = target / 50;
                    
                    const animatePercent = () => {
                        if (current < target) {
                            current += increment;
                            skillPercents[index].textContent = Math.floor(current) + '%';
                            setTimeout(animatePercent, 20);
                        } else {
                            skillPercents[index].textContent = target + '%';
                        }
                    };
                    
                    animatePercent();
                }
            });
        }
        
        // Testimonial carousel
        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i === (index - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev');
                }
            });
            
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
            
            currentSlide = index;
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 5000);
        
        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple form validation
                const formData = new FormData(this);
                let isValid = true;
                
                for (let [key, value] of formData.entries()) {
                    if (!value.trim()) {
                        isValid = false;
                        break;
                    }
                }
                
                if (isValid) {
                    // Show success animation
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        this.reset();
                        
                        // Reset form labels
                        document.querySelectorAll('.form-label').forEach(label => {
                            label.style.top = '1rem';
                            label.style.fontSize = '1rem';
                            label.style.color = '#999';
                        });
                    }, 2000);
                } else {
                    alert('Please fill in all required fields.');
                }
            });
        }
        
        // Create floating particles
        function createParticles() {
            const container = document.getElementById('particles-container');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                const size = Math.random() * 10 + 5;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = Math.random() * 20 + 10 + 's';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particle.style.opacity = Math.random() * 0.5 + 0.2;
                
                container.appendChild(particle);
            }
        }
        
        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            animateSkills();
            
            // Add tilt effect to interactive cards
            document.querySelectorAll('.interactive-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateY = (x - centerX) / 25;
                    const rotateX = (centerY - y) / 25;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });
            
            // Typing effect
            const typingText = document.getElementById('typing');
            const texts = [
                "Creating beautiful, interactive digital experiences that drive results...",
                "Transforming ideas into exceptional digital solutions...",
                "Where innovation meets exceptional user experience..."
            ];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            function typeWriter() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typingText.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingText.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(typeWriter, 2000);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(typeWriter, 500);
                } else {
                    const speed = isDeleting ? 50 : 100;
                    setTimeout(typeWriter, speed);
                }
            }
            
            // Start typing effect after a delay
            setTimeout(typeWriter, 1000);
            
            // Add hover effect to social icons
            document.querySelectorAll('.social-icon').forEach(icon => {
                icon.addEventListener('mouseenter', (e) => {
                    e.target.style.transform = 'translateY(-5px) scale(1.2)';
                });
                
                icon.addEventListener('mouseleave', (e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
    