// スクロールトップボタンの機能
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  let isVisible = false;
  let scrollTimeout;
  
  if (!scrollToTopBtn) return;
  
  // スクロール位置を監視
  function checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldShow = scrollTop > 300; // 300px以上スクロールしたら表示
    
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      if (shouldShow) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  }
  
  // スムーススクロール機能
  function smoothScrollToTop() {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 800; // 0.8秒でスクロール
    
    // イージング関数（ease-out）
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function scrollStep(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }
    
    requestAnimationFrame(scrollStep);
  }
  
  // スクロールイベントリスナー（パフォーマンス最適化）
  function handleScroll() {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = requestAnimationFrame(checkScrollPosition);
  }
  
  // イベントリスナーを追加
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // ボタンクリックイベント
  scrollToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // CSS scroll-behavior がサポートされている場合
    if (CSS.supports('scroll-behavior', 'smooth')) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // フォールバック用カスタムスムーススクロール
      smoothScrollToTop();
    }
    
    // アクセシビリティ用のフォーカス管理
    setTimeout(() => {
      document.body.focus();
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 100);
  });
  
  // キーボード操作対応
  scrollToTopBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTopBtn.click();
    }
  });
  
  // 初期表示状態をチェック
  checkScrollPosition();
  
  // デバッグ用ログ（開発時のみ）
  if (window.location.hostname === 'localhost') {
    console.log('Scroll-to-top button initialized');
  }
});

// パフォーマンス監視（オプション）
if (window.location.hostname === 'localhost' && 'performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
      }
    }, 0);
  });
}