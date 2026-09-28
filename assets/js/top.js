/* TOP：トレーの線、印画紙の配置・現像・フォーカス、エフェクト切り替えの移動演出 */
(function () {
  const WORKS = window.WORKS || [];
  const Site = window.Site;
  const root = document.documentElement;

  /* ---------- 印画紙を置く場所 ----------
     x, y : ステージ内の中心位置（%）
     作品の割り当て・傾き・重なり・現像の順番は、読み込むたびにランダムに変わります。
     縦位置の用紙は幅 W_PORTRAIT、横位置は W_LANDSCAPE（単位は --u） */
  const SLOTS = [
    { x: 50, y: 49 },   // 中心：まとまりの芯になる1枚
    { x: 31, y: 37 },
    { x: 48, y: 27 },
    { x: 67, y: 32 },
    { x: 75, y: 55 },
    { x: 63, y: 72 },
    { x: 41, y: 71 },
    { x: 26, y: 61 },
  ];
  const SLOTS_6 = [0, 1, 3, 4, 6, 7];   // 6作品のときに使う場所
  const W_PORTRAIT = 18;
  const W_LANDSCAPE = 23;
  const JITTER = 2;      // 位置のばらつき（%）
  const MAX_TILT = 11;   // 傾きの最大（deg）
  const HOVER_STRAIGHTEN = 5;   // ホバーで真っ直ぐに戻す角度（deg）

  const rand = (min, max) => min + Math.random() * (max - min);
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ---------- トレー：真上から見た薬液バットを白い線で描く ---------- */
  const tray = document.getElementById("tray");
  function drawTray() {
    if (!tray) return;
    const w = tray.clientWidth;
    const h = tray.clientHeight;
    const min = Math.min(w, h);
    // 縁（外側とリップの2本）→ 内壁 → 底。壁の幅を大きめにとって深さを出す
    const ox = w * 0.06, oy = h * 0.025, ow = w - ox * 2, oh = h - oy * 2;
    const lip = min * 0.012;
    const lx = ox + lip, ly = oy + lip, lw = ow - lip * 2, lh = oh - lip * 2;
    const d = min * 0.085;
    const fx = lx + d, fy = ly + d * 0.85, fw = lw - d * 2, fh = lh - d * 1.7;
    const r1 = 22, r2 = 18, r3 = 12;
    const c1 = r2 * 0.3, c2 = r3 * 0.3;   // 角の丸みの内側から斜めの稜線を引く
    tray.setAttribute("viewBox", `0 0 ${w} ${h}`);
    tray.innerHTML = `
      <defs>
        <linearGradient id="tray-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#dfe6ea" stop-opacity="0.05"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.12"/>
        </linearGradient>
      </defs>
      <path class="tray__wall" fill-rule="evenodd" d="
        M${lx + r2},${ly} H${lx + lw - r2} Q${lx + lw},${ly} ${lx + lw},${ly + r2} V${ly + lh - r2} Q${lx + lw},${ly + lh} ${lx + lw - r2},${ly + lh} H${lx + r2} Q${lx},${ly + lh} ${lx},${ly + lh - r2} V${ly + r2} Q${lx},${ly} ${lx + r2},${ly} Z
        M${fx + r3},${fy} H${fx + fw - r3} Q${fx + fw},${fy} ${fx + fw},${fy + r3} V${fy + fh - r3} Q${fx + fw},${fy + fh} ${fx + fw - r3},${fy + fh} H${fx + r3} Q${fx},${fy + fh} ${fx},${fy + fh - r3} V${fy + r3} Q${fx},${fy} ${fx + r3},${fy} Z"/>
      <rect class="tray__floor-fill" x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="${r3}"/>
      <rect class="tray__rim" x="${ox}" y="${oy}" width="${ow}" height="${oh}" rx="${r1}"/>
      <rect class="tray__lip" x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="${r2}"/>
      <rect class="tray__floor" x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="${r3}"/>
      <path class="tray__edge" d="
        M${lx + c1},${ly + c1} L${fx + c2},${fy + c2}
        M${lx + lw - c1},${ly + c1} L${fx + fw - c2},${fy + c2}
        M${lx + c1},${ly + lh - c1} L${fx + c2},${fy + fh - c2}
        M${lx + lw - c1},${ly + lh - c1} L${fx + fw - c2},${fy + fh - c2}"/>`;
  }
  drawTray();
  window.addEventListener("resize", drawTray);

  /* ---------- 印画紙を並べる ---------- */
  const stage = document.getElementById("stage");
  const topWorks = WORKS.filter((w) => w.top > 0).sort((a, b) => a.top - b.top).slice(0, 8);
  const slots = topWorks.length > 6 ? SLOTS : SLOTS_6.map((k) => SLOTS[k]);
  let zTop = topWorks.length + 1;

  const prints = topWorks.map((work) => {
    const landscape = work.printShape === "landscape";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "print" + (landscape ? " print--landscape" : "");
    btn.style.setProperty("--w", landscape ? W_LANDSCAPE : W_PORTRAIT);
    btn.style.setProperty("--focus", work.focus || "center");
    btn.setAttribute("aria-label", `${work.title} の詳細を見る`);
    btn.innerHTML = `
      <span class="print__paper">
        <span class="print__window"><img class="print__img" alt="" src="${work.print || work.images[0]}"></span>
      </span>`;
    // 触れた写真を一番上に重ねる（離れても順番は残る）
    const raise = () => { btn.style.setProperty("--z", ++zTop); updateDepth(); };
    btn.addEventListener("pointerenter", raise);
    btn.addEventListener("focus", raise);
    btn.addEventListener("click", () => Site.openWork(work));
    stage.appendChild(btn);
    return btn;
  });

  // 置き場所・傾き・重なり・現像順をシャッフル（グリッド表示の並びは works.js の順のまま）
  function scatter() {
    const place = shuffle(slots);
    const order = shuffle(prints.map((_, i) => i));
    const layer = shuffle(prints.map((_, i) => i + 1));
    prints.forEach((btn, i) => {
      const s = place[i];
      const tilt = rand(3, MAX_TILT) * (Math.random() < 0.5 ? -1 : 1);
      btn.style.setProperty("--x", (s.x + rand(-JITTER, JITTER)).toFixed(2));
      btn.style.setProperty("--y", (s.y + rand(-JITTER, JITTER)).toFixed(2));
      btn.style.setProperty("--r", tilt.toFixed(2));
      // ホバー時は最大 HOVER_STRAIGHTEN 度だけ真っ直ぐに戻す
      const back = Math.sign(tilt) * Math.min(HOVER_STRAIGHTEN, Math.abs(tilt));
      btn.style.setProperty("--r-hover", (tilt - back).toFixed(2));
      btn.style.setProperty("--z", layer[i]);
      btn.style.setProperty("--i", order[i]);
      // 水の中でゆらぐ動き：大きさ・向き・周期を1枚ずつ変える
      btn.style.setProperty("--drift", `${rand(16, 24).toFixed(1)}s`);
      btn.style.setProperty("--drift-delay", `${-rand(0, 20).toFixed(1)}s`);
      btn.style.setProperty("--dx", (rand(4, 8) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1));
      btn.style.setProperty("--dy", (rand(4, 8) * (Math.random() < 0.5 ? -1 : 1)).toFixed(1));
      btn.style.setProperty("--dr", (rand(0.6, 1.2) * (Math.random() < 0.5 ? -1 : 1)).toFixed(2));
    });
    zTop = prints.length + 1;
    updateDepth();
  }

  // 重なり順を3段階の奥行きに（下の段ほど暗く沈む）
  function updateDepth() {
    const sorted = prints.slice().sort((a, b) =>
      parseInt(a.style.getPropertyValue("--z"), 10) - parseInt(b.style.getPropertyValue("--z"), 10));
    sorted.forEach((btn, i) => {
      btn.dataset.depth = String(1 + Math.floor((i * 3) / sorted.length));
    });
  }

  /* ---------- 現像：白い印画紙が置かれ、順に像が浮かび上がる ---------- */
  let developTimer = 0;
  function develop() {
    clearTimeout(developTimer);
    stage.classList.remove("is-developing", "is-developed");
    // エフェクトOFF・スマホ（グリッド）では現像演出なし
    if (!root.classList.contains("fx-on") || stage.classList.contains("is-grid")) {
      stage.classList.add("is-developed");
      return;
    }
    const imgs = [...stage.querySelectorAll(".print__img")];
    const ready = Promise.all(imgs.map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
    const timeout = new Promise((r) => { developTimer = setTimeout(r, 1800); });
    const total = (1.9 + (imgs.length - 1) * 0.55 + 5.6) * 1000;
    Promise.race([ready, timeout]).then(() => {
      if (!root.classList.contains("fx-on")) return;
      requestAnimationFrame(() => {
        stage.classList.add("is-developing");
        developTimer = setTimeout(() => {
          stage.classList.add("is-developed");
          stage.classList.remove("is-developing");
        }, total + 200);
      });
    });
  }

  /* ---------- スマホはグリッド ---------- */
  const mqGrid = window.matchMedia("(max-width: 767px), (hover: none)");
  const applyGrid = () => stage.classList.toggle("is-grid", mqGrid.matches);
  applyGrid();
  mqGrid.addEventListener("change", applyGrid);

  /* ---------- エフェクト ON / OFF ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let switchToken = 0;

  // ON → OFF：散らばった印画紙がグリッドの位置へ移動してから、効果が切れる
  function turnOff() {
    const animate = !stage.classList.contains("is-grid") && !reduceMotion.matches && prints[0].animate;
    const first = prints.map((p) => {
      const r = p.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: p.offsetWidth,
        rot: parseFloat(p.style.getPropertyValue("--r")) || 0,
      };
    });
    clearTimeout(developTimer);
    stage.classList.remove("is-developing");
    stage.classList.add("is-developed");
    Site.applyEffect(false);
    window.scrollTo(0, 0);
    if (!animate) {
      if (window.Water) window.Water.setRunning(false);
      return;
    }
    const token = ++switchToken;
    root.classList.add("is-switching");
    const runs = prints.map((p, i) => {
      const r = p.getBoundingClientRect();
      const f = first[i];
      const dx = f.cx - (r.left + r.width / 2);
      const dy = f.cy - (r.top + r.height / 2);
      const s = f.w / p.offsetWidth;
      return p.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) rotate(${f.rot}deg) scale(${s})` },
          { transform: "none" },
        ],
        { duration: 1100, delay: i * 45, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "backwards" }
      ).finished;
    });
    Promise.all(runs).catch(() => {}).then(() => {
      if (token !== switchToken) return;   // 途中で ON に戻された
      root.classList.remove("is-switching");
      if (window.Water) window.Water.setRunning(false);
    });
  }

  // OFF → ON：新しく散らばり直し、白い印画紙が浮かぶところから
  function turnOn() {
    // 移動中なら即座に終わらせてから戻す
    switchToken++;
    prints.forEach((p) => p.getAnimations().forEach((a) => a.cancel()));
    root.classList.remove("is-switching");
    Site.applyEffect(true);
    window.scrollTo(0, 0);
    if (window.Water) window.Water.setRunning(true);
    scatter();
    develop();
  }

  Site.onToggle = (on) => (on ? turnOn() : turnOff());

  scatter();
  develop();

})();
