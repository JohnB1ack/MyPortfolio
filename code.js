/*
 *  PORTFOLIO INTERACTIVE SYSTEM
 *  - Comprehensive modular JavaScript for portfolio interactivity
 *  - Organized into modules for clean separation of concerns
 *  - Handles constellation effects, Marex Hub, mobile layout, and animations
 */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================
    // CONFIGURATION & STATE MANAGEMENT
    // ==========================================================

    // Global configuration
    const CONFIG = {
        // Star system configuration
        starCount: {
            desktop: 300,
            mobile: 150
        },
        starColors: [
            '#ffffff',    // White (most common)
            '#fff8f0',    // Warm white
            '#fffaf5',    // Cool white
            '#fff5e6',    // Slightly warm
            '#f8f8ff',    // Blue-white (hot stars)
            '#fff0e6',    // Warm yellow-white
            '#ffeaa7',    // Yellow (sun-like)
            '#ffcc99'     // Orange (cooler stars)
        ],
        nebulaCount: {
            desktop: 6,
            mobile: 3
        },
        connectionRange: {
            desktop: 200,
            mobile: 150
        },
        // Mobile breakpoint
        mobileBreakpoint: 768,
        // Animation timing
        animationSpeed: 0.016
    };

    // Global state management
    const STATE = {
        // Device detection
        isMobile: false,
        isTouch: false,

        // Mouse tracking
        mouse: {
            x: null,
            y: null,
            lastX: undefined,
            lastY: undefined,
            lastTime: undefined
        },

        // Canvas and context
        canvas: null,
        ctx: null,

        // Animation state
        animationTime: 0,
        animationFrameId: null,

        // Interactive elements
        allNodes: [],
        projectCards: [],

        // Particle systems
        stars: [],
        nebulaClouds: [],
        shootingStars: [],
        mouseTrails: [],
        connectionParticles: [],
        glassShards: []
    };

    // ==========================================================
    // UTILITY FUNCTIONS
    // ==========================================================

    const Utils = {
        // Mobile and touch detection
        detectMobile() {
            STATE.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            STATE.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            return STATE.isMobile;
        },

        // Initialize canvas
        initCanvas() {
            STATE.canvas = document.getElementById('canvas-background');
            if (!STATE.canvas) return false;
            STATE.ctx = STATE.canvas.getContext('2d');
            return true;
        },

        // Resize canvas
        resizeCanvas() {
            if (!STATE.canvas) return;
            STATE.canvas.width = window.innerWidth;
            STATE.canvas.height = window.innerHeight;
        }
    };

    // ==========================================================
    // MODULE 1: DEVICE MANAGER
    // Handles device detection and responsive behavior
    // ==========================================================

    const DeviceManager = {
        init() {
            Utils.detectMobile();
            this.setupEventListeners();
        },

        setupEventListeners() {
            // Touch event handlers
            if (STATE.isTouch && STATE.canvas) {
                STATE.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
                STATE.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
                STATE.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            }

            // Mouse events for desktop
            if (!STATE.isTouch) {
                window.addEventListener('mousemove', this.handleMouseMove.bind(this));
            }

            // Window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        },

        handleTouchStart(e) {
            if (e.touches && e.touches.length > 0) {
                STATE.mouse.x = e.touches[0].clientX;
                STATE.mouse.y = e.touches[0].clientY;
            }
        },

        handleTouchMove(e) {
            if (e.touches && e.touches.length > 0) {
                STATE.mouse.x = e.touches[0].clientX;
                STATE.mouse.y = e.touches[0].clientY;
            }
        },

        handleTouchEnd(e) {
            setTimeout(() => {
                STATE.mouse.x = null;
                STATE.mouse.y = null;
            }, 300);
        },

        handleMouseMove(e) {
            STATE.mouse.x = e.clientX;
            STATE.mouse.y = e.clientY;
        },

        handleResize() {
            Utils.resizeCanvas();
            const wasMobile = STATE.isMobile;
            Utils.detectMobile();

            // If switching between mobile and desktop, rebuild interface
            if (wasMobile !== STATE.isMobile) {
                this.handleDeviceSwitch();
            }

            StarFieldManager.createEnhancedStarField();
        },

        handleDeviceSwitch() {
            // Clear existing nodes
            STATE.allNodes.length = 0;
            STATE.projectCards.length = 0;

            // Reset mobile layout adjustments when switching to desktop
            const projectGrid = document.getElementById('project-grid');
            const messageCard = document.querySelector('.message-card');
            if (projectGrid) projectGrid.classList.remove('marex-expanded');
            if (messageCard) messageCard.classList.remove('mobile-push-down');

            // Rebuild interface
            UIController.initializeProjectCards();
            UIController.initializeMarexHub();
        }
    };


    // ==========================================================
    // MODULE 2: STAR FIELD MANAGER
    // Handles star field creation and management
    // ==========================================================

    const StarFieldManager = {
        createEnhancedStarField() {
            STATE.stars = [];
            STATE.nebulaClouds = [];

            // Create main stars with enhanced variety
            const starCount = STATE.isMobile ? CONFIG.starCount.mobile : CONFIG.starCount.desktop;
            for (let i = 0; i < starCount; i++) {
                const starType = Math.random();
                let radius, opacity, twinkleSpeed, color, isSpecial;

                if (starType < 0.8) {
                    // Regular white/dim stars (80%)
                    radius = Math.random() * 1.2 + 0.3;
                    opacity = Math.random() * 0.5 + 0.3;
                    twinkleSpeed = Math.random() * 0.012 + 0.005;
                    color = Math.random() < 0.9 ? '#ffffff' : CONFIG.starColors[Math.floor(Math.random() * 3)];
                    isSpecial = false;
                } else if (starType < 0.95) {
                    // Brighter stars with subtle color (15%)
                    radius = Math.random() * 2 + 0.8;
                    opacity = Math.random() * 0.4 + 0.6;
                    twinkleSpeed = Math.random() * 0.018 + 0.008;
                    color = CONFIG.starColors[Math.floor(Math.random() * 5)];
                    isSpecial = false;
                } else {
                    // Rare bright stars (5%)
                    radius = Math.random() * 2.5 + 1.2;
                    opacity = Math.random() * 0.3 + 0.7;
                    twinkleSpeed = Math.random() * 0.02 + 0.01;
                    color = CONFIG.starColors[Math.floor(Math.random() * CONFIG.starColors.length)];
                    isSpecial = true;
                }

                STATE.stars.push({
                    x: Math.random() * STATE.canvas.width,
                    y: Math.random() * STATE.canvas.height,
                    radius: radius,
                    baseOpacity: opacity,
                    opacity: opacity,
                    twinkleSpeed: twinkleSpeed,
                    twinklePhase: Math.random() * Math.PI * 2,
                    color: color,
                    pulseSpeed: Math.random() * 0.8 + 0.4,
                    isSpecial: isSpecial,
                    z: Math.random() * 0.5 + 0.5,
                    connectionStrength: 0
                });
            }

            // Create subtle nebula clouds for depth
            const nebulaCount = STATE.isMobile ? CONFIG.nebulaCount.mobile : CONFIG.nebulaCount.desktop;
            for (let i = 0; i < nebulaCount; i++) {
                STATE.nebulaClouds.push({
                    x: Math.random() * STATE.canvas.width,
                    y: Math.random() * STATE.canvas.height,
                    radius: Math.random() * 250 + 150,
                    color: Math.random() < 0.5 ? 'rgba(88, 166, 255, 0.02)' : 'rgba(173, 216, 255, 0.015)',
                    drift: {
                        x: (Math.random() - 0.5) * 0.03,
                        y: (Math.random() - 0.5) * 0.03
                    },
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.5 + 0.2
                });
            }
        },

        createShootingStar() {
            if (STATE.shootingStars.length < 2 && Math.random() < 0.001) {
                const startX = Math.random() * STATE.canvas.width;
                const startY = Math.random() * STATE.canvas.height * 0.5;
                const angle = Math.random() * Math.PI / 4 + Math.PI / 6;

                STATE.shootingStars.push({
                    x: startX,
                    y: startY,
                    length: Math.random() * 80 + 40,
                    speed: Math.random() * 4 + 2,
                    angle: angle,
                    opacity: 1,
                    trail: []
                });
            }
        },

        updateShootingStars() {
            STATE.shootingStars = STATE.shootingStars.filter(star => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity *= 0.98;

                // Add to trail
                star.trail.push({ x: star.x, y: star.y, opacity: star.opacity });
                if (star.trail.length > 15) star.trail.shift();

                return star.opacity > 0.01 && star.x < STATE.canvas.width && star.y < STATE.canvas.height;
            });
        }
    };

    // ==========================================================
    // MODULE 3: UI CONTROLLER
    // Handles all DOM interactions and UI state management
    // ==========================================================

    const UIController = {
        init() {
            this.initializeProjectCards();
            this.initializeMarexHub();
        },

        initializeProjectCards() {
            STATE.allNodes = [];
            STATE.projectCards = [];

            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const node = {
                    element: card,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    type: 'project'
                };
                STATE.allNodes.push(node);
                STATE.projectCards.push(node);
            });
        },

        initializeMarexHub() {
            const marexHub = document.getElementById('marex-hub');
            const marexMainCard = marexHub?.querySelector('.marex-main-card');
            const subCards = document.querySelectorAll('.sub-card');
            const projectGrid = document.getElementById('project-grid');
            const messageCard = document.querySelector('.message-card');
            let isExpanded = false;

            if (!marexHub || !marexMainCard) return;

            // Toggle function with mobile layout handling
            const toggleMarexHub = () => {
                isExpanded = !isExpanded;

                if (isExpanded) {
                    marexHub.classList.add('expanded');

                    // Mobile layout adjustment
                    if (STATE.isMobile && messageCard) {
                        projectGrid?.classList.add('marex-expanded');
                        messageCard.classList.add('mobile-push-down');
                    }

                    // Create expansion particle effect
                    this.createExpansionEffect(marexMainCard);

                    // Animate sub-cards with stagger
                    subCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0) scale(1)';
                            card.style.opacity = '1';
                        }, index * 100);
                    });

                } else {
                    marexHub.classList.remove('expanded');

                    // Reset mobile layout adjustment
                    if (STATE.isMobile && messageCard) {
                        projectGrid?.classList.remove('marex-expanded');
                        messageCard.classList.remove('mobile-push-down');
                    }

                    // Reset sub-card animations
                    subCards.forEach(card => {
                        card.style.transform = '';
                        card.style.opacity = '';
                    });
                }
            };

            // Event listeners
            marexMainCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMarexHub();
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (isExpanded && !marexHub.contains(e.target)) {
                    toggleMarexHub();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isExpanded) {
                    toggleMarexHub();
                }
            });
        },

        createExpansionEffect(element) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Create purple burst effect for Marex card
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2;
                STATE.connectionParticles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * 5,
                    vy: Math.sin(angle) * 5,
                    radius: 2.5,
                    opacity: 0.9,
                    color: '#B19CD9'
                });
            }

            // Add secondary ring of smaller particles
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
                STATE.connectionParticles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    radius: 1.5,
                    opacity: 0.7,
                    color: '#C8B4E6'
                });
            }
        }
    };

    // ==========================================================
    // MODULE 4: CANVAS ANIMATOR
    // Handles all canvas drawing and animation logic
    // ==========================================================

    const CanvasAnimator = {
        init() {
            if (!Utils.initCanvas()) return;
            Utils.resizeCanvas();
            StarFieldManager.createEnhancedStarField();
            this.startAnimation();
        },

        startAnimation() {
            const animate = () => {
                STATE.animationTime += CONFIG.animationSpeed;
                this.updateParticles();
                this.draw();
                STATE.animationFrameId = requestAnimationFrame(animate);
            };
            animate();
        },

        updateParticles() {
            // Update shooting stars
            StarFieldManager.updateShootingStars();
            StarFieldManager.createShootingStar();

            // Update mouse trail particles
            this.updateMouseTrails();

            // Update connection particles
            this.updateConnectionParticles();
        },

        updateMouseTrails() {
            if (STATE.mouse.x !== null && STATE.mouse.y !== null) {
                // Create mouse trail particles
                if (Math.random() < 0.3) {
                    STATE.mouseTrails.push({
                        x: STATE.mouse.x + (Math.random() - 0.5) * 10,
                        y: STATE.mouse.y + (Math.random() - 0.5) * 10,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        radius: Math.random() * 2 + 1,
                        opacity: 0.6,
                        life: 1
                    });
                }
            }

            // Update existing trails
            STATE.mouseTrails = STATE.mouseTrails.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life *= 0.95;
                particle.opacity = particle.life * 0.6;
                return particle.life > 0.1;
            });
        },

        updateConnectionParticles() {
            STATE.connectionParticles = STATE.connectionParticles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.opacity *= 0.95;
                return particle.opacity > 0.01;
            });
        },

        draw() {
            const ctx = STATE.ctx;
            const canvas = STATE.canvas;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw nebula clouds
            this.drawNebulaClouds();

            // Draw stars
            this.drawStars();

            // Draw mouse connections
            this.drawMouseConnections();

            // Draw shooting stars
            this.drawShootingStars();

            // Draw mouse trails
            this.drawMouseTrails();

            // Draw connection particles
            this.drawConnectionParticles();
        },

        drawNebulaClouds() {
            const ctx = STATE.ctx;
            STATE.nebulaClouds.forEach(cloud => {
                const pulse = Math.sin(STATE.animationTime * cloud.pulseSpeed + cloud.pulsePhase) * 0.3 + 0.7;
                const gradient = ctx.createRadialGradient(
                    cloud.x, cloud.y, 0,
                    cloud.x, cloud.y, cloud.radius * pulse
                );
                gradient.addColorStop(0, cloud.color);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.fillRect(
                    cloud.x - cloud.radius,
                    cloud.y - cloud.radius,
                    cloud.radius * 2,
                    cloud.radius * 2
                );

                // Drift movement
                cloud.x += cloud.drift.x;
                cloud.y += cloud.drift.y;

                // Wrap around edges
                if (cloud.x < -cloud.radius) cloud.x = STATE.canvas.width + cloud.radius;
                if (cloud.x > STATE.canvas.width + cloud.radius) cloud.x = -cloud.radius;
                if (cloud.y < -cloud.radius) cloud.y = STATE.canvas.height + cloud.radius;
                if (cloud.y > STATE.canvas.height + cloud.radius) cloud.y = -cloud.radius;
            });
        },

        drawStars() {
            const ctx = STATE.ctx;
            STATE.stars.forEach(star => {
                // Calculate twinkling effect
                const twinkle = Math.sin(STATE.animationTime * star.twinkleSpeed + star.twinklePhase) * 0.4 + 0.6;
                star.opacity = star.baseOpacity * twinkle;

                // Enhanced glow for special stars
                if (star.isSpecial) {
                    const glowRadius = star.radius * 3;
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);
                    gradient.addColorStop(0, star.color);
                    gradient.addColorStop(0.3, star.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(star.x - glowRadius, star.y - glowRadius, glowRadius * 2, glowRadius * 2);
                }

                // Draw star
                ctx.globalAlpha = star.opacity;
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        },

        drawMouseConnections() {
            if (!STATE.mouse.x || !STATE.mouse.y) return;

            const ctx = STATE.ctx;
            const connectionRange = STATE.isMobile ? CONFIG.connectionRange.mobile : CONFIG.connectionRange.desktop;

            STATE.stars.forEach(star => {
                const dx = star.x - STATE.mouse.x;
                const dy = star.y - STATE.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRange) {
                    const opacity = (1 - distance / connectionRange) * 0.4;

                    // Create gradient line
                    const gradient = ctx.createLinearGradient(STATE.mouse.x, STATE.mouse.y, star.x, star.y);
                    gradient.addColorStop(0, `rgba(103, 233, 123, ${opacity})`);
                    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.5})`);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(STATE.mouse.x, STATE.mouse.y);
                    ctx.lineTo(star.x, star.y);
                    ctx.stroke();
                }
            });
        },

        drawShootingStars() {
            const ctx = STATE.ctx;
            STATE.shootingStars.forEach(star => {
                star.trail.forEach((point, index) => {
                    const trailOpacity = point.opacity * (index / star.trail.length) * 0.8;
                    ctx.globalAlpha = trailOpacity;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
            ctx.globalAlpha = 1;
        },

        drawMouseTrails() {
            const ctx = STATE.ctx;
            STATE.mouseTrails.forEach(particle => {
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = '#67e97b';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        },

        drawConnectionParticles() {
            const ctx = STATE.ctx;
            STATE.connectionParticles.forEach(particle => {
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }
    };

    // ==========================================================
    // APPLICATION INITIALIZATION
    // ==========================================================

    function initializePortfolio() {
        // Initialize all modules in correct order
        DeviceManager.init();
        CanvasAnimator.init();
        UIController.init();

        console.log('Portfolio Interactive System Initialized');
    }

    // Start the application
    initializePortfolio();

});