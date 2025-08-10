# NANKAN Intelligence | 南関競馬AI予想

AI・機械学習による南関競馬予想サイト。的中率76.4%、回収率158%の実績を持つデータ分析型競馬予想システムです。

## 🏇 サイト概要

南関東競馬（大井・船橋・浦和・川崎）の全レースをAI分析し、高精度な予想を提供する競馬情報サイトです。

### 主な機能
- **AI予想システム**: 機械学習による高精度な競馬予想
- **コース攻略ガイド**: 各競馬場・距離別の詳細な攻略法
- **データ分析**: 馬番別・人気別・脚質別の統計データ
- **レスポンシブデザイン**: PC・スマホ・タブレット対応

## 📊 実績
- **的中率**: 76.4%
- **回収率**: 158%
- **対象**: 南関東4場（大井・船橋・浦和・川崎）全レース

## 🛠 技術スタック

- **Static Site Generator**: Hugo
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Visualization**: Chart.js
- **Hosting**: Netlify
- **Version Control**: Git/GitHub

## 📁 プロジェクト構造

```
intelligence/
├── content/                 # コンテンツファイル
│   ├── blog/               # ブログ記事
│   └── _index.md           # ホームページ
├── layouts/                 # Hugoテンプレート
│   ├── _default/           # デフォルトレイアウト
│   ├── blog/               # ブログレイアウト
│   └── shortcodes/         # ショートコード
├── static/                  # 静的ファイル
│   ├── css/                # スタイルシート
│   ├── js/                 # JavaScript
│   └── img/                # 画像ファイル
├── data/                    # データファイル
├── config.yaml             # Hugo設定
├── netlify.toml            # Netlify設定
└── README.md               # このファイル
```

## 🚀 開発環境のセットアップ

### 前提条件
- Hugo v0.148.2 or later
- Git

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/apol0510/intelligence.git
cd intelligence

# 開発サーバーを起動
hugo server

# ブラウザで確認
open http://localhost:1313
```

### ビルド

```bash
# 本番用ビルド
hugo --gc --minify
```

## 📱 レスポンシブ対応

- **デスクトップ**: 1200px以上
- **タブレット**: 768px - 1199px
- **モバイル**: 767px以下

### 主な対応内容
- 画像の自動リサイズ
- 表の横スクロール対応
- タッチ操作最適化
- フォントサイズの調整

## 📄 主要ページ

- **ホーム**: AI予想の概要と最新情報
- **ブログ**: 攻略ガイドとデータ分析記事
  - 浦和800m完全攻略ガイド
  - 馬番別成績分析
- **予想**: 無料AI予想へのリンク

## 🔧 カスタマイズ

### コンテンツ追加
新しいブログ記事を追加する場合：

```bash
hugo new blog/new-article.md
```

### スタイル変更
CSSファイルは`/static/css/`ディレクトリ内で管理されています。

## 📈 SEO対策

- メタタグ最適化
- Open Graph対応
- Twitter Card対応
- 構造化データ実装
- サイトマップ自動生成

## 🌐 デプロイ

### Netlify
1. GitHubリポジトリをNetlifyに接続
2. ビルド設定は`netlify.toml`で自動設定
3. 自動デプロイが有効

### ビルド設定
- **Build command**: `hugo --gc --minify`
- **Publish directory**: `public`
- **Hugo version**: `0.148.2`

## ⚠️ 免責事項

競馬は適度に楽しみましょう。予想は参考情報であり、馬券購入は自己責任でお願いします。20歳以上限定のサービスです。

## 📞 お問い合わせ

ご質問やご要望がございましたら、GitHubのIssueからお気軽にお問い合わせください。

---

© 2025 NANKAN Intelligence. All rights reserved.