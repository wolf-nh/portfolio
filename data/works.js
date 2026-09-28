/* =================================================================
   実績リスト
   -----------------------------------------------------------------
   id         : 英数字とハイフンの一意な名前（history.js から参照）
   year       : 年（期間なら "2019-2026" のように書けます。並び順は新しいほうの年で判断）
   title      : タイトル
   lead       : タイトルの下に出す一文（任意。なければ省略可）
   group      : works ページのタブ（site.js の workGroups のどれか）
   category   : カテゴリ表記（詳細に表示する細かい分類）
   text       : 説明文（\n で改行）
   link       : サイトURL（なければ ""）
   images     : 詳細モーダルの画像。複数並べるとサムネイル切り替えになります
   print      : TOPの四つ切り写真用の画像（"" なら images の1枚目を使用）
   printShape : TOPの印画紙の向き "portrait"（縦）/ "landscape"（横）
   focus      : 画像を切り抜くときの基準位置（CSS の object-position 形式）
   top        : TOPに載せる順番（1〜8）。載せない作品は 0
   ================================================================= */
window.WORKS = [
  {
    id: "fantasy-creative",
    group: "Web",
    year: 2022,
    title: "小説投稿アプリへの誘導施策",
    lead: "読者を「書き手」に変える導線づくり",
    category: "Web / 企画・デザイン",
    text:
      "社内企画プレゼンで、男性向けファンタジー小説の投稿促進施策を提案。企画課内の投票・上長承認を経て採用され、KARTE担当と2名体制で実施しました。\n\n" +
      "短期間で作品の質そのものを高めるのは難しいため、まずは投稿の母数を増やすことに着目。公式アプリで小説を読むユーザーが「自分も書きたい」と思った瞬間に、投稿アプリを直接起動・インストールできる導線を設計しました。\n\n" +
      "クリエイティブは「書籍化」「インセンティブ」「創作意欲」の3訴求を制作し、A/Bテストを実施。\n\n" +
      "初動約2週間で約10万回表示／約7,000クリック／CTR約7%。\n" +
      "その後も運用を継続し、約7.5か月で約1.1万件のストア送客、180件以上のインストールにつながりました。\n\n" +
      "テストでは「創作したい」という感情への訴求よりも、大賞・書籍化など具体的なメリットを示した訴求の反応が高いことが判明。結果をもとに表示方法も見直し、継続的なユーザー獲得につなげました。",
    link: "",
    images: [
      "images/works/fantasy-creative-1.webp",
      "images/works/fantasy-creative-2.webp",
      "images/works/fantasy-creative-3.webp",
    ],
    print: "images/print/fantasy-creative.webp",
    printShape: "portrait",
    focus: "center",
    top: 1,
  },
  {
    id: "ehon-app",
    group: "App",
    year: "2019-2026",
    title: "絵本ひろばアプリ",
    lead: "Google Play ベスト オブ 2020「自己改善部門」部門賞受賞",
    category: "App / UI・Design System",
    text:
      "子ども向け無料絵本アプリ「絵本ひろば」（iOS / Android）のUI/UXデザインを担当。\n\n" +
      "子どもが一人で使う場面と、保護者と一緒に使う場面の両方を想定し、年齢を問わず直感的に操作できる、シンプルなUIを設計。\n" +
      "実際に子どもが利用する様子の検証や、保護者からの意見も取り入れながら、継続的にUI/UXの改善を行っています。\n\n" +
      "現在はスマートフォン・タブレット、iOS / Androidの各画面対応を進めるとともに、旧Adobe XDデータをFigmaへ移行。既存UIのコンポーネント化とデザインシステムの構築を進め、一貫性のあるUIと継続的に改善しやすいデザイン基盤の整備に取り組んでいます。\n\n" +
      "使用ツール：Adobe XD / Figma",
    link: "https://apps.apple.com/jp/app/id1471588949",
    images: ["images/works/ehon-app-showcase.webp", "images/works/ehon-app.jpg"],
    print: "images/print/ehon-app.webp",
    printShape: "landscape",
    focus: "center",
    top: 4,
  },
  {
    id: "alpha-manga",
    group: "Web",
    year: 2026,
    title: "ALPHA MANGA 公式サイト",
    lead: "Figma MCP × Copilotの実装フローを提案し、工数を大幅に削減",
    category: "Web / UI・Startup",
    text:
      "海外向けレンタルサービス開始に伴う、公式サイトの全面リニューアルを担当。\n\n" +
      "海外の競合サービスを調査し、ユーザーに馴染みのあるUIをベースに、作品を探しやすく直感的に使える画面を設計しました。\n\n" +
      "Figmaでコンポーネントとデザインシステムを構築し、AIが読み取りやすい構造でデザインデータを整備。\n" +
      "従来GitHub Copilotはコードレビューが中心でしたが、Figma MCPと連携しAIで直接実装するフローをエンジニアに提案し、導入しました。\n\n" +
      "その結果、1ページあたりの実装時間を数分程度まで短縮。開発効率とデザイン品質の両立を実現しました。",
    link: "https://www.alpha-manga.com/",
    images: ["images/works/alpha-manga-showcase.webp", "images/works/alpha-manga.jpg"],
    print: "images/print/alpha-manga.webp",
    printShape: "landscape",
    focus: "center top",
    top: 3,
  },
  {
    id: "ai-kousei",
    group: "App",
    year: 2025,
    title: "小説AI校正（ブラウザ版・投稿アプリ版）",
    category: "Web・App / UI・UX",
    text:
      "小説・漫画投稿サイト「アルファポリス」で、AIが誤字脱字や慣用句の誤りをチェックし執筆をサポートする「小説AI校正」機能のUI/UXデザインを担当。\n\n" +
      "既存の執筆フローを妨げず、書き手の負担にならない操作体験を目指しました。\n\n" +
      "クローズドβテストで寄せられたバグ報告や使い勝手のフィードバックをもとに、操作性を検証しながらUIを改善。\n" +
      "特にスマートフォンは画面サイズの制約が大きいため、情報の見せ方や操作導線をエンジニア・ディレクターと検証し、限られた画面でも直感的に使えるUIへ最適化しました。\n\n" +
      "リリース後も利用者から好評を得ており、既存ユーザーに自然に受け入れられるかたちでAI機能をサービスに組み込むことができました。\n\n" +
      "使用ツール：Figma",
    link: "https://www.alphapolis.co.jp/pages/topic_20251223",
    images: ["images/works/ai-kousei.jpg"],
    print: "images/print/ai-kousei.jpg",
    printShape: "landscape",
    focus: "center",
    top: 2,
  },
  {
    id: "jisho-akuyaku",
    group: "Web",
    year: 2025,
    title: "「自称悪役令嬢な婚約者の観察記録。」原作公式サイト",
    category: "Web",
    text:
      "アニメ原作特設サイトのページデザインおよびKVアニメーションの制作を担当。\n" +
      "After Effectsを用いたアニメーション制作と、CSSアニメーションの指示出しを行いました。\n" +
      "使用ツール：Adobe XD / After Effects",
    link: "https://www.alphapolis.co.jp/media/jisho-akuyaku",
    images: ["images/works/jisho-akuyaku.jpg"],
    print: "",
    printShape: "portrait",
    focus: "center",
    top: 0,
  },
  {
    id: "manga-poster",
    group: "Print",
    year: 2025,
    title: "漫画家大募集 B1ポスター",
    category: "Print",
    text:
      "新規ユーザー獲得を目的としたイベント告知用B1ポスターのデザインを担当。\n" +
      "印刷用の入稿完全データ作成まで対応しました。\n" +
      "使用ツール：Illustrator / Photoshop",
    link: "",
    images: ["images/works/manga-poster.jpg"],
    print: "",
    printShape: "portrait",
    focus: "center",
    top: 0,
  },
  {
    id: "tsukimichi",
    group: "Web",
    year: 2020,
    title: "「月が導く異世界道中」原作公式サイト",
    category: "Web",
    text: "アニメ原作特設サイトのページデザインを担当。\n使用ツール：Photoshop",
    link: "https://www.tsukimichi-alphapolis.com/",
    images: ["images/works/tsukimichi.jpg"],
    print: "",
    printShape: "landscape",
    focus: "center",
    top: 0,
  },

  /* ---- ここから下は TOP 非掲載（top: 0）の作品 ---- */
  {
    id: "saihito",
    group: "Web",
    year: 2024,
    title: "「最後にひとつだけおねがいしてもよろしいでしょうか」原作公式サイト",
    category: "Web",
    text:
      "アニメ原作特設サイトのページデザインとKVアニメーションの演出設計を担当。\n\n" +
      "KVに動きを取り入れたいという要望に対し、フロントエンドエンジニアと実装可能な表現を模索し、動きを最適化。\n" +
      "作品の世界観に自然に馴染む花びらのアニメーションを採用し、CSSアニメーションのイメージや挙動を整理して実装へつなげました。\n\n" +
      "使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/media/saihito",
    images: ["images/works/saihito-showcase.webp", "images/works/saihito.jpg"],
    print: "images/print/saihito.webp", printShape: "landscape", focus: "center", top: 8,
  },
  {
    id: "saioshi",
    group: "Web",
    year: 2024,
    title: "「最推しの義兄を愛でるため、長生きします！」原作公式サイト",
    category: "Web",
    text: "アニメ原作特設サイトのページデザインを担当。\nCSSアニメーションの指示出しを行いました。\n使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/media/saioshi",
    images: ["images/works/saioshi.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "sozaisaishu",
    group: "Web",
    year: 2025,
    title: "「素材採取家の異世界旅行記」原作公式サイト",
    category: "Web",
    text: "アニメ原作特設サイトのページデザインを担当。\nCSSアニメーションの指示出しを行いました。\n使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/media/sozaisaishu",
    images: ["images/works/sozaisaishu.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "kanchigai",
    group: "Web",
    year: 2024,
    title: "「勘違いの工房主」原作公式サイト",
    category: "Web",
    text: "アニメ原作特設サイトのページデザインを担当。\nCSSアニメーションの指示出しを行いました。\n使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/media/kanchigai",
    images: ["images/works/kanchigai.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "daraketai",
    group: "Web",
    year: 2025,
    title: "「転生王子はダラけたい」小説原作サイト",
    category: "Web",
    text: "小説原作特設サイトのページデザインを担当。\nCSSアニメーションの指示出しを行いました。\n使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/media/daraketai",
    images: ["images/works/daraketai.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "thumb-tool",
    group: "Tools",
    year: 2026,
    title: "書影サムネイル作成アプリ",
    lead: "1点約30分の作業を、約5分に短縮",
    category: "Tools / 社内向けWebアプリ",
    text:
      "Claudeを活用し、社内のデザイン関連業務を効率化するWebアプリを企画・開発。\n\n" +
      "ALPHA MANGAのサイトリニューアルに伴い大量に発生する書影サムネイルの制作を効率化するため、PSDを読み込んで指定サイズのJPEGを書き出せるツールを作成しました。\n" +
      "Photoshopの操作に不慣れなスタッフでも、ファイルを読み込んで大きさと位置を調整するだけで一定の品質で仕上げられるようにし、作業の属人化を軽減しました。\n\n" +
      "従来は1点あたり約30分かかっていた作業を約5分まで短縮し、制作業務の大幅な効率化につなげました。\n\n" +
      "使用ツール：Claude / Cursor（HTML・JavaScript）",
    link: "",
    images: ["images/works/thumb-tool.jpg"],
    print: "images/print/thumb-tool.jpg",
    printShape: "landscape",
    focus: "center",
    top: 6,
  },
  {
    id: "contrast-checker",
    group: "Tools",
    year: 2026,
    title: "コントラスト比チェッカー",
    lead: "配色の視認性を、その場ですぐ確認",
    category: "Tools / Web App",
    text:
      "Figma Makeで、文字色と背景色のコントラスト比を確認できるWebアプリを制作。\n\n" +
      "同様のツールは多くありますが、必要な機能だけをシンプルに使えるものが欲しく、自分用に作成しました。\n\n" +
      "HEX値の貼り付けとカラーピッカーのどちらでも色を指定でき、WCAG 2.1とAPCA（WCAG 3.0）の判定基準の切り替えや、ダークモードにも対応しています。\n\n" +
      "使用ツール：Figma Make",
    link: "https://above-femur-02488311.figma.site/",
    images: ["images/works/contrast-checker.jpg"],
    print: "",
    printShape: "landscape",
    focus: "center",
    top: 0,
  },
  {
    id: "noche",
    group: "Web",
    year: 2023,
    title: "ノーチェ レーベルサイト",
    category: "Web",
    text: "女性向けレーベルサイトのリニューアルデザインを担当。\n世界観やターゲットに合わせた情報設計とビジュアルの整理を行いました。\n使用ツール：Adobe XD",
    link: "https://noche.alphapolis.co.jp/",
    images: ["images/works/noche-showcase.webp", "images/works/noche.jpg"],
    print: "images/print/noche.webp", printShape: "landscape", focus: "center", top: 7,
  },
  {
    id: "kizuna",
    group: "Web",
    year: 2022,
    title: "アルファポリスの児童書 レーベルサイト",
    category: "Web",
    text:
      "子ども向け書籍レーベルの新規立ち上げに伴い、Webサイトのデザインを担当。\n\n" +
      "小中学生の子どもと保護者双方の利用を想定し、作品を探しやすい情報設計と、親しみやすさと見やすさを両立したビジュアルを設計しました。\n" +
      "※ロゴデザインは外部制作\n\n" +
      "使用ツール：Adobe XD",
    link: "https://kizuna.alphapolis.co.jp/",
    images: ["images/works/kizuna-showcase.webp", "images/works/kizuna.jpg"],
    print: "images/print/kizuna.webp", printShape: "landscape", focus: "center", top: 5,
  },
  {
    id: "search-assistant",
    group: "Web",
    year: 2024,
    title: "小説検索アシスタント β",
    category: "Web",
    text:
      "アルファポリス公式サイトにおけるAI検索アシスタント機能追加のデザインを担当。\n" +
      "AI機能を初めて使うユーザーでも直感的に操作できるよう、導線や画面構成を整理し、既存サイトとの親和性を意識したUI設計を行いました。\n" +
      "使用ツール：Adobe XD",
    link: "https://www.alphapolis.co.jp/novel/search_assistant",
    images: ["images/works/search-assistant.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "ehon-web",
    group: "Web",
    year: 2017,
    title: "絵本ひろば 公式サイト",
    category: "Web",
    text:
      "Web制作において、初期ラフ作成から進行管理、デザインチェックまでを担当。\n" +
      "あわせてキャラクターイラストの制作も行い、サービス全体の世界観づくりに貢献しました。\n" +
      "使用ツール：Adobe XD / Illustrator / Photoshop",
    link: "https://ehon.alphapolis.co.jp/?from=alphapolis",
    images: ["images/works/ehon-web.jpg"],
    print: "", printShape: "landscape", focus: "center", top: 0,
  },
  {
    id: "parka",
    group: "Goods",
    year: 2025,
    title: "フルグラフィックジップアップパーカー",
    category: "Goods",
    text: "キャラクターをイメージしたフルグラフィックのパーカーデザイン。\nデザインから型紙への展開まで完全入稿データの作成。\n使用ツール：Illustrator",
    link: "",
    images: ["images/works/parka.jpg"],
    print: "", printShape: "portrait", focus: "center", top: 0,
  },
  {
    id: "naruto-sealbox",
    group: "Goods",
    year: 2006,
    title: "NARUTO シールボックス パッケージデザイン",
    category: "Goods",
    text:
      "クライアント：株式会社ムービック\n\n有り型を使用したパッケージ・商品デザインを担当。\n" +
      "ジャンプフェスタにて販売された『NARUTO』シールボックスのデザインを制作しました。\n" +
      "ナルト／サスケの2種類を展開し、キャラクター性を活かしたビジュアル設計を行っています。",
    link: "",
    images: ["images/works/naruto-sealbox.jpg"],
    print: "", printShape: "portrait", focus: "center", top: 0,
  },
  {
    id: "naruto-clip",
    group: "Goods",
    year: 2006,
    title: "NARUTO クリアクリップ 台紙デザイン",
    category: "Goods",
    text:
      "クライアント：株式会社ムービック\n\n『NARUTO』クリアクリップ（4種）の台紙デザインおよび抜き型作成を担当。\n" +
      "漫画『NARUTO』に登場する各キャラクターのイメージに合わせて台紙デザインを行いました。",
    link: "",
    images: ["images/works/naruto-clip.jpg"],
    print: "", printShape: "portrait", focus: "center", top: 0,
  },
  {
    id: "bleach-choco",
    group: "Goods",
    year: 2006,
    title: "BLEACH チョコクランチBOX パッケージデザイン",
    category: "Goods",
    text:
      "クライアント：株式会社ムービック\n\n有り型を使用したパッケージデザインを担当。\n" +
      "ジャンプフェスタにて販売された『BLEACH』チョコクランチBOXのデザインを制作しました。\n" +
      "SDキャラクターを用い、女の子向けの可愛らしくPOPなテイストで仕上げています。",
    link: "",
    images: ["images/works/bleach-choco.jpg"],
    print: "", printShape: "portrait", focus: "center", top: 0,
  },
  {
    id: "afternoon40",
    group: "Goods",
    year: 2006,
    title: "アフタヌーン40周年記念 グッズデザイン",
    category: "Goods",
    text:
      "クライアント：株式会社ムービック\n\nアフタヌーン40周年記念企画におけるグッズデザインを担当。\n" +
      "下敷き、ストラップ、Tシャツなど、連載漫画をモチーフにした各種記念グッズのデザインを制作しました。",
    link: "",
    images: ["images/works/afternoon40.jpg"],
    print: "", printShape: "portrait", focus: "center", top: 0,
  },
];
