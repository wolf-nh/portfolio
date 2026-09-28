/* =================================================================
   サイト全体の設定
   ================================================================= */
window.SITE = {
  // ヘッダーの名前
  name: "Hill Noriko",

  // 肩書き（history のプロフィールで使用）
  role: "UI/UX Designer / Visual Designer",

  // エフェクトの初期状態（true = ON）
  // 閲覧者が切り替えた場合は、その設定がブラウザに保存されて優先されます。
  effectDefault: true,

  // 背景の煙（WebGL）を描くか。false にすると暗い背景色だけになります（検証用）
  // 表現はそのまま残っているので、true に戻せば元どおりです
  waterBackground: true,

  // works ページのタブ（表示順）。作品が1つもないタブは自動で隠れます
  workGroups: ["Web", "App", "Print", "Goods", "Tools"],
};
