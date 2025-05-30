document.addEventListener('DOMContentLoaded', () => {
    // Loader
    // Hide loader after a delay (or after page fully loads)
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1500); // Adjust delay as needed

    // No seu script.js
document.querySelectorAll('.feedback-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
        // Opcional: resetar para uma posição padrão se desejar
        // card.style.setProperty('--mouse-x', `50%`);
        // card.style.setProperty('--mouse-y', `0%`);
    });
});

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        });

        function trailCursor() {
            const distX = cursorX - followerX;
            const distY = cursorY - followerY;

            followerX += distX * 0.2; // Adjust smoothing factor (0.1 to 0.5)
            followerY += distY * 0.2;

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(trailCursor);
        }
        requestAnimationFrame(trailCursor);


        // Cursor effects on hover
        const hoverElements = document.querySelectorAll('a, button, .service-card, .plan-card, input, textarea, .comparison-slider, .fab, .mobile-menu, .social-link');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                if (element.classList.contains('cta-button') || element.classList.contains('plan-button') || element.classList.contains('submit-button')) {
                    cursor.style.borderColor = 'var(--purple)';
                }
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'var(--neon-green)';
            });
        });
    }


    // Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%'; // Start at random Y
            particle.style.animationDelay = Math.random() * 15 + 's';
            const duration = 10 + Math.random() * 10; // Between 10 and 20 seconds
            particle.style.animationDuration = duration + 's';
            // Vary horizontal movement in animation
            particle.style.setProperty('--translateX-end', (Math.random() * 200 - 100) + 'px'); // Random between -100px and 100px
            particlesContainer.appendChild(particle);
        }
    }
    // Update @keyframes float in CSS to use var(--translateX-end) if you want JS to control it,
    // or keep the CSS animation as is if translateX(100px) is desired for all.
    // For now, CSS has fixed translateX(100px).

    // Scroll-based functionalities
    const scrollProgress = document.getElementById('scrollProgress');
    const header = document.getElementById('header');
    const fab = document.getElementById('fab');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }

        // Header background on scroll
        if (header) {
            if (window.scrollY > 50) { // Reduced threshold
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Show/hide FAB
        if (fab) {
            if (window.scrollY > 300) { // Reduced threshold
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open and a link is clicked
                if (navLinks && navLinks.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // FAB scroll to top
    if (fab) {
        fab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Before/After Sliders
    function initComparison() {
        const sliders = document.querySelectorAll('.comparison-slider');
        sliders.forEach(slider => {
            const handle = slider.querySelector('.slider-handle');
            const afterImage = slider.querySelector('.after-image');
            let isActive = false;

            if (!handle || !afterImage) return; // Skip if elements are missing

            function slide(e) {
                if (!isActive) return;
                e.preventDefault(); // Prevent page scrolling on touch

                let x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                x -= slider.getBoundingClientRect().left;
                const width = slider.offsetWidth;
                let percentage = (x / width) * 100;

                percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100

                handle.style.left = percentage + '%';
                afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            }

            // Desktop events
            handle.addEventListener('mousedown', () => isActive = true);
            slider.addEventListener('mousemove', slide); // Listen on slider for smoother drag
            
            // Mobile events
            handle.addEventListener('touchstart', (e) => {
                isActive = true;
                // e.preventDefault(); // Can prevent scroll, but might interfere with other touch interactions
            });
            slider.addEventListener('touchmove', slide);  // Listen on slider for smoother drag

            // Release events
            window.addEventListener('mouseup', () => isActive = false);
            window.addEventListener('touchend', () => isActive = false);
        });
    }
    initComparison();


    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const button = this.querySelector('.submit-button');
            if (!button) return;

            button.innerHTML = 'Transmitindo...';
            button.style.background = 'linear-gradient(135deg, var(--purple), var(--pink))';

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '✓ Mensagem Enviada!';
                button.style.background = 'linear-gradient(135deg, var(--neon-green), var(--cyan))'; // Back to original success
                this.reset();

                setTimeout(() => {
                    button.innerHTML = 'Transmitir Mensagem';
                    // Reset background if needed, or keep success color for a bit
                }, 3000);
            }, 2000);
        });
    }

    // Intersection Observer for animations on scroll
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        // rootMargin: '0px 0px -50px 0px' // Start animation a bit before it's fully in view
    };

    const animatedElements = document.querySelectorAll('.service-card, .plan-card, .contact-info, .contact-form, .section-title, .hero p, .cta-container, .comparison-slider');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        // Some elements might use translateY, others might not. Be selective.
        if (!el.classList.contains('hero') && !el.classList.contains('section-title') && !el.classList.contains('cta-container') && !el.classList.contains('comparison-slider')) {
           el.style.transform = 'translateY(40px)';
        } else if (el.classList.contains('section-title')) {
            el.style.transform = 'translateY(20px)';
        }
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observerInstance.unobserve(entry.target); // Optional: stop observing after animation
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero (optional, can be demanding)
    // const heroSection = document.querySelector('.hero');
    // if (heroSection) {
    //     window.addEventListener('scroll', () => {
    //         const scrolled = window.pageYOffset;
    //         // Apply a subtle parallax effect. Adjust the multiplier (0.3 to 0.5 is usually good)
    //         heroSection.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
    //     });
    // }
    // Note: The existing parallax in the JS was on the transform of the hero,
    // which might conflict with other transforms or be jerky.
    // backgroundPositionY is often smoother for parallax on backgrounds.
    // For the hero's ::before pseudo-element with gradients, true parallax is harder.
    // The current JS `hero.style.transform = translateY(${scrolled * 0.5}px)` was removed from the script
    // as it could interfere with the hero's layout. If you want it back, uncomment and test carefully.

}); // End of DOMContentLoaded

// No seu script.js

function initializeHorizontalScroller(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        // console.warn(`Seção com ID "${sectionId}" não encontrada para o scroller.`);
        return;
    }

    const wrapper = section.querySelector('.horizontal-scroll-wrapper');
    if (!wrapper) {
        // console.warn(`Wrapper ".horizontal-scroll-wrapper" não encontrado na seção "${sectionId}".`);
        return;
    }

    const scrollContainer = wrapper.querySelector('.services-grid, .feedback-grid');
    const prevArrow = wrapper.querySelector('.prev-arrow');
    const nextArrow = wrapper.querySelector('.next-arrow');

    if (!scrollContainer || !prevArrow || !nextArrow) {
        // console.warn(`Elementos de scroll (container, prevArrow, ou nextArrow) não encontrados na seção "${sectionId}".`);
        return;
    }

    const autoplayIntervalTime = 5000; // Intervalo do autoplay em milissegundos (5 segundos)
    let autoplayTimer = null;
    let userHasInteracted = false; // Flag para saber se o usuário já interagiu

    function updateArrowStates() {
        if (!scrollContainer) return;
        const tolerance = 5; // Pequena tolerância para o final da rolagem

        prevArrow.disabled = scrollContainer.scrollLeft <= tolerance;
        nextArrow.disabled = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - tolerance;
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null; // Limpa a referência do timer
    }

    function handleUserInteraction() {
        userHasInteracted = true;
        stopAutoplay();
    }

    function startAutoplay() {
        // Só inicia o autoplay se o usuário não interagiu E se for tela pequena
        if (userHasInteracted || window.innerWidth > 768) {
            stopAutoplay(); // Garante que esteja parado se não atender às condições
            return;
        }

        stopAutoplay(); // Limpa qualquer timer anterior para evitar múltiplos timers

        autoplayTimer = setInterval(() => {
            if (!scrollContainer) return;

            const currentScroll = scrollContainer.scrollLeft;
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            // Pega o primeiro card para estimar a largura do scroll
            const firstCard = scrollContainer.querySelector('.service-card, .feedback-card');
            const scrollAmount = firstCard ? firstCard.offsetWidth : scrollContainer.clientWidth * 0.8;
            // Considera o 'gap' se existir no container flex
            const gapStyle = window.getComputedStyle(scrollContainer).gap;
            const gapValue = gapStyle && gapStyle !== 'normal' ? parseFloat(gapStyle) : 0;


            if (currentScroll >= maxScroll - 5) { // Se estiver perto do fim (com tolerância)
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' }); // Volta para o início
            } else {
                scrollContainer.scrollBy({ left: scrollAmount + gapValue, behavior: 'smooth' });
            }
        }, autoplayIntervalTime);
    }


    prevArrow.addEventListener('click', () => {
        handleUserInteraction();
        if (!scrollContainer) return;
        const firstCard = scrollContainer.querySelector('.service-card, .feedback-card');
        const scrollAmount = firstCard ? firstCard.offsetWidth : scrollContainer.clientWidth * 0.8;
        const gapStyle = window.getComputedStyle(scrollContainer).gap;
        const gapValue = gapStyle && gapStyle !== 'normal' ? parseFloat(gapStyle) : 0;
        scrollContainer.scrollBy({ left: -(scrollAmount + gapValue), behavior: 'smooth' });
    });

    nextArrow.addEventListener('click', () => {
        handleUserInteraction();
        if (!scrollContainer) return;
        const firstCard = scrollContainer.querySelector('.service-card, .feedback-card');
        const scrollAmount = firstCard ? firstCard.offsetWidth : scrollContainer.clientWidth * 0.8;
        const gapStyle = window.getComputedStyle(scrollContainer).gap;
        const gapValue = gapStyle && gapStyle !== 'normal' ? parseFloat(gapStyle) : 0;
        scrollContainer.scrollBy({ left: scrollAmount + gapValue, behavior: 'smooth' });
    });

    scrollContainer.addEventListener('scroll', updateArrowStates);
    scrollContainer.addEventListener('touchstart', handleUserInteraction, { passive: true });


    // Lógica para iniciar/parar o autoplay com base no tamanho da tela e interação
    function checkAndSetAutoplay() {
        if (window.innerWidth <= 768 && !userHasInteracted) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
        updateArrowStates(); // Atualiza as setas também
    }

    // Observador para quando os cards estiverem realmente renderizados e com tamanho
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            if(entry.target.scrollWidth > 0) { // Garante que há conteúdo para rolar
                 checkAndSetAutoplay(); // Inicia ou para o autoplay
                 updateArrowStates(); // Estado inicial das setas
            }
        }
    });
    if (scrollContainer.children.length > 0) { // Só observa se tiver cards
        observer.observe(scrollContainer);
    }


    // Fallback e listener para redimensionamento da janela
    setTimeout(checkAndSetAutoplay, 300); // Pequeno delay para garantir que tudo carregou
    window.addEventListener('resize', () => {
        // Resetar userHasInteracted se quisermos que o autoplay volte ao redimensionar para mobile
        // Por ora, se o usuário interagiu uma vez, o autoplay não volta.
        checkAndSetAutoplay();
    });
}

// As chamadas para inicializar permanecem as mesmas, dentro do DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... seu código existente do loader, cursor, partículas, etc. ...

    initializeHorizontalScroller('services');
    initializeHorizontalScroller('feedback');

    // ... resto do seu script.js ...
});