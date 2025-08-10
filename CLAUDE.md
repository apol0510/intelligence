# NANKAN Intelligence 開発ログ

このファイルは、NANKAN Intelligence（南関競馬AI予想サイト）の開発過程で発生した問題と解決策を記録しています。

## プロジェクト概要
- **サイト名**: NANKAN Intelligence | 南関競馬AI予想
- **技術スタック**: Hugo Static Site Generator, HTML/CSS/JavaScript, Netlify
- **目的**: AI・機械学習による南関競馬予想サイト

## 重要な問題解決記録

### 2025-08-10: ブログカード画像表示問題の完全解決

#### 🐛 問題
- ブログ一覧ページで浦和800m記事のカード画像が表示されない
- JavaScriptコンソールエラー: `GET http://localhost:1313/blog/undefined [404]`
- 画像のsrc属性が`undefined`になる問題

#### 🔍 調査過程
1. **初期調査**: CSSのobject-fit問題と思われたが、実際は異なる原因
2. **HTML確認**: テンプレートは正しく絶対URL(`http://localhost:1313/img/urawa_800m.png`)を生成
3. **JavaScript調査**: ブラウザで実際のimg.srcが`undefined`になることを発見
4. **根本原因特定**: `static/js/script.js`のlazy loading処理が原因

#### ⚡ 根本原因
```javascript
// 問題のあったコード
const images = document.querySelectorAll('img[loading="lazy"]');
images.forEach(img => {
    img.src = img.dataset.src; // data-src属性が存在しない場合、undefinedが設定される
});
```

#### ✅ 解決策
```javascript
// 修正後のコード
const images = document.querySelectorAll('img[loading="lazy"]');
images.forEach(img => {
    // data-src属性がある場合のみsrcを置換
    if (img.dataset.src && img.dataset.src !== 'undefined') {
        img.src = img.dataset.src;
    }
});
```

#### 📝 その他の修正
1. **JavaScript const重複宣言エラー解消**
   - `hero.js`: `const style` → `const heroStyle`
   - `mobile-tables.js`: `const style` → `const mobileTableStyle`

2. **CSS不正プロパティ削除**
   - `responsive-images.css`: 不正な`loading`, `decoding`, `aspect-ratio`プロパティを削除
   - `mobile-tables.css`: 不正なセレクター`::-webkit-scrollbar-thumb:hover`を修正

3. **Hugo テンプレート改善**
   - より厳密な画像存在チェック: `{{ if and .Params.image (ne .Params.image "") (ne .Params.image nil) }}`
   - 絶対URL生成: `{{ .Params.image | absURL }}`

#### 🎯 学んだ教訓
- **JavaScript**: DOM操作時は必ず属性の存在確認を行う
- **Hugo**: テンプレートでの条件分岐は厳密に行う
- **デバッグ**: ブラウザ開発者ツールとサーバーログの両方を活用する
- **段階的解決**: 複数の問題が組み合わさっている場合は、一つずつ解決する

#### 🚀 結果
- ブログカード画像が正常表示
- JavaScriptエラー完全解消
- Netlifyデプロイも正常動作

---

## 開発環境情報
- **Hugo バージョン**: v0.148.2+extended+withdeploy darwin/amd64
- **Node.js**: Chart.js等のライブラリで使用
- **デプロイ**: Netlify (GitHub連携)

## 今後の注意点
- 新しいJavaScript追加時は、DOM操作での属性存在確認を必須とする
- 画像関連の機能追加時は、lazy loading処理との競合を確認する
- Hugoテンプレート修正時は、条件分岐の厳密性を保つ