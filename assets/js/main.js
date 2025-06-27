/**
 * 🌌 nemototea.dev - Ultra Think JavaScript System
 * ダークモード・グラスモーフィズム × サイバーパンク × ミニマル・テック
 */

// ===== CORE SYSTEM =====
class NemototeaApp {
    constructor() {
        this.isLoaded = false;
        this.particles = [];
        this.animations = new Map();
        this.audioContext = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initBackgroundEffects();
        this.initScrollAnimations();
        this.initAudioVisualization();
        this.initMobileNavigation();
        this.isLoaded = true;
        
        // ページ読み込み完了イベント
        this.emit('app:loaded');
        console.log('🚀 nemototea.dev Ultra Think System initialized');
    }

    // イベントシステム
    emit(eventName, data = null) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    on(eventName, callback) {
        document.addEventListener(eventName, callback);
    }

    setupEventListeners() {
        // ページ読み込み時のフェードイン
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        // スムーススクロール
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    initBackgroundEffects() {
        this.backgroundEffects = new BackgroundEffects();
    }

    initScrollAnimations() {
        this.scrollAnimations = new ScrollAnimations();
    }

    initAudioVisualization() {
        this.audioVisualization = new AudioVisualization();
    }

    initMobileNavigation() {
        this.mobileNavigation = new MobileNavigation();
    }
}

// ===== BACKGROUND EFFECTS SYSTEM =====
class BackgroundEffects {
    constructor() {
        this.particles = [];
        this.maxParticles = 5;
        this.init();
    }

    init() {
        this.createCyberGrid();
        this.createFloatingParticles();
        this.startAnimationLoop();
    }

    createCyberGrid() {
        const grid = document.createElement('div');
        grid.className = 'bg-cyber-grid';
        document.body.prepend(grid);
    }

    createFloatingParticles() {
        const container = document.createElement('div');
        container.className = 'bg-floating-particles';
        
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // ランダムな位置とアニメーション遅延
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
        
        document.body.prepend(container);
    }

    startAnimationLoop() {
        const animate = () => {
            // パーティクルの動的な更新
            this.particles.forEach(particle => {
                const shouldUpdate = Math.random() < 0.01; // 1%の確率で更新
                if (shouldUpdate) {
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.left = Math.random() * 100 + '%';
                }
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// ===== SCROLL ANIMATIONS SYSTEM =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.createIntersectionObserver();
        this.observeElements();
    }

    createIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // 波形アニメーションの開始
                    if (entry.target.classList.contains('wave-visualizer')) {
                        this.startWaveAnimation(entry.target);
                    }
                    
                    // カウントアップアニメーション
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, options);
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .wave-visualizer, .counter'
        );
        
        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }

    startWaveAnimation(container) {
        const bars = container.querySelectorAll('.wave-bar');
        bars.forEach((bar, index) => {
            bar.style.animationDelay = (index * 0.1) + 's';
            bar.classList.add('active');
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(progress * target);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ===== AUDIO VISUALIZATION SYSTEM =====
class AudioVisualization {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isInitialized = true;
        } catch (error) {
            console.warn('Audio context initialization failed:', error);
        }
    }

    createStaticVisualizer(container, barCount = 10) {
        container.innerHTML = '';
        container.className += ' wave-visualizer';
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.height = (Math.random() * 60 + 20) + 'px';
            bar.style.animationDelay = (i * 0.1) + 's';
            container.appendChild(bar);
        }
        
        return container;
    }

    createInteractiveVisualizer(container, audioElement) {
        if (!this.isInitialized) {
            return this.createStaticVisualizer(container);
        }

        const source = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        const barCount = 32;
        const bars = [];
        container.innerHTML = '';
        container.className += ' wave-visualizer';

        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            container.appendChild(bar);
            bars.push(bar);
        }

        const animate = () => {
            this.analyser.getByteFrequencyData(this.dataArray);
            
            bars.forEach((bar, index) => {
                const dataIndex = Math.floor(index * this.dataArray.length / barCount);
                const value = this.dataArray[dataIndex];
                const height = (value / 255) * 80 + 10;
                bar.style.height = height + 'px';
                bar.style.opacity = 0.6 + (value / 255) * 0.4;
            });
            
            requestAnimationFrame(animate);
        };
        
        audioElement.addEventListener('play', animate);
        return container;
    }

