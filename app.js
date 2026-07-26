/* ==========================================================================
   KAVIYA SANJAY - PORTFOLIO INTERACTION ENGINE (app.js)
   Features: GSAP Scroll Choreography, Lenis Scroll, Canvas Particles,
             Interactive Skills Graph, Service Switcher, Terminal Contact Form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // initCursor(); // Restored standard cursor (removed cyber cursor ring)
    initLoader();
    initNeuralBackground();
    initSkillsGraph();
    initServices();
    initTerminalContact();
    initGsapAnimations();
    initSmoothScroll();
    initVideoAudioToggle();
    initActiveNavLinks();
    initHeroTypewriter();
});

/* ==========================================================================
   1. CUSTOM CYBER CURSOR
   ========================================================================== */
function initCursor() {
    const cursor = document.getElementById('customCursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for center dot
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });
    
    // Smooth lag animation for external HUD targeting ring
    function tick() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        
        requestAnimationFrame(tick);
    }
    tick();

    // Hover effect additions
    const hoverElements = document.querySelectorAll('a, button, .st-tab, .glow-card, .glow-card-red, .btn, .terminal-submit-btn, .nav-item, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });
}

/* ==========================================================================
   2. INITIAL LOADER SIMULATION
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('progressBar');
    const percentText = document.getElementById('loaderPercentage');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 2;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            
            // Fade out animation
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => {
                    loader.style.display = 'none';
                    // Trigger hero reveals on loading complete
                    triggerHeroAnimations();
                }
            });
        }
        progress.style.width = `${currentProgress}%`;
        percentText.innerText = `${String(currentProgress).padStart(2, '0')}%`;
    }, 80);
}

/* ==========================================================================
   3. BACKGROUND NEURAL CANVAS (PARTICLE NET)
   ========================================================================== */
