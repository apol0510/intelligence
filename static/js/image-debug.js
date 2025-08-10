// ブログカード画像のデバッグ用スクリプト
document.addEventListener('DOMContentLoaded', function() {
    console.log('Image debug script loaded');
    
    // すべてのブログカード画像を監視
    const blogImages = document.querySelectorAll('.blog-card-image img');
    
    console.log(`Found ${blogImages.length} blog card images`);
    
    blogImages.forEach((img, index) => {
        console.log(`Image ${index + 1}: ${img.src}`);
        
        // 強制的にスタイルを適用
        img.style.display = 'block !important';
        img.style.visibility = 'visible !important';
        img.style.opacity = '1 !important';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        
        img.addEventListener('load', function() {
            console.log(`✓ Image loaded successfully: ${this.src}`);
            // 再度強制的にスタイルを適用
            this.style.display = 'block !important';
            this.style.visibility = 'visible !important';
            this.style.opacity = '1 !important';
        });
        
        img.addEventListener('error', function() {
            console.error(`✗ Image failed to load: ${this.src}`);
            
            // フォールバック表示を作成
            const parentElement = this.parentElement;
            parentElement.style.background = '#f3f4f6';
            parentElement.style.display = 'flex';
            parentElement.style.alignItems = 'center';
            parentElement.style.justifyContent = 'center';
            parentElement.style.position = 'relative';
            
            // エラーメッセージを表示
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="text-align: center; color: #6b7280; padding: 1rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                    <div style="font-size: 0.875rem;">画像を読み込んでいます...</div>
                    <div style="font-size: 0.75rem; margin-top: 0.25rem; opacity: 0.7;">${this.src}</div>
                </div>
            `;
            parentElement.appendChild(errorDiv);
            
            // 画像を隠す
            this.style.display = 'none';
        });
        
        // 既に読み込まれている場合の処理
        if (img.complete) {
            if (img.naturalWidth > 0) {
                console.log(`✓ Image already loaded: ${img.src}`);
                img.style.display = 'block !important';
                img.style.visibility = 'visible !important';
                img.style.opacity = '1 !important';
            } else {
                console.error(`✗ Image loaded but has no dimensions: ${img.src}`);
                img.dispatchEvent(new Event('error'));
            }
        }
        
        // 3秒後に再チェック
        setTimeout(() => {
            if (!img.complete || img.naturalWidth === 0) {
                console.log(`Retrying image load: ${img.src}`);
                const newSrc = img.src;
                img.src = '';
                img.src = newSrc;
            }
        }, 3000);
    });
});