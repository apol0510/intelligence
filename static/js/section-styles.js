document.addEventListener('DOMContentLoaded', function() {
  // 特定の見出しを元のスタイルに戻す
  const headings = document.querySelectorAll('.article-content h3');
  
  headings.forEach(heading => {
    const text = heading.textContent.trim();
    
    // 「馬番分析の重要ポイント」など、特定の見出しを元のスタイルに
    if (text.includes('馬番分析') || 
        text.includes('重要ポイント') || 
        text.includes('人気別分析') ||
        text.includes('分析の重要ポイント')) {
      
      // 新しいスタイルを無効化
      heading.style.padding = '0';
      heading.style.background = 'none';
      heading.style.borderRadius = '0';
      heading.style.borderLeft = 'none';
      
      // 元のデフォルトスタイルに戻す
      heading.classList.add('original-style');
    }
  });
});

// 元のスタイル用のCSS
const sectionStyle = document.createElement('style');
sectionStyle.textContent = `
  .article-content h3.original-style {
    font-size: 1.4rem !important;
    font-weight: 600 !important;
    color: #1f2937 !important;
    margin: 2rem 0 1rem !important;
    padding: 0 !important;
    background: none !important;
    border-radius: 0 !important;
    border-left: none !important;
  }
`;
document.head.appendChild(sectionStyle);