// モバイルテーブル対応JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // モバイル判定
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;
    
    if (isMobile || isTouch) {
        initMobileTableSupport();
    }
});

function initMobileTableSupport() {
    // 全ての表を取得（特別なクラスも含む）
    const tables = document.querySelectorAll('.article-content table, .article-body table, main table, .urawa-stats-table, .horse-stats-table');
    
    tables.forEach(table => {
        // 既に専用のラッパーがある場合はスキップ
        if (table.closest('.data-table-wrapper') && table.classList.contains('urawa-stats-table')) {
            // table-scroll-containerに直接スクロール機能を追加
            const scrollContainer = table.closest('.table-scroll-container');
            if (scrollContainer) {
                addTouchSwipeSupport(scrollContainer);
            } else {
                // 古い構造の場合はdata-table-wrapperを使用
                const wrapper = table.closest('.data-table-wrapper');
                addTouchSwipeSupport(wrapper);
            }
            return;
        }
        
        // 表をコンテナでラップ
        if (!table.parentElement.classList.contains('mobile-table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            
            // スクロールインジケーターを追加
            addScrollIndicator(wrapper);
            
            // タッチスワイプ対応を追加
            addTouchSwipeSupport(wrapper);
        }
    });
}

function addScrollIndicator(wrapper) {
    const indicator = document.createElement('div');
    indicator.className = 'mobile-scroll-indicator';
    indicator.innerHTML = '← スワイプして全体を表示 →';
    indicator.style.cssText = `
        display: block;
        text-align: center;
        padding: 0.5rem;
        background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
        color: #0277bd;
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        font-weight: 500;
        animation: fadeIn 0.5s ease;
    `;
    
    wrapper.insertBefore(indicator, wrapper.firstChild);
    
    // 3秒後にインジケーターをフェードアウト
    setTimeout(() => {
        indicator.style.opacity = '0.7';
        indicator.style.transition = 'opacity 0.3s ease';
    }, 3000);
}

function addTouchSwipeSupport(wrapper) {
    let startX = 0;
    let scrollLeft = 0;
    let isScrolling = false;
    
    // タッチ開始
    wrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        isScrolling = true;
        wrapper.style.cursor = 'grabbing';
    });
    
    // タッチ移動
    wrapper.addEventListener('touchmove', function(e) {
        if (!isScrolling) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2; // スクロール速度を調整
        wrapper.scrollLeft = scrollLeft - walk;
    });
    
    // タッチ終了
    wrapper.addEventListener('touchend', function() {
        isScrolling = false;
        wrapper.style.cursor = 'grab';
    });
    
    // マウス対応（デスクトップでのテスト用）
    wrapper.addEventListener('mousedown', function(e) {
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        isScrolling = true;
        wrapper.style.cursor = 'grabbing';
    });
    
    wrapper.addEventListener('mousemove', function(e) {
        if (!isScrolling) return;
        e.preventDefault();
        
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });
    
    wrapper.addEventListener('mouseup', function() {
        isScrolling = false;
        wrapper.style.cursor = 'grab';
    });
    
    wrapper.addEventListener('mouseleave', function() {
        isScrolling = false;
        wrapper.style.cursor = 'grab';
    });
    
    // 初期カーソル設定
    wrapper.style.cursor = 'grab';
    wrapper.style.userSelect = 'none';
}

// ウィンドウリサイズ時の再初期化
window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        initMobileTableSupport();
    }
});

// スムーズスクロールのCSS追加
const style = document.createElement('style');
style.textContent = `
    .mobile-table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: #6366f1 #f1f5f9;
        border-radius: 12px;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-table-wrapper::-webkit-scrollbar {
        height: 8px;
    }
    
    .mobile-table-wrapper::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }
    
    .mobile-table-wrapper::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 4px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
        .mobile-table-wrapper table {
            min-width: 600px;
            margin: 0;
        }
        
        .mobile-table-wrapper table th,
        .mobile-table-wrapper table td {
            white-space: nowrap;
            padding: 0.6rem 0.4rem;
            font-size: 0.85rem;
        }
    }
`;
document.head.appendChild(style);