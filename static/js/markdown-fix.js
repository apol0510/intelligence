document.addEventListener('DOMContentLoaded', function() {
  // **マークが正しく処理されていない場合の修正
  setTimeout(() => {
    fixMarkdownBold();
    fixMarkdownElements();
  }, 500);
  
  // ページロード完了後にも実行
  window.addEventListener('load', function() {
    setTimeout(() => {
      fixMarkdownBold();
      fixMarkdownElements();
    }, 1000);
  });
  
  // デバッグ用：手動実行ボタンを追加（開発時のみ）
  if (window.location.hostname === 'localhost') {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '**修正実行';
    debugBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;';
    debugBtn.onclick = function() {
      fixMarkdownBold();
      fixMarkdownElements();
      alert('Markdown修正を実行しました');
    };
    document.body.appendChild(debugBtn);
  }
});

function fixMarkdownBold() {
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;
  
  console.log('Running markdown bold fix...');
  
  // まず、HTMLレベルで修正
  let html = articleContent.innerHTML;
  const originalHTML = html;
  
  // **で囲まれたテキストを<strong>に変換（より確実なパターンマッチング）
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  
  // 変更があった場合のみ更新
  if (html !== originalHTML) {
    articleContent.innerHTML = html;
    console.log('Markdown bold conversion applied');
  }
  
  // さらにテキストノードレベルでも修正（念のため）
  const walker = document.createTreeWalker(
    articleContent,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  
  // すべてのテキストノードを収集
  while (node = walker.nextNode()) {
    if (node.textContent.includes('**')) {
      textNodes.push(node);
    }
  }
  
  // **パターンを修正
  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    
    if (text.includes('**')) {
      const newHTML = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
      
      if (newHTML !== text && newHTML.includes('<strong>')) {
        const tempSpan = document.createElement('span');
        tempSpan.innerHTML = newHTML;
        
        // 新しいノードで置き換え
        const fragment = document.createDocumentFragment();
        while (tempSpan.firstChild) {
          fragment.appendChild(tempSpan.firstChild);
        }
        
        textNode.parentNode.replaceChild(fragment, textNode);
        console.log('Fixed text node:', text, '→', newHTML);
      }
    }
  });
}

function fixMarkdownElements() {
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;
  
  // 他のMarkdown要素の修正も可能
  
  // - ** で始まるリスト項目の修正
  const listItems = articleContent.querySelectorAll('li');
  listItems.forEach(li => {
    const html = li.innerHTML;
    const fixedHTML = html.replace(/- \*\*([^*]+)\*\*/g, '- <strong>$1</strong>');
    if (fixedHTML !== html) {
      li.innerHTML = fixedHTML;
    }
  });
}

// 動的に追加された要素にも適用
function applyMarkdownFixes(element) {
  const textContent = element.textContent || element.innerHTML;
  
  if (textContent.includes('**')) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.textContent.includes('**')) {
        textNodes.push(node);
      }
    }
    
    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      const newHTML = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      if (newHTML !== text) {
        const tempSpan = document.createElement('span');
        tempSpan.innerHTML = newHTML;
        
        const fragment = document.createDocumentFragment();
        while (tempSpan.firstChild) {
          fragment.appendChild(tempSpan.firstChild);
        }
        
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }
}

// MutationObserverで動的な変更を監視（オプション）
const markdownObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.includes('**')) {
        applyMarkdownFixes(node);
      }
    });
  });
});

// オブザーバーを開始（記事内容のみ監視）
const articleContent = document.querySelector('.article-content');
if (articleContent) {
  markdownObserver.observe(articleContent, { childList: true, subtree: true });
}