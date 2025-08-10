document.addEventListener('DOMContentLoaded', function() {
  // 既存のMarkdown表をレスポンシブ表に変換
  convertMarkdownTables();
  
  // テーブル切り替え機能
  setupTableToggle();
  
  // スクロールヒント
  setupScrollHints();
});

function convertMarkdownTables() {
  const tables = document.querySelectorAll('.blog-content table');
  
  tables.forEach((table, index) => {
    // 表をwrapperで囲む
    if (!table.closest('.responsive-table-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'responsive-table-wrapper';
      
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      
      // レスポンシブクラス追加
      table.classList.add('responsive-table');
      
      // スクロールヒントを追加
      const hint = document.createElement('div');
      hint.className = 'table-scroll-hint';
      hint.textContent = '← 表は横にスクロールできます →';
      wrapper.parentNode.insertBefore(hint, wrapper.nextSibling);
      
      // 極小画面用のカード表示を作成
      createMobileCards(table, wrapper);
    }
  });
}

function createMobileCards(table, wrapper) {
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  
  if (headers.length === 0 || rows.length === 0) return;
  
  // カード表示用のコンテナを作成
  const cardContainer = document.createElement('div');
  cardContainer.className = 'mobile-card-table';
  
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('td'));
    
    const card = document.createElement('div');
    card.className = 'table-card';
    
    // カードヘッダー
    const cardHeader = document.createElement('div');
    cardHeader.className = 'table-card-header';
    
    const cardTitle = document.createElement('div');
    cardTitle.className = 'table-card-title';
    cardTitle.textContent = cells[0]?.textContent.trim() || `項目 ${rowIndex + 1}`;
    
    cardHeader.appendChild(cardTitle);
    card.appendChild(cardHeader);
    
    // カードコンテンツ
    const cardContent = document.createElement('div');
    cardContent.className = 'table-card-content';
    
    // ヘッダーとセルをペアにして表示（最初の列は既にタイトルで使用）
    for (let i = 1; i < headers.length && i < cells.length; i++) {
      const item = document.createElement('div');
      item.className = 'table-card-item';
      
      const label = document.createElement('div');
      label.className = 'table-card-label';
      label.textContent = headers[i];
      
      const value = document.createElement('div');
      value.className = 'table-card-value';
      value.textContent = cells[i]?.textContent.trim() || '-';
      
      item.appendChild(label);
      item.appendChild(value);
      cardContent.appendChild(item);
    }
    
    // 備考欄がある場合
    if (headers.includes('備考') && cells.length > headers.indexOf('備考')) {
      const noteIndex = headers.indexOf('備考');
      const noteText = cells[noteIndex]?.textContent.trim();
      if (noteText) {
        const note = document.createElement('div');
        note.className = 'table-card-note';
        note.textContent = noteText;
        cardContent.appendChild(note);
      }
    }
    
    card.appendChild(cardContent);
    cardContainer.appendChild(card);
  });
  
  // カードコンテナを表の後に挿入
  wrapper.parentNode.insertBefore(cardContainer, wrapper.nextSibling);
  
  // 切り替えボタンを追加（画面幅が狭い場合のみ）
  if (window.innerWidth <= 480) {
    addToggleButton(wrapper, cardContainer);
  }
}

function addToggleButton(tableWrapper, cardContainer) {
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'table-view-toggle';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = 'カード表示に切替';
  
  let isCardView = false;
  
  toggleBtn.addEventListener('click', function() {
    if (isCardView) {
      // テーブル表示
      tableWrapper.style.display = 'block';
      cardContainer.style.display = 'none';
      toggleBtn.textContent = 'カード表示に切替';
      isCardView = false;
    } else {
      // カード表示
      tableWrapper.style.display = 'none';
      cardContainer.style.display = 'block';
      toggleBtn.textContent = 'テーブル表示に切替';
      isCardView = true;
    }
  });
  
  toggleContainer.appendChild(toggleBtn);
  tableWrapper.parentNode.insertBefore(toggleContainer, tableWrapper);
}

function setupTableToggle() {
  // リサイズ時の処理
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const toggleButtons = document.querySelectorAll('.table-view-toggle');
      toggleButtons.forEach(btn => {
        if (window.innerWidth > 480) {
          btn.style.display = 'none';
          // テーブル表示に戻す
          const tableWrapper = btn.nextElementSibling;
          const cardContainer = tableWrapper?.nextElementSibling?.nextElementSibling;
          if (tableWrapper) tableWrapper.style.display = 'block';
          if (cardContainer && cardContainer.classList.contains('mobile-card-table')) {
            cardContainer.style.display = 'none';
          }
        } else {
          btn.style.display = 'flex';
        }
      });
    }, 250);
  });
}

function setupScrollHints() {
  const tableWrappers = document.querySelectorAll('.responsive-table-wrapper');
  
  tableWrappers.forEach(wrapper => {
    const table = wrapper.querySelector('table');
    if (!table) return;
    
    // スクロール可能かチェック
    function checkScrollable() {
      const hint = wrapper.nextElementSibling;
      if (hint && hint.classList.contains('table-scroll-hint')) {
        if (wrapper.scrollWidth > wrapper.clientWidth) {
          hint.style.display = 'block';
        } else {
          hint.style.display = 'none';
        }
      }
    }
    
    // 初期チェック
    setTimeout(checkScrollable, 100);
    
    // リサイズ時にチェック
    window.addEventListener('resize', checkScrollable);
    
    // スクロール時のスムーズ効果
    wrapper.addEventListener('scroll', function() {
      const hint = wrapper.nextElementSibling;
      if (hint && hint.classList.contains('table-scroll-hint')) {
        // スクロール中は薄く表示
        hint.style.opacity = '0.5';
        clearTimeout(wrapper.scrollTimeout);
        wrapper.scrollTimeout = setTimeout(() => {
          hint.style.opacity = '1';
        }, 1000);
      }
    });
  });
}

// 特定のセルにハイライト効果を追加する関数
function highlightTableCells() {
  const tables = document.querySelectorAll('.responsive-table');
  
  tables.forEach(table => {
    const cells = table.querySelectorAll('td');
    
    cells.forEach(cell => {
      const text = cell.textContent.trim();
      
      // 高い数値をハイライト
      if (text.includes('%')) {
        const percentage = parseFloat(text);
        if (percentage >= 40) {
          cell.classList.add('highlight-cell');
        } else if (percentage <= 10) {
          cell.classList.add('warning-cell');
        }
      }
      
      // 特定のキーワードをハイライト
      if (text.includes('極めて高い') || text.includes('最優秀')) {
        cell.classList.add('highlight-cell');
      }
      
      if (text.includes('期待薄') || text.includes('要注意')) {
        cell.classList.add('warning-cell');
      }
    });
  });
}

// ページ読み込み後にハイライト適用
window.addEventListener('load', function() {
  setTimeout(highlightTableCells, 500);
});