    updateVisualizerTheme(container, theme = 'cyber') {
        const bars = container.querySelectorAll('.wave-bar');
        bars.forEach(bar => {
            switch (theme) {
                case 'cyber':
                    bar.style.background = 'linear-gradient(to top, var(--cyber-green), var(--cyber-blue))';
                    break;
                case 'tea':
                    bar.style.background = 'linear-gradient(to top, #2d5016, #4a7c59)';
                    break;
                case 'minimal':
                    bar.style.background = 'linear-gradient(to top, #667eea, #764ba2)';
                    break;
            }
        });
    }
}

// ===== MOBILE NAVIGATION SYSTEM =====
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.navToggle = null;
        this.navItems = null;
        this.init();
    }

    init() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navItems = document.getElementById('nav-items');
        
        if (!this.navToggle || !this.navItems) {
            console.warn('Navigation elements not found');
            return;
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // ハンバーガーメニューボタンのクリック
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // ナビゲーションアイテムのクリック
        const navLinks = this.navItems.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    // ナビゲーション先への遷移を優先し、少し遅延してメニューを閉じる
                    setTimeout(() => this.close(), 150);
                }
            });
        });

        // 外側クリックで閉じる
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.nav')) {
                this.close();
            }
        });

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.navItems.classList.add('active');
        this.navToggle.innerHTML = '✕';
        this.navToggle.setAttribute('aria-expanded', 'true');
        
        // ボディのスクロールを防ぐ
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.navItems.classList.remove('active');
        this.navToggle.innerHTML = '☰';
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        // ボディのスクロールを復元
        document.body.style.overflow = '';
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeAnimations();
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    optimizeAnimations() {
        // Reduce motion preference対応
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }

    // FPS監視
    monitorFPS() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn('Low FPS detected:', fps);
                    this.reducedAnimationMode();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }

    reducedAnimationMode() {
        document.body.classList.add('reduced-animations');
    }
}

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // デバウンス関数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // スロットル関数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 要素が表示されているかチェック
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // スムーズなカウントアップ
    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    },

    // ランダムな範囲の値を生成
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    },

    // 色の補間
    interpolateColor(color1, color2, factor) {
        const hex = (color) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        
        const c1 = hex(color1);
        const c2 = hex(color2);
        
        if (!c1 || !c2) return color1;
        
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
};

// ===== THEME SYSTEM =====
class ThemeSystem {
    constructor() {
        this.currentTheme = 'cyber';
        this.themes = {
            cyber: {
                primary: '#00ff9d',
                secondary: '#00d4ff',
                accent: '#9d4edd'
            },
            tea: {
                primary: '#2d5016',
                secondary: '#4a7c59',
                accent: '#8b4513'
            },
            minimal: {
                primary: '#667eea',
                secondary: '#764ba2',
                accent: '#f093fb'
            }
        };
    }

    switchTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        document.documentElement.style.setProperty('--theme-accent', theme.accent);
        
        // イベント発火
        document.dispatchEvent(new CustomEvent('theme:changed', { 
            detail: { theme: themeName } 
        }));
    }
}

// ===== GLOBAL INITIALIZATION =====
let app, performanceOptimizer, themeSystem;

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
    // メインアプリケーション初期化（内部で各システムを初期化）
    app = new NemototeaApp();
    
    // 独立したシステム初期化
    performanceOptimizer = new PerformanceOptimizer();
    themeSystem = new ThemeSystem();
    
    // 音声コンテキスト初期化（ユーザーインタラクション後）
    document.addEventListener('click', () => {
        if (app.audioVisualization && !app.audioVisualization.isInitialized) {
            app.audioVisualization.init();
        }
    }, { once: true });
    
    // パフォーマンス監視開始（開発環境判定）
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.protocol === 'file:';
                         
    if (isDevelopment) {
        performanceOptimizer.monitorFPS();
    }
});

// グローバルエクスポート（他のスクリプトから使用可能）
window.NemototeaSystem = {
    app,
    get backgroundEffects() { return app?.backgroundEffects; },
    get scrollAnimations() { return app?.scrollAnimations; },
    get audioVisualization() { return app?.audioVisualization; },
    get mobileNav() { return app?.mobileNavigation; },
    performanceOptimizer,
    themeSystem,
    Utils
};