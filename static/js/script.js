// スクロール連動ヘッダー（パフォーマンス最適化）
let lastScrollTop = 0;
let scrollTimeout;
let isScrolling = false;

function handleHeaderScroll() {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    isScrolling = false;
}

// スクロール中アニメーション制御
let scrollTimer = null;
function handleScrollStart() {
    document.body.classList.add('scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 150);
}

window.addEventListener('scroll', function() {
    if (!isScrolling) {
        isScrolling = true;
        handleScrollStart();
        requestAnimationFrame(handleHeaderScroll);
    }
}, { passive: true });

// モバイルメニューの開閉
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                menuToggle.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
            }
        });
        
        // メニューリンククリックで閉じる
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });
        
        // 外側クリックで閉じる
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    }
});

// カウントアップアニメーション
function animateValue(id, start, end, duration, suffix = '%') {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // 小数点を含む場合の処理
        let current;
        if (end % 1 !== 0) {
            current = (progress * (end - start) + start).toFixed(1);
        } else {
            current = Math.floor(progress * (end - start) + start);
        }
        
        obj.textContent = current + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1  // 閾値を下げて早めに発火させる
};

const animationTriggered = {
    'hit-rate': false,
    'recovery-rate': false,
    'ai-usage': false
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!animationTriggered[id]) {
                animationTriggered[id] = true;
                
                switch(id) {
                    case 'hit-rate':
                        animateValue('hit-rate', 0, 76.4, 2000, '%');
                        break;
                    case 'recovery-rate':
                        animateValue('recovery-rate', 0, 158, 2000, '%');
                        break;
                    case 'ai-usage':
                        animateValue('ai-usage', 0, 100, 2000, '%');
                        break;
                }
            }
        }
    });
}, observerOptions);

// 要素を監視
document.addEventListener('DOMContentLoaded', function() {
    const hitRate = document.getElementById('hit-rate');
    const recoveryRate = document.getElementById('recovery-rate');
    const aiUsage = document.getElementById('ai-usage');
    
    if (hitRate) observer.observe(hitRate);
    if (recoveryRate) observer.observe(recoveryRate);
    if (aiUsage) observer.observe(aiUsage);

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// パフォーマンス最適化
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        // data-src属性がある場合のみsrcを置換
        if (img.dataset.src && img.dataset.src !== 'undefined') {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Service Worker登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // sw.jsファイルの存在確認を追加
        fetch('/sw.js', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    return navigator.serviceWorker.register('/sw.js');
                } else {
                    throw new Error('Service Worker file not found');
                }
            })
            .then(function(registration) {
                console.log('ServiceWorker registration successful:', registration.scope);
                
                // Update notification
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New update available
                            console.log('New content is available; please refresh.');
                        }
                    });
                });
            })
            .catch(function(err) {
                console.warn('ServiceWorker registration skipped:', err.message);
                // Don't throw error - continue without SW
            });
    });
} else {
    console.log('ServiceWorker is not supported in this browser.');
}