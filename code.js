/*
 *  ENHANCED PORTFOLIO INTERACTIVE SYSTEM
 *  - Premium cosmic effects and interactions
 *  - Particle systems, aurora effects, and dynamic lighting
 *  - Maintains all original functionality with elevated visuals
 */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================
    // CONFIGURATION & STATE MANAGEMENT
    // ==========================================================

    // Enhanced configuration
    const CONFIG = {
        // Star system configuration
        starCount: {
            desktop: 400,
            mobile: 200
        },
        starLayers: 3, // Multiple depth layers
        starColors: [
            '#ffffff',    // White
            '#fff8f0',    // Warm white
            '#fffaf5',    // Cool white
            '#fff5e6',    // Slightly warm
            '#f8f8ff',    // Blue-white
            '#fff0e6',    // Warm yellow-white
            '#ffeaa7',    // Yellow
            '#ffcc99',    // Orange
            '#B19CD9',    // Purple (rare)
            '#58A6FF'     // Blue (rare)
        ],
        nebulaCount: {
            desktop: 8,
            mobile: 4
        },
        connectionRange: {
            desktop: 250,
            mobile: 180
        },
        // Aurora configuration
        auroraEnabled: true,
        auroraColors: [
            'rgba(88, 166, 255, 0.15)',   // Blue
            'rgba(67, 233, 123, 0.12)',   // Green
            'rgba(177, 156, 217, 0.15)',  // Purple
            'rgba(200, 180, 230, 0.12)'   // Light purple
        ],
        // Mobile breakpoint
        mobileBreakpoint: 768,
        // Animation timing
        animationSpeed: 0.016,
        // Particle limits
        maxParticles: 500,
        maxMouseTrails: 50
    };

    // Enhanced state management
    const STATE = {
        // Device detection
        isMobile: false,
        isTouch: false,
        devicePixelRatio: window.devicePixelRatio || 1,

        // Mouse tracking
        mouse: {
            x: null,
            y: null,
            lastX: null,
            lastY: null,
            velocity: { x: 0, y: 0 }
        },

        // Canvas and context
        canvas: null,
        ctx: null,

        // Animation state
        animationTime: 0,
        animationFrameId: null,
        frameCount: 0,

        // Interactive elements
        allNodes: [],
        projectCards: [],
        hoveredCard: null,
        activeConnections: [],

        // Enhanced particle systems
        stars: [],
        nebulaClouds: [],
        shootingStars: [],
        mouseTrails: [],
        connectionParticles: [],
        glowParticles: [],
        auroraWaves: [],
        constellationLines: [],
        
        // Visual effects state
        cardGlowIntensity: new Map(),
        starFieldOffset: { x: 0, y: 0 }
    };

    // ==========================================================
    // ENHANCED UTILITY FUNCTIONS
    // ==========================================================

    const Utils = {
        // Mobile and touch detection
        detectMobile() {
            STATE.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            STATE.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            return STATE.isMobile;
        },

        // Initialize canvas with high DPI support
        initCanvas() {
            STATE.canvas = document.getElementById('canvas-background');
            if (!STATE.canvas) return false;
            STATE.ctx = STATE.canvas.getContext('2d', { alpha: true });
            this.setupCanvasQuality();
            return true;
        },

        // Setup canvas for high quality rendering
        setupCanvasQuality() {
            const ctx = STATE.ctx;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        },

        // Resize canvas with device pixel ratio
        resizeCanvas() {
            if (!STATE.canvas) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const dpr = STATE.devicePixelRatio;
            
            STATE.canvas.width = width * dpr;
            STATE.canvas.height = height * dpr;
            STATE.canvas.style.width = width + 'px';
            STATE.canvas.style.height = height + 'px';
            
            STATE.ctx.scale(dpr, dpr);
            this.setupCanvasQuality();
        },

        // Easing functions for smooth animations
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        },

        // Calculate distance between points
        distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        },

        // Random range helper
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Hexadecimal to RGBA conversion
        hexToRgba(hex, alpha) {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    };

    // ==========================================================
    // MODULE 1: ENHANCED DEVICE MANAGER
    // ==========================================================

    const DeviceManager = {
        init() {
            Utils.detectMobile();
            this.setupEventListeners();
            this.trackMouseVelocity();
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
                window.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            }

            // Window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        },

        trackMouseVelocity() {
            setInterval(() => {
                if (STATE.mouse.lastX !== null && STATE.mouse.x !== null) {
                    STATE.mouse.velocity.x = STATE.mouse.x - STATE.mouse.lastX;
                    STATE.mouse.velocity.y = STATE.mouse.y - STATE.mouse.lastY;
                }
                STATE.mouse.lastX = STATE.mouse.x;
                STATE.mouse.lastY = STATE.mouse.y;
            }, 50);
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
                STATE.mouse.lastX = null;
                STATE.mouse.lastY = null;
            }, 300);
        },

        handleMouseMove(e) {
            STATE.mouse.x = e.clientX;
            STATE.mouse.y = e.clientY;
            
            // Update parallax offset
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            STATE.starFieldOffset.x = (e.clientX - centerX) * 0.02;
            STATE.starFieldOffset.y = (e.clientY - centerY) * 0.02;
        },

        handleMouseLeave(e) {
            STATE.mouse.x = null;
            STATE.mouse.y = null;
            STATE.mouse.lastX = null;
            STATE.mouse.lastY = null;
        },

        handleResize() {
            Utils.resizeCanvas();
            const wasMobile = STATE.isMobile;
            Utils.detectMobile();

            if (wasMobile !== STATE.isMobile) {
                this.handleDeviceSwitch();
            }

            StarFieldManager.createEnhancedStarField();
            AuroraSystem.initAurora();
        },

        handleDeviceSwitch() {
            STATE.allNodes.length = 0;
            STATE.projectCards.length = 0;

            const projectGrid = document.getElementById('project-grid');
            const messageCard = document.querySelector('.message-card');
            if (projectGrid) projectGrid.classList.remove('marex-expanded');
            if (messageCard) messageCard.classList.remove('mobile-push-down');

            UIController.initializeProjectCards();
            UIController.initializeMarexHub();
        }
    };

    // ==========================================================
    // MODULE 2: ENHANCED STAR FIELD MANAGER
    // ==========================================================

    const StarFieldManager = {
        createEnhancedStarField() {
            STATE.stars = [];
            STATE.nebulaClouds = [];

            // Create multi-layer star field for parallax effect
            const starCount = STATE.isMobile ? CONFIG.starCount.mobile : CONFIG.starCount.desktop;
            const starsPerLayer = Math.floor(starCount / CONFIG.starLayers);

            for (let layer = 0; layer < CONFIG.starLayers; layer++) {
                const layerDepth = (layer + 1) / CONFIG.starLayers;
                
                for (let i = 0; i < starsPerLayer; i++) {
                    const starType = Math.random();
                    let radius, opacity, twinkleSpeed, color, isSpecial, glowRadius;

                    if (starType < 0.7) {
                        // Distant stars (smaller, dimmer)
                        radius = Utils.random(0.2, 0.8) * layerDepth;
                        opacity = Utils.random(0.2, 0.5) * layerDepth;
                        twinkleSpeed = Utils.random(0.005, 0.01);
                        color = '#ffffff';
                        isSpecial = false;
                        glowRadius = 0;
                    } else if (starType < 0.9) {
                        // Medium stars
                        radius = Utils.random(0.8, 1.5) * layerDepth;
                        opacity = Utils.random(0.5, 0.8) * layerDepth;
                        twinkleSpeed = Utils.random(0.008, 0.015);
                        color = CONFIG.starColors[Math.floor(Math.random() * 6)];
                        isSpecial = false;
                        glowRadius = radius * 2;
                    } else if (starType < 0.98) {
                        // Bright stars
                        radius = Utils.random(1.5, 2.5) * layerDepth;
                        opacity = Utils.random(0.7, 0.9);
                        twinkleSpeed = Utils.random(0.01, 0.02);
                        color = CONFIG.starColors[Math.floor(Math.random() * 8)];
                        isSpecial = true;
                        glowRadius = radius * 3;
                    } else {
                        // Rare colored stars
                        radius = Utils.random(2, 3) * layerDepth;
                        opacity = Utils.random(0.8, 1);
                        twinkleSpeed = Utils.random(0.015, 0.025);
                        color = CONFIG.starColors[8 + Math.floor(Math.random() * 2)];
                        isSpecial = true;
                        glowRadius = radius * 4;
                    }

                    STATE.stars.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        baseX: Math.random() * window.innerWidth,
                        baseY: Math.random() * window.innerHeight,
                        radius: radius,
                        baseRadius: radius,
                        baseOpacity: opacity,
                        opacity: opacity,
                        twinkleSpeed: twinkleSpeed,
                        twinklePhase: Math.random() * Math.PI * 2,
                        color: color,
                        pulseSpeed: Utils.random(0.3, 0.8),
                        isSpecial: isSpecial,
                        layer: layer,
                        z: layerDepth,
                        glowRadius: glowRadius,
                        connectionStrength: 0,
                        brightness: 1
                    });
                }
            }

            // Create enhanced nebula clouds
            const nebulaCount = STATE.isMobile ? CONFIG.nebulaCount.mobile : CONFIG.nebulaCount.desktop;
            for (let i = 0; i < nebulaCount; i++) {
                const type = Math.random();
                let color, radius, opacity;

                if (type < 0.4) {
                    color = `rgba(88, 166, 255, ${Utils.random(0.02, 0.04)})`;
                    radius = Utils.random(200, 400);
                    opacity = 0.8;
                } else if (type < 0.7) {
                    color = `rgba(177, 156, 217, ${Utils.random(0.03, 0.05)})`;
                    radius = Utils.random(250, 450);
                    opacity = 0.7;
                } else {
                    color = `rgba(67, 233, 123, ${Utils.random(0.02, 0.03)})`;
                    radius = Utils.random(300, 500);
                    opacity = 0.6;
                }

                STATE.nebulaClouds.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    radius: radius,
                    baseRadius: radius,
                    color: color,
                    opacity: opacity,
                    drift: {
                        x: Utils.random(-0.05, 0.05),
                        y: Utils.random(-0.05, 0.05)
                    },
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Utils.random(0.2, 0.5),
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: Utils.random(-0.001, 0.001)
                });
            }
        },

        createShootingStar() {
            if (STATE.shootingStars.length < 3 && Math.random() < 0.002) {
                const startEdge = Math.floor(Math.random() * 4);
                let startX, startY, angle;

                switch(startEdge) {
                    case 0: // Top
                        startX = Math.random() * window.innerWidth;
                        startY = -10;
                        angle = Utils.random(Math.PI / 4, 3 * Math.PI / 4);
                        break;
                    case 1: // Right
                        startX = window.innerWidth + 10;
                        startY = Math.random() * window.innerHeight;
                        angle = Utils.random(3 * Math.PI / 4, 5 * Math.PI / 4);
                        break;
                    case 2: // Bottom
                        startX = Math.random() * window.innerWidth;
                        startY = window.innerHeight + 10;
                        angle = Utils.random(5 * Math.PI / 4, 7 * Math.PI / 4);
                        break;
                    case 3: // Left
                        startX = -10;
                        startY = Math.random() * window.innerHeight;
                        angle = Utils.random(-Math.PI / 4, Math.PI / 4);
                        break;
                }

                STATE.shootingStars.push({
                    x: startX,
                    y: startY,
                    length: Utils.random(60, 120),
                    speed: Utils.random(5, 10),
                    angle: angle,
                    opacity: 1,
                    trail: [],
                    color: Math.random() < 0.7 ? '#ffffff' : CONFIG.starColors[Math.floor(Math.random() * CONFIG.starColors.length)]
                });
            }
        },

        updateShootingStars() {
            STATE.shootingStars = STATE.shootingStars.filter(star => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity *= 0.97;

                star.trail.push({ x: star.x, y: star.y, opacity: star.opacity });
                if (star.trail.length > 20) star.trail.shift();

                return star.opacity > 0.01 && 
                       star.x > -50 && star.x < window.innerWidth + 50 && 
                       star.y > -50 && star.y < window.innerHeight + 50;
            });
        }
    };

    // ==========================================================
    // MODULE 3: AURORA SYSTEM
    // ==========================================================

    const AuroraSystem = {
        initAurora() {
            if (!CONFIG.auroraEnabled || STATE.isMobile) return;
            
            STATE.auroraWaves = [];
            const waveCount = 3;
            
            for (let i = 0; i < waveCount; i++) {
                STATE.auroraWaves.push({
                    points: this.generateAuroraPoints(),
                    color: CONFIG.auroraColors[i % CONFIG.auroraColors.length],
                    phase: Math.random() * Math.PI * 2,
                    amplitude: Utils.random(50, 100),
                    frequency: Utils.random(0.001, 0.003),
                    speed: Utils.random(0.0005, 0.001),
                    opacity: Utils.random(0.3, 0.6)
                });
            }
        },

        generateAuroraPoints() {
            const points = [];
            const segments = 20;
            const width = window.innerWidth;
            
            for (let i = 0; i <= segments; i++) {
                points.push({
                    x: (i / segments) * width,
                    baseY: window.innerHeight * 0.2 + Utils.random(-50, 50)
                });
            }
            
            return points;
        },

        updateAurora() {
            STATE.auroraWaves.forEach(wave => {
                wave.phase += wave.speed;
                
                wave.points.forEach((point, i) => {
                    const offset = Math.sin(wave.phase + i * wave.frequency) * wave.amplitude;
                    point.y = point.baseY + offset;
                });
            });
        },

        drawAurora(ctx) {
            if (!CONFIG.auroraEnabled || STATE.isMobile) return;
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            STATE.auroraWaves.forEach(wave => {
                ctx.globalAlpha = wave.opacity * 0.5;
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight * 0.5);
                gradient.addColorStop(0, wave.color);
                gradient.addColorStop(1, 'transparent');
                
                // Draw aurora wave
                ctx.beginPath();
                ctx.moveTo(wave.points[0].x, wave.points[0].y);
                
                for (let i = 1; i < wave.points.length - 2; i++) {
                    const xc = (wave.points[i].x + wave.points[i + 1].x) / 2;
                    const yc = (wave.points[i].y + wave.points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(wave.points[i].x, wave.points[i].y, xc, yc);
                }
                
                ctx.lineTo(window.innerWidth, window.innerHeight);
                ctx.lineTo(0, window.innerHeight);
                ctx.closePath();
                
                ctx.fillStyle = gradient;
                ctx.fill();
            });
            
            ctx.restore();
        }
    };

    // ==========================================================
    // MODULE 4: ENHANCED UI CONTROLLER
    // ==========================================================

    const UIController = {
        init() {
            this.initializeProjectCards();
            this.initializeMarexHub();
            this.setupCardInteractions();
        },

        initializeProjectCards() {
            STATE.allNodes = [];
            STATE.projectCards = [];

            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const node = {
                    element: card,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    type: 'project',
                    index: index,
                    glowIntensity: 0,
                    targetGlowIntensity: 0
                };
                STATE.allNodes.push(node);
                STATE.projectCards.push(node);
                STATE.cardGlowIntensity.set(card, 0);
            });
        },

        setupCardInteractions() {
            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', (e) => this.handleCardHover(e, true));
                card.addEventListener('mouseleave', (e) => this.handleCardHover(e, false));
            });
        },

        handleCardHover(e, isHovering) {
            const card = e.currentTarget;
            const node = STATE.projectCards.find(n => n.element === card);
            
            if (!node) return;
            
            if (isHovering) {
                STATE.hoveredCard = node;
                node.targetGlowIntensity = 1;
                
                // Create hover particles
                this.createHoverParticles(node);
                
                // Activate constellation connections
                this.activateConstellations(node);
                
                // Brighten nearby stars
                this.brightenNearbyStars(node);
            } else {
                if (STATE.hoveredCard === node) {
                    STATE.hoveredCard = null;
                }
                node.targetGlowIntensity = 0;
                
                // Deactivate constellation connections
                this.deactivateConstellations(node);
                
                // Reset star brightness
                this.resetStarBrightness();
            }
        },

        createHoverParticles(node) {
            const rect = node.element.getBoundingClientRect();
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = Utils.random(2, 4);
                const color = node.element.classList.contains('marex-hub-card') ? 
                    '#B19CD9' : '#58A6FF';
                
                STATE.glowParticles.push({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: Utils.random(1, 3),
                    opacity: 1,
                    color: color,
                    life: 1,
                    gravity: 0.1
                });
            }
        },

        activateConstellations(node) {
            // Create connections to other cards
            STATE.projectCards.forEach(otherNode => {
                if (otherNode === node) return;
                
                const distance = Utils.distance(node.x, node.y, otherNode.x, otherNode.y);
                if (distance < 400) {
                    STATE.constellationLines.push({
                        from: node,
                        to: otherNode,
                        opacity: 0,
                        targetOpacity: 0.3,
                        distance: distance
                    });
                }
            });
        },

        deactivateConstellations(node) {
            STATE.constellationLines = STATE.constellationLines.filter(line => {
                if (line.from === node || line.to === node) {
                    line.targetOpacity = 0;
                    return line.opacity > 0.01;
                }
                return true;
            });
        },

        brightenNearbyStars(node) {
            const influenceRadius = 300;
            
            STATE.stars.forEach(star => {
                const distance = Utils.distance(node.x, node.y, star.x, star.y);
                if (distance < influenceRadius) {
                    const influence = 1 - (distance / influenceRadius);
                    star.brightness = 1 + influence * 0.5;
                    star.radius = star.baseRadius * (1 + influence * 0.3);
                }
            });
        },

        resetStarBrightness() {
            STATE.stars.forEach(star => {
                star.brightness = 1;
                star.radius = star.baseRadius;
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

            const toggleMarexHub = () => {
                isExpanded = !isExpanded;

                if (isExpanded) {
                    marexHub.classList.add('expanded');

                    if (STATE.isMobile && messageCard) {
                        projectGrid?.classList.add('marex-expanded');
                        messageCard.classList.add('mobile-push-down');
                    }

                    this.createExpansionEffect(marexMainCard);
                    this.createPremiumExpansionParticles(marexHub);

                    subCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0) scale(1)';
                            card.style.opacity = '1';
                        }, index * 100);
                    });

                } else {
                    marexHub.classList.remove('expanded');

                    if (STATE.isMobile && messageCard) {
                        projectGrid?.classList.remove('marex-expanded');
                        messageCard.classList.remove('mobile-push-down');
                    }

                    subCards.forEach(card => {
                        card.style.transform = '';
                        card.style.opacity = '';
                    });
                }
            };

            marexMainCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMarexHub();
            });

            document.addEventListener('click', (e) => {
                if (isExpanded && !marexHub.contains(e.target)) {
                    toggleMarexHub();
                }
            });

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

            // Primary burst
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                STATE.connectionParticles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * 6,
                    vy: Math.sin(angle) * 6,
                    radius: 3,
                    opacity: 1,
                    color: '#B19CD9',
                    trail: []
                });
            }

            // Secondary burst
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2 + Math.PI / 15;
                STATE.connectionParticles.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * 4,
                    vy: Math.sin(angle) * 4,
                    radius: 2,
                    opacity: 0.8,
                    color: '#C8B4E6',
                    trail: []
                });
            }
        },

        createPremiumExpansionParticles(element) {
            const rect = element.getBoundingClientRect();
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                const angle = Math.random() * Math.PI * 2;
                const speed = Utils.random(1, 3);
                
                STATE.glowParticles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    radius: Utils.random(1, 2),
                    opacity: Utils.random(0.5, 1),
                    color: '#D4C5F9',
                    life: 1,
                    gravity: -0.05
                });
            }
        }
    };

    // ==========================================================
    // MODULE 5: ENHANCED CANVAS ANIMATOR
    // ==========================================================

    const CanvasAnimator = {
        init() {
            if (!Utils.initCanvas()) return;
            Utils.resizeCanvas();
            StarFieldManager.createEnhancedStarField();
            AuroraSystem.initAurora();
            this.startAnimation();
        },

        startAnimation() {
            const animate = () => {
                STATE.animationTime += CONFIG.animationSpeed;
                STATE.frameCount++;
                
                this.updateAll();
                this.drawAll();
                
                STATE.animationFrameId = requestAnimationFrame(animate);
            };
            animate();
        },

        updateAll() {
            // Update aurora
            AuroraSystem.updateAurora();
            
            // Update shooting stars
            StarFieldManager.updateShootingStars();
            StarFieldManager.createShootingStar();
            
            // Update particles
            this.updateMouseTrails();
            this.updateConnectionParticles();
            this.updateGlowParticles();
            
            // Update visual effects
            this.updateConstellationLines();
            this.updateCardGlow();
            this.updateStarParallax();
        },

        updateStarParallax() {
            STATE.stars.forEach(star => {
                const parallaxX = STATE.starFieldOffset.x * star.z;
                const parallaxY = STATE.starFieldOffset.y * star.z;
                star.x = star.baseX + parallaxX;
                star.y = star.baseY + parallaxY;
            });
        },

        updateCardGlow() {
            STATE.projectCards.forEach(node => {
                // Smooth glow intensity transition
                const diff = node.targetGlowIntensity - node.glowIntensity;
                node.glowIntensity += diff * 0.1;
                STATE.cardGlowIntensity.set(node.element, node.glowIntensity);
            });
        },

        updateConstellationLines() {
            STATE.constellationLines = STATE.constellationLines.filter(line => {
                const diff = line.targetOpacity - line.opacity;
                line.opacity += diff * 0.05;
                return line.opacity > 0.01 || line.targetOpacity > 0;
            });
        },

        updateMouseTrails() {
            if (STATE.mouse.x !== null && STATE.mouse.y !== null) {
                // Enhanced mouse trail based on velocity
                const speed = Math.sqrt(STATE.mouse.velocity.x ** 2 + STATE.mouse.velocity.y ** 2);
                const particleChance = Math.min(0.8, 0.2 + speed * 0.02);
                
                if (Math.random() < particleChance && STATE.mouseTrails.length < CONFIG.maxMouseTrails) {
                    const spread = Math.min(20, 5 + speed);
                    STATE.mouseTrails.push({
                        x: STATE.mouse.x + Utils.random(-spread, spread),
                        y: STATE.mouse.y + Utils.random(-spread, spread),
                        vx: STATE.mouse.velocity.x * 0.2 + Utils.random(-1, 1),
                        vy: STATE.mouse.velocity.y * 0.2 + Utils.random(-1, 1),
                        radius: Utils.random(1, 3),
                        opacity: 0.8,
                        life: 1,
                        color: STATE.hoveredCard ? '#B19CD9' : '#67e97b'
                    });
                }
            }

            STATE.mouseTrails = STATE.mouseTrails.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                particle.life *= 0.96;
                particle.opacity = particle.life * 0.8;
                particle.radius *= 0.98;
                return particle.life > 0.1;
            });
        },

        updateConnectionParticles() {
            STATE.connectionParticles = STATE.connectionParticles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.97;
                particle.vy *= 0.97;
                particle.opacity *= 0.96;
                
                // Add to trail
                if (particle.trail) {
                    particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
                    if (particle.trail.length > 10) particle.trail.shift();
                }
                
                return particle.opacity > 0.01;
            });
        },

        updateGlowParticles() {
            STATE.glowParticles = STATE.glowParticles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += particle.gravity || 0;
                particle.life *= 0.97;
                particle.opacity = particle.life;
                particle.radius *= 0.99;
                return particle.life > 0.1 && STATE.glowParticles.length < CONFIG.maxParticles;
            });
        },

        drawAll() {
            const ctx = STATE.ctx;
            const canvas = STATE.canvas;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Layer 1: Aurora (background)
            AuroraSystem.drawAurora(ctx);

            // Layer 2: Nebula clouds
            this.drawNebulaClouds();

            // Layer 3: Constellation lines
            this.drawConstellationLines();

            // Layer 4: Stars
            this.drawStars();

            // Layer 5: Card glow effects
            this.drawCardGlow();

            // Layer 6: Mouse connections
            this.drawMouseConnections();

            // Layer 7: Particles
            this.drawShootingStars();
            this.drawMouseTrails();
            this.drawConnectionParticles();
            this.drawGlowParticles();
        },

        drawNebulaClouds() {
            const ctx = STATE.ctx;
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            STATE.nebulaClouds.forEach(cloud => {
                const pulse = Math.sin(STATE.animationTime * cloud.pulseSpeed + cloud.pulsePhase) * 0.2 + 0.8;
                cloud.radius = cloud.baseRadius * pulse;
                cloud.rotation += cloud.rotationSpeed;
                
                ctx.save();
                ctx.translate(cloud.x, cloud.y);
                ctx.rotate(cloud.rotation);
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, cloud.radius);
                gradient.addColorStop(0, cloud.color.replace(/[\d.]+\)/, `${cloud.opacity})`));
                gradient.addColorStop(0.5, cloud.color.replace(/[\d.]+\)/, `${cloud.opacity * 0.5})`));
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.fillRect(-cloud.radius, -cloud.radius, cloud.radius * 2, cloud.radius * 2);
                ctx.restore();

                // Drift movement
                cloud.x += cloud.drift.x;
                cloud.y += cloud.drift.y;

                // Wrap around edges
                if (cloud.x < -cloud.radius) cloud.x = window.innerWidth + cloud.radius;
                if (cloud.x > window.innerWidth + cloud.radius) cloud.x = -cloud.radius;
                if (cloud.y < -cloud.radius) cloud.y = window.innerHeight + cloud.radius;
                if (cloud.y > window.innerHeight + cloud.radius) cloud.y = -cloud.radius;
            });
            
            ctx.restore();
        },

        drawConstellationLines() {
            const ctx = STATE.ctx;
            
            STATE.constellationLines.forEach(line => {
                if (line.opacity < 0.01) return;
                
                ctx.save();
                ctx.globalAlpha = line.opacity;
                
                // Draw glowing line
                const gradient = ctx.createLinearGradient(
                    line.from.x, line.from.y,
                    line.to.x, line.to.y
                );
                gradient.addColorStop(0, '#B19CD9');
                gradient.addColorStop(0.5, '#58A6FF');
                gradient.addColorStop(1, '#B19CD9');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 10]);
                ctx.lineDashOffset = STATE.animationTime * 50;
                
                ctx.beginPath();
                ctx.moveTo(line.from.x, line.from.y);
                ctx.lineTo(line.to.x, line.to.y);
                ctx.stroke();
                
                ctx.restore();
            });
        },

        drawStars() {
            const ctx = STATE.ctx;
            
            STATE.stars.forEach(star => {
                // Calculate twinkling
                const twinkle = Math.sin(STATE.animationTime * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
                const pulse = Math.sin(STATE.animationTime * star.pulseSpeed + star.twinklePhase) * 0.1 + 0.9;
                star.opacity = star.baseOpacity * twinkle * star.brightness;

                // Draw glow for special stars
                if (star.isSpecial && star.glowRadius > 0) {
                    ctx.save();
                    ctx.globalAlpha = star.opacity * 0.3;
                    const glowGradient = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, star.glowRadius * pulse
                    );
                    glowGradient.addColorStop(0, star.color);
                    glowGradient.addColorStop(0.4, Utils.hexToRgba(star.color, 0.2));
                    glowGradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = glowGradient;
                    ctx.fillRect(
                        star.x - star.glowRadius * pulse,
                        star.y - star.glowRadius * pulse,
                        star.glowRadius * pulse * 2,
                        star.glowRadius * pulse * 2
                    );
                    ctx.restore();
                }

                // Draw star core
                ctx.save();
                ctx.globalAlpha = star.opacity;
                ctx.fillStyle = star.color;
                ctx.shadowBlur = star.isSpecial ? 10 : 5;
                ctx.shadowColor = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * pulse, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        },

        drawCardGlow() {
            const ctx = STATE.ctx;
            
            STATE.projectCards.forEach(node => {
                if (node.glowIntensity < 0.01) return;
                
                const rect = node.element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                ctx.save();
                ctx.globalAlpha = node.glowIntensity * 0.3;
                ctx.globalCompositeOperation = 'screen';
                
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, rect.width * 0.8
                );
                
                const color = node.element.classList.contains('marex-hub-card') ? '#B19CD9' : '#58A6FF';
                gradient.addColorStop(0, color);
                gradient.addColorStop(0.5, Utils.hexToRgba(color, 0.3));
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    centerX - rect.width,
                    centerY - rect.height,
                    rect.width * 2,
                    rect.height * 2
                );
                
                ctx.restore();
            });
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
                    const opacity = (1 - distance / connectionRange) * 0.5 * star.z;

                    ctx.save();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = 'lighter';

                    // Multi-color gradient based on hover state
                    const gradient = ctx.createLinearGradient(
                        STATE.mouse.x, STATE.mouse.y, star.x, star.y
                    );
                    
                    if (STATE.hoveredCard) {
                        gradient.addColorStop(0, '#B19CD9');
                        gradient.addColorStop(0.5, '#D4C5F9');
                        gradient.addColorStop(1, star.color);
                    } else {
                        gradient.addColorStop(0, '#67e97b');
                        gradient.addColorStop(0.5, '#58A6FF');
                        gradient.addColorStop(1, star.color);
                    }

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = Math.max(0.5, 2 * opacity);
                    ctx.beginPath();
                    ctx.moveTo(STATE.mouse.x, STATE.mouse.y);
                    ctx.lineTo(star.x, star.y);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            });
        },

        drawShootingStars() {
            const ctx = STATE.ctx;
            
            STATE.shootingStars.forEach(star => {
                // Draw trail
                star.trail.forEach((point, index) => {
                    const trailOpacity = point.opacity * (index / star.trail.length);
                    const trailSize = (index / star.trail.length) * 2;
                    
                    ctx.save();
                    ctx.globalAlpha = trailOpacity;
                    ctx.globalCompositeOperation = 'screen';
                    ctx.fillStyle = star.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = star.color;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
                
                // Draw head
                ctx.save();
                ctx.globalAlpha = star.opacity;
                ctx.globalCompositeOperation = 'screen';
                const headGradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, 10
                );
                headGradient.addColorStop(0, star.color);
                headGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = headGradient;
                ctx.fillRect(star.x - 10, star.y - 10, 20, 20);
                ctx.restore();
            });
        },

        drawMouseTrails() {
            const ctx = STATE.ctx;
            
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            
            STATE.mouseTrails.forEach(particle => {
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.restore();
        },

        drawConnectionParticles() {
            const ctx = STATE.ctx;
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            STATE.connectionParticles.forEach(particle => {
                // Draw trail if exists
                if (particle.trail) {
                    particle.trail.forEach((point, index) => {
                        const trailOpacity = point.opacity * (index / particle.trail.length) * 0.5;
                        ctx.globalAlpha = trailOpacity;
                        ctx.fillStyle = particle.color;
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, particle.radius * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                    });
                }
                
                // Draw particle
                ctx.globalAlpha = particle.opacity;
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 2
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.restore();
        },

        drawGlowParticles() {
            const ctx = STATE.ctx;
            
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            STATE.glowParticles.forEach(particle => {
                ctx.globalAlpha = particle.opacity * 0.8;
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 3
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(0.3, Utils.hexToRgba(particle.color, 0.5));
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    particle.x - particle.radius * 3,
                    particle.y - particle.radius * 3,
                    particle.radius * 6,
                    particle.radius * 6
                );
            });
            
            ctx.restore();
        }
    };

    // ==========================================================
    // APPLICATION INITIALIZATION
    // ==========================================================

    function initializePortfolio() {
        // Performance optimization for mobile
        if (STATE.isMobile) {
            CONFIG.maxParticles = 200;
            CONFIG.maxMouseTrails = 25;
        }
        
        // Initialize all modules
        DeviceManager.init();
        CanvasAnimator.init();
        UIController.init();

        console.log('Enhanced Portfolio Interactive System Initialized');
        console.log(`Device: ${STATE.isMobile ? 'Mobile' : 'Desktop'}, Touch: ${STATE.isTouch}`);
    }

    // Start the application
    initializePortfolio();

});