import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const isMotionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const isSlowDevice = navigator.hardwareConcurrency <= 4;

const lenis = new Lenis({
    duration: isMotionOK ? 1.2 : 0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: isMotionOK,
    touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

// Unified RAF loop using GSAP ticker to prevent duplicate layout reflows
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function splitChars(el) {
    const text = el.textContent;
    const chars = text.split('');
    el.textContent = '';
    chars.forEach(c => {
        const s = document.createElement('span');
        s.textContent = c === ' ' ? '\u00A0' : c;
        s.style.display = 'inline-block';
        el.appendChild(s);
    });
    return [...el.children];
}

function wrapWords(el) {
    const nodes = [...el.childNodes];
    el.innerHTML = '';
    const spans = [];
    
    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const tokens = text.split(/(\s+)/);
            tokens.forEach(token => {
                if (token.trim() === '') {
                    const s = document.createElement('span');
                    s.textContent = token;
                    s.style.display = 'inline-block';
                    s.style.whiteSpace = 'pre';
                    el.appendChild(s);
                } else {
                    const s = document.createElement('span');
                    s.textContent = token;
                    s.style.display = 'inline-block';
                    s.classList.add('hover-word');
                    if (token.toLowerCase().includes('silence') || token.toLowerCase().includes('artifacts')) {
                        s.classList.add('text-[#E8AC41]');
                    }
                    el.appendChild(s);
                    spans.push(s);
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'BR') {
                el.appendChild(node.cloneNode(true));
            } else {
                const text = node.textContent;
                const tokens = text.split(/(\s+)/);
                tokens.forEach(token => {
                    if (token.trim() === '') {
                        const s = document.createElement('span');
                        s.textContent = token;
                        s.style.display = 'inline-block';
                        s.style.whiteSpace = 'pre';
                        el.appendChild(s);
                    } else {
                        const s = document.createElement('span');
                        s.textContent = token;
                        s.style.display = 'inline-block';
                        s.classList.add('hover-word', 'text-[#E8AC41]');
                        el.appendChild(s);
                        spans.push(s);
                    }
                });
            }
        }
    });
    return spans;
}

function lerp(a, b, t) { return a + (b - a) * t; }

document.addEventListener('DOMContentLoaded', () => {
    const mm = gsap.matchMedia();

    /* ---------- PARTICLES ---------- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas && isMotionOK && !isSlowDevice) {
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];
        const COUNT = 60;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.scale(dpr, dpr);
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: -(Math.random() * 0.3 + 0.1),
                    r: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.4 + 0.1,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;

                // High-performance square rendering: bypasses slow vector path rasterization
                ctx.fillStyle = `rgba(232, 172, 65, ${p.alpha})`;
                ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            });
            requestAnimationFrame(draw);
        }

        resize();
        initParticles();
        draw();
        window.addEventListener('resize', () => { resize(); initParticles(); });
    }

    /* ---------- SCROLL PROGRESS ---------- */
    gsap.to('#scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* ---------- HERO ---------- */
        // Set initial state for cup reveal
        gsap.set('#hero-product', { yPercent: 15, opacity: 0 });

        const initiateHero = () => {
            document.body.classList.add('revealed');
            gsap.to('#hero-nav, #hero-hint', { opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.8 });
            
            // Smoothly lift and reveal the coffee cup image
            gsap.to('#hero-product', { 
                yPercent: -8, 
                opacity: 1, 
                duration: 2.5, 
                ease: 'power4.out',
                delay: 0.2
            });
        };
        window.addEventListener('scroll', initiateHero, { once: true });
        setTimeout(initiateHero, 1500);

        gsap.to('#hero-bg-text', {
            yPercent: 40, ease: 'none',
            scrollTrigger: { trigger: '#hero-entrance', start: 'top top', end: 'bottom top', scrub: 1 }
        });

        gsap.to('#hero-product img', {
            yPercent: 18, scale: 1.08, ease: 'none',
            scrollTrigger: { trigger: '#hero-entrance', start: 'top top', end: 'bottom top', scrub: 1 }
        });

        gsap.fromTo('#hero-hint',
            { y: 0, opacity: 1 },
            { y: -100, opacity: 0, ease: 'none',
                scrollTrigger: { trigger: '#hero-entrance', start: 'top top', end: 'bottom top', scrub: 1 }
            }
        );

        const heroH1 = document.querySelector('#hero-bg-text');
        if (heroH1) {
            const chars = splitChars(heroH1);
            gsap.fromTo(chars,
                { yPercent: 100, opacity: 0, rotateX: -90 },
                { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.02, ease: 'power4.out', delay: 1.8 }
            );
        }

        /* ---------- GLOW FLOATING ---------- */
        document.querySelectorAll('.blur-\\[100px\\], .blur-\\[120px\\], .blur-\\[150px\\]').forEach((el, i) => {
            gsap.to(el, {
                x: gsap.utils.random(-40, 40),
                y: gsap.utils.random(-40, 40),
                scale: gsap.utils.random(0.85, 1.15),
                duration: gsap.utils.random(8, 14),
                ease: 'sine.inOut',
                repeat: -1, yoyo: true,
                delay: i * 0.4
            });
        });

        /* ---------- SECTIONS CLIP REVEAL ---------- */
        document.querySelectorAll('section').forEach((section, i) => {
            if (i === 0) return;
            gsap.fromTo(section,
                { clipPath: 'inset(3% 0 100% 0)' },
                {
                    clipPath: 'inset(0% 0 0% 0)',
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        /* ---------- REVEAL NODES ---------- */
        gsap.utils.toArray('.reveal-node').forEach(node => {
            gsap.fromTo(node,
                { opacity: 0, y: 60, scale: 0.98 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1.4, ease: 'power4.out',
                    scrollTrigger: {
                        trigger: node,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        /* ---------- QUOTE TEXT SPLIT ---------- */
        const quoteBlock = document.querySelector('blockquote');
        if (quoteBlock) {
            const words = wrapWords(quoteBlock);
            gsap.fromTo(words,
                { yPercent: 80, opacity: 0, rotateZ: -5 },
                {
                    yPercent: 0, opacity: 1, rotateZ: 0,
                    duration: 1.2, stagger: 0.04,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: quoteBlock,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        /* ---------- SECTION HEADERS ---------- */
        document.querySelectorAll('h2:not(#hero-bg-text)').forEach(header => {
            const words = wrapWords(header);
            gsap.fromTo(words,
                { yPercent: 100, opacity: 0 },
                {
                    yPercent: 0, opacity: 1,
                    duration: 1.2, stagger: 0.03,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        /* ---------- SIGNATURE CARDS ---------- */
        gsap.fromTo('.signature-card',
            { opacity: 0, y: 50, scale: 0.95, rotationX: 15 },
            {
                opacity: 1, y: 0, scale: 1, rotationX: 0,
                duration: 1.2, stagger: 0.12,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.signature-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        /* ---------- VIDEO CONTAINER ---------- */
        gsap.fromTo('.video-container',
            { opacity: 0, scale: 0.94, rotationY: -5 },
            {
                opacity: 1, scale: 1, rotationY: 0,
                duration: 1.6, ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.video-container',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        /* ---------- VIDEO PLAYBACK ---------- */
        const videoEl = document.querySelector('.video-container video');
        if (videoEl) {
            ScrollTrigger.create({
                trigger: '.video-container',
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => { if (videoEl.paused) videoEl.play(); },
                onLeave: () => { if (!videoEl.paused) videoEl.pause(); },
                onEnterBack: () => { if (videoEl.paused) videoEl.play(); },
                onLeaveBack: () => { if (!videoEl.paused) videoEl.pause(); }
            });
        }

        /* ---------- NAVBAR STICKY BG ---------- */
        const navBar = document.querySelector('#hero-nav');
        if (navBar) {
            ScrollTrigger.create({
                trigger: '#alchemy',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(navBar, {
                        paddingTop: '1.5rem',
                        paddingBottom: '1.5rem',
                        duration: 0.5,
                        ease: 'power3.out',
                        backgroundColor: 'rgba(16, 12, 8, 0.85)',
                        backdropFilter: 'blur(12px)'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(navBar, {
                        paddingTop: '2.5rem',
                        paddingBottom: '2.5rem',
                        duration: 0.5,
                        ease: 'power3.out',
                        backgroundColor: 'transparent',
                        backdropFilter: 'blur(0px)'
                    });
                }
            });
        }

        /* ---------- HAVEN CARD 3D TILT ---------- */
        const havenCard = document.getElementById('haven-card');
        if (havenCard) {
            havenCard.addEventListener('mousemove', (e) => {
                const rect = havenCard.getBoundingClientRect();
                const mx = (e.clientX - rect.left) / rect.width - 0.5;
                const my = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(havenCard, {
                    rotationY: mx * 15,
                    rotationX: -my * 15,
                    transformPerspective: 1000,
                    ease: 'power2.out',
                    duration: 0.6
                });
            });
            havenCard.addEventListener('mouseleave', () => {
                gsap.to(havenCard, {
                    rotationY: -1,
                    rotationX: 0,
                    ease: 'elastic.out(1, 0.5)',
                    duration: 1
                });
            });
        }



        /* ---------- BTN MICRO-INTERACTIONS ---------- */
        document.querySelectorAll('a[href*="#"], button').forEach(btn => {
            btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' }));
            btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }));
            btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.1, ease: 'power2.out' }));
            btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' }));
        });

        /* ---------- SIGNATURE CARD LIFT + SPOTLIGHT ---------- */
        document.querySelectorAll('.signature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(232,172,65,0.15)',
                    duration: 0.4, ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: 'none',
                    duration: 0.6, ease: 'elastic.out(1, 0.5)'
                });
            });

            const light = document.createElement('div');
            light.style.cssText = 'pointer-events:none;position:absolute;inset:0;border-radius:inherit;opacity:0;transition:opacity 0.3s;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(232,172,65,0.12) 0%,transparent 60%);z-index:1;';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.prepend(light);

            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top) / r.height) * 100;
                light.style.setProperty('--mx', x + '%');
                light.style.setProperty('--my', y + '%');
                light.style.opacity = '1';
            });
            card.addEventListener('mouseleave', () => { light.style.opacity = '0'; });
        });

        /* ---------- PINNED SHOWCASE ANIMATION ---------- */
        const texts = gsap.utils.toArray('.flavor-text-item');
        const imgs = gsap.utils.toArray('.flavor-img');

        // Explicitly set initial states in GSAP to prevent flashes
        gsap.set(texts.slice(1), { opacity: 0, y: 30 });
        gsap.set(imgs.slice(1), { opacity: 0, scale: 0.85 });

        const showcaseTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.showcase-section',
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1,
            }
        });

        // Step 0 -> Step 1 (Obsidian Latte -> Amber Cold Brew)
        showcaseTl
            .to(texts[0], { opacity: 0, y: -30, duration: 0.5 }, 'step1')
            .to(imgs[0], { opacity: 0, scale: 1.15, duration: 0.5 }, 'step1')
            .to('.showcase-numbers-wrapper', { yPercent: -25, duration: 0.5 }, 'step1')
            .to(texts[1], { opacity: 1, y: 0, duration: 0.5 }, 'step1+=0.2')
            .to(imgs[1], { opacity: 1, scale: 1, duration: 0.5 }, 'step1+=0.2')
            .to({}, { duration: 0.3 });

        // Step 1 -> Step 2 (Amber Cold Brew -> Velvet Espresso)
        showcaseTl
            .to(texts[1], { opacity: 0, y: -30, duration: 0.5 }, 'step2')
            .to(imgs[1], { opacity: 0, scale: 1.15, duration: 0.5 }, 'step2')
            .to('.showcase-numbers-wrapper', { yPercent: -50, duration: 0.5 }, 'step2')
            .to(texts[2], { opacity: 1, y: 0, duration: 0.5 }, 'step2+=0.2')
            .to(imgs[2], { opacity: 1, scale: 1, duration: 0.5 }, 'step2+=0.2')
            .to({}, { duration: 0.3 });

        // Step 2 -> Step 3 (Velvet Espresso -> Cerulean Pour)
        showcaseTl
            .to(texts[2], { opacity: 0, y: -30, duration: 0.5 }, 'step3')
            .to(imgs[2], { opacity: 0, scale: 1.15, duration: 0.5 }, 'step3')
            .to('.showcase-numbers-wrapper', { yPercent: -75, duration: 0.5 }, 'step3')
            .to(texts[3], { opacity: 1, y: 0, duration: 0.5 }, 'step3+=0.2')
            .to(imgs[3], { opacity: 1, scale: 1, duration: 0.5 }, 'step3+=0.2')
            .to({}, { duration: 0.3 });

        /* ---------- LENIS NAV SCROLL ---------- */
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
                }
            });
        });
    });

    /* ---------- REDUCED MOTION FALLBACK ---------- */
    mm.add('(prefers-reduced-motion: reduce)', () => {
        document.querySelectorAll('.reveal-node, .signature-card, .video-container').forEach(el => {
            el.style.opacity = '1';
        });
        const nav = document.querySelector('#hero-nav');
        const hint = document.querySelector('#hero-hint');
        const heroProduct = document.querySelector('#hero-product');
        if (nav) nav.style.opacity = '1';
        if (hint) hint.style.opacity = '1';
        if (heroProduct) {
            heroProduct.style.opacity = '1';
            heroProduct.style.transform = 'none';
        }
        document.body.classList.add('revealed');
    });

    ScrollTrigger.refresh();
});

console.log('AERIS — Midnight Collective Cafe | GSAP + Lenis');