function initNeuralBackground() {
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = Math.min(65, Math.floor((width * height) / 20000));
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Very slow, gentle drift
            this.vx = (Math.random() - 0.5) * 0.12;
            this.vy = (Math.random() - 0.5) * 0.12;
            // Radii from 1 to 4 to simulate depth of field (larger ones are blurred bokeh)
            this.radius = Math.random() * 3 + 1;
            // Opacity
            this.alpha = Math.random() * 0.4 + 0.1;
            // Twilight twinkling effect
            this.sparkleSpeed = Math.random() * 0.008 + 0.002;
            this.sparkleDir = Math.random() > 0.5 ? 1 : -1;
            // Color: 70% warm-white, 30% cozy golden amber
            this.color = Math.random() > 0.3 ? '255, 255, 255' : '255, 202, 133';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Subtle twinkling
            this.alpha += this.sparkleDir * this.sparkleSpeed;
            if (this.alpha > 0.55 || this.alpha < 0.1) {
                this.sparkleDir *= -1;
            }
            
            // Loop boundaries for infinite space flow
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Draw radial gradient for subtle blurred glow on larger particles
            if (this.radius > 2.5) {
                let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
                grad.addColorStop(1, `rgba(${this.color}, 0)`);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            }
            ctx.fill();
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   4. INTERACTIVE COGNITIVE SKILLS GRAPH (2D CANVAS MODEL)
   ========================================================================== */
function initSkillsGraph() {
    const canvas = document.getElementById('skillsNetCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let rect = canvas.parentNode.getBoundingClientRect();
    let width = canvas.width = rect.width;
    let height = canvas.height = rect.height;
    
    const hudTitle = document.getElementById('hudNodeTitle');
    const hudData = document.getElementById('hudNodeData');
    
    // Tech nodes representation
    const skills = [
        { id: 'AI Integrations', label: 'AI Integrations', category: 'ai', radius: 32, x: width * 0.5, y: height * 0.5, info: 'Dynamic API connections, custom prompts, model routing pipelines' },
        { id: 'AI Handlers', label: 'AI Handlers', category: 'ai', radius: 26, x: width * 0.35, y: height * 0.4, info: 'Prompt design engineering, text/image gen workflow integrations' },
        { id: 'OpenAI API', label: 'OpenAI API', category: 'ai', radius: 22, x: width * 0.22, y: height * 0.32, info: 'GPT-4o integration, function calling, cognitive agents' },
        { id: 'Gemini API', label: 'Gemini API', category: 'ai', radius: 22, x: width * 0.2, y: height * 0.48, info: 'Google Gemini integration, API workflows' },
        
        { id: 'C Language', label: 'C Language', category: 'lang', radius: 28, x: width * 0.5, y: height * 0.25, info: 'Data structures, algorithm complexity, hardware interface logic' },
        { id: 'Java OOP', label: 'Java OOP', category: 'lang', radius: 28, x: width * 0.65, y: height * 0.28, info: 'Object-Oriented Programming, application logic, class abstractions' },
        
        { id: 'Figma Design', label: 'Figma Design', category: 'design', radius: 30, x: width * 0.68, y: height * 0.55, info: 'Interactive prototypes, component libraries, visual styling' },
        { id: 'UI/UX Design', label: 'UI/UX Design', category: 'design', radius: 25, x: width * 0.8, y: height * 0.48, info: 'User-centric navigation interfaces, layouts, design systems' },
        
        { id: 'Supabase', label: 'Supabase', category: 'web', radius: 28, x: width * 0.6, y: height * 0.72, info: 'Relational database tables, secure authentication, edge triggers' },
        { id: 'SQL DB', label: 'SQL DB', category: 'web', radius: 22, x: width * 0.75, y: height * 0.78, info: 'Relational data query commands, backend schemas' },
        { id: 'MongoDB', label: 'MongoDB', category: 'web', radius: 22, x: width * 0.45, y: height * 0.8, info: 'NoSQL collections, document data structures' },
        { id: 'Git / GitHub', label: 'Git / GitHub', category: 'dev', radius: 22, x: width * 0.88, y: height * 0.32, info: 'Version management, source code staging pipelines' }
    ];
    
    // Custom links mapping
    const connections = [
        { from: 'AI Integrations', to: 'AI Handlers' },
        { from: 'AI Handlers', to: 'OpenAI API' },
        { from: 'AI Handlers', to: 'Gemini API' },
        { from: 'AI Integrations', to: 'C Language' },
        { from: 'C Language', to: 'Java OOP' },
        { from: 'AI Integrations', to: 'Figma Design' },
        { from: 'Figma Design', to: 'UI/UX Design' },
        { from: 'Figma Design', to: 'Supabase' },
        { from: 'Supabase', to: 'SQL DB' },
        { from: 'Supabase', to: 'MongoDB' },
        { from: 'Java OOP', to: 'Git / GitHub' }
    ];
    
    let hoveredNode = null;
    let canvasMouse = { x: 0, y: 0 };
    
    canvas.addEventListener('mousemove', (e) => {
        const bounds = canvas.getBoundingClientRect();
        canvasMouse.x = e.clientX - bounds.left;
        canvasMouse.y = e.clientY - bounds.top;
        
        let found = null;
        for (let node of skills) {
            let dx = canvasMouse.x - node.x;
            let dy = canvasMouse.y - node.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < node.radius) {
                found = node;
                break;
            }
        }
        
        if (found !== hoveredNode) {
            hoveredNode = found;
            if (hoveredNode) {
                hudTitle.innerText = hoveredNode.label.toUpperCase();
                hudData.innerText = hoveredNode.info;
                canvas.style.cursor = 'none'; // Keep custom cursor
            } else {
                hudTitle.innerText = 'SELECT NODE';
                hudData.innerText = 'Hover over network nodes to inspect credentials.';
            }
        }
    });
    
    window.addEventListener('resize', () => {
        if (!canvas) return;
        rect = canvas.parentNode.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    });
    
    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 202, 133, 0.015)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
        
        // 1. Draw connecting lines
        connections.forEach(conn => {
            const fromNode = skills.find(n => n.id === conn.from);
            const toNode = skills.find(n => n.id === conn.to);
            if (fromNode && toNode) {
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                
                // Highlight line if either connected node is hovered
                if (hoveredNode && (hoveredNode.id === conn.from || hoveredNode.id === conn.to)) {
                    ctx.strokeStyle = 'rgba(255, 202, 133, 0.45)';
                    ctx.lineWidth = 1.5;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.lineWidth = 1;
                }
                ctx.stroke();
            }
        });
        
        // 2. Draw nodes
        skills.forEach(node => {
            // Apply slight organic float
            let time = Date.now() * 0.001;
            let floatX = Math.sin(time + node.x) * 0.15;
            let floatY = Math.cos(time + node.y) * 0.15;
            node.x += floatX;
            node.y += floatY;
            
            const isHovered = hoveredNode && hoveredNode.id === node.id;
            
            // Draw glow effect for hovered node
            if (isHovered) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 12, 0, Math.PI * 2);
                let grad = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius + 12);
                grad.addColorStop(0, 'rgba(255, 202, 133, 0.25)');
                grad.addColorStop(1, 'rgba(255, 202, 133, 0)');
                ctx.fillStyle = grad;
                ctx.fill();
            }
            
            // Main node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? 'rgba(255, 202, 133, 0.1)' : 'rgba(10, 10, 18, 0.8)';
            ctx.fill();
            
            // Set node category color
            let color = 'rgba(255, 255, 255, 0.15)';
            if (node.category === 'ai') color = 'rgba(255, 202, 133, 0.5)';
            if (node.category === 'web') color = 'rgba(255, 255, 255, 0.3)';
            if (node.category === 'design') color = 'rgba(255, 202, 133, 0.3)';
            if (node.category === 'dev') color = 'rgba(255, 215, 0, 0.35)';
            
            ctx.strokeStyle = isHovered ? 'var(--color-primary)' : color;
            ctx.lineWidth = isHovered ? 2 : 1;
            ctx.stroke();
            
            // Label text inside node
            ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.7)';
            ctx.font = `bold ${Math.max(9, node.radius * 0.35)}px var(--font-mono)`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);
        });
        
        requestAnimationFrame(drawGraph);
    }
    drawGraph();
}

/* ==========================================================================
   5. SERVICES TERMINAL TAB SWITCHER
   ========================================================================== */
function initServices() {
    const tabs = document.querySelectorAll('.st-tab');
    const contents = document.querySelectorAll('.st-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = `srv-${tab.dataset.service}`;
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                targetContent.classList.add('active');
                
                // GSAP text animation on switch
                gsap.fromTo(targetContent.querySelectorAll('.srv-title, .srv-para, .srv-bullets li'), 
                    { opacity: 0, x: -10 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 }
                );
            }
        });
    });
}

/* ==========================================================================
   6. INTERACTIVE CONTACT FORM SUBMISSION
   ========================================================================== */
function initTerminalContact() {
    const form = document.getElementById('handshakeForm');
    const statusLog = document.getElementById('formStatusLog');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('visitorName').value;
        
        if (statusLog) {
            statusLog.innerText = 'Sending payload...';
            statusLog.className = 'form-status-log info';
            statusLog.style.opacity = '1';
        }
        
        setTimeout(() => {
            if (statusLog) {
                statusLog.innerText = `Thank you, ${name}! Your message has been dispatched successfully.`;
                statusLog.className = 'form-status-log success';
            }
            form.reset();
        }, 1200);
    });
}

/* ==========================================================================
   7. GSAP SCROLL & HERO ENTRANCES
   ========================================================================== */
function initGsapAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initially hide elements configured to fade in
    gsap.set('[data-gsap="fade-up"]', { opacity: 0, y: 30 });
    gsap.set('[data-gsap="fade-in"]', { opacity: 0 });
    
    // Sequential section title fades
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        const title = sec.querySelector('.section-title');
        const line = sec.querySelector('.section-line');
        if (title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -30,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
        if (line) {
            gsap.from(line, {
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.8,
                delay: 0.2,
                ease: 'power2.out'
            });
        }
    });

    // Experience Card timeline reveal
    const expItems = document.querySelectorAll('.timeline-item');
    expItems.forEach(item => {
        const body = item.querySelector('.timeline-body');
        const dot = item.querySelector('.timeline-dot');
        const date = item.querySelector('.timeline-date');
        
        gsap.from([dot, date, body], {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Projects card scroll grid animations
    const projCards = document.querySelectorAll('.project-card, .featured-project');
    projCards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Achievements glow cards scroll animations
    const credCards = document.querySelectorAll('.credential-card');
    credCards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

function triggerHeroAnimations() {
    // Sequenced reveal of hero titles and visuals
    const tl = gsap.timeline();
    
    tl.to('[data-gsap="fade-up"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    tl.to('[data-gsap="fade-in"]', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.6');
}

/* ==========================================================================
   8. LENIS SMOOTH SCROLL INTEGRATION
   ========================================================================== */
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple/Linear smooth curve
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);
    
    // Bind navbar anchor clicks to Lenis smooth scroll targets
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    lenis.scrollTo(targetEl, {
                        offset: -80, // Offset for navigation bar height
                        immediate: false,
                        duration: 1.2
                    });
                }
            }
        });
    });
}

/* ==========================================================================
   9. VIDEO AUDIO TOGGLE
   ========================================================================== */
function initVideoAudioToggle() {
    const video = document.getElementById('heroVideo');
    const toggleBtn = document.getElementById('audioToggle');
    const icon = document.getElementById('audioIcon');
    
    if (!video || !toggleBtn || !icon) return;
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        
        if (video.muted) {
            icon.setAttribute('data-lucide', 'volume-x');
        } else {
            icon.setAttribute('data-lucide', 'volume-2');
        }
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });
}

/* ==========================================================================
   10. ACTIVE NAVBAR HIGHLIGHTING ON SCROLL
   ========================================================================== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    
    if (sections.length === 0 || navItems.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset for nav bar height
        
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}` && !item.classList.contains('active-btn')) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   11. HERO TITLE TYPEWRITER ANIMATION (SCROLL RE-TRIGGERABLE)
   ========================================================================== */
function initHeroTypewriter() {
    const nameEl = document.getElementById('typewriterName');
    if (!nameEl) return;
    
    const text = "KAVIYA SANJAY";
    let typeTimeout = null;
    
    function startTyping() {
        if (typeTimeout) {
            clearTimeout(typeTimeout);
        }
        
        nameEl.innerHTML = '';
        nameEl.classList.add('typing');
        let charIndex = 0;
        const typingSpeed = 100;
        
        function type() {
            if (charIndex < text.length) {
                nameEl.innerHTML += text.charAt(charIndex);
                charIndex++;
                typeTimeout = setTimeout(type, typingSpeed);
            } else {
                // Keep the cursor blinking briefly, then remove
                setTimeout(() => {
                    nameEl.classList.remove('typing');
                }, 1500);
            }
        }
        type();
    }

    ScrollTrigger.create({
        trigger: "#hero",
        start: "top 60%",
        onEnter: () => startTyping(),
        onEnterBack: () => startTyping()
    });
}
