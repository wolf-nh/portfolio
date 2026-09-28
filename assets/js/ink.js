/* インクのにじみ
   ・文字（と、ボタンの枠線）を「乾いた層」と「濡れた層（にじみフィルター付き）」の2枚に分け、
     マウス位置を中心にした縦長の楕円マスクで濡れた層をのぞかせる。
     半径がゆっくり育ち、中心がマウスへ遅れて追従し、重力で少しずつ下へずれる。
       - bleedOnHover(el, opts) : ホバーでにじむ（リンク・ボタン）
       - bleedOnDwell(el, opts) : マウスをしばらく止めるとにじみ、動かすと乾く（文章）
   ・にじみの色はサイト全体で1色（薄墨）に統一 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PAD = 28;   // にじみが広がる余白（px）
  let defs = null;

  // にじみの色（薄墨）と濃さ
  const INK_COLOR = "#8e959b";
  const INK_DENSITY = 0.95;

  const fxOn = () => document.documentElement.classList.contains("fx-on");

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (parent) parent.appendChild(node);
    return node;
  }

  function ensureDefs() {
    if (defs) return defs;
    const svg = el("svg", { "aria-hidden": "true", width: "0", height: "0" });
    svg.style.position = "absolute";
    defs = el("defs", {}, svg);
    document.body.appendChild(svg);
    buildInkFilter("ink-wet");
    return defs;
  }

  /* にじみフィルター：にじんだ部分を薄墨色に染める */
  function buildInkFilter(id) {
    const f = el("filter", {
      id, x: "-20%", y: "-20%", width: "140%", height: "150%",
      "color-interpolation-filters": "sRGB",
    }, defs);
    // 広がり方を決める大きなムラ
    el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.06", numOctaves: "2", seed: "7", result: "blot" }, f);
    // 紙が水を吸ったような濃淡（アルファに変換）
    el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.16", numOctaves: "3", seed: "3", result: "grain" }, f);
    el("feColorMatrix", {
      in: "grain", type: "matrix", result: "grainA",
      values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.8",
    }, f);
    // 外へ広がるにじみ（縦長にぼかし、少し下へずらして重力を出す）
    el("feMorphology", { in: "SourceGraphic", operator: "dilate", radius: "1.4", result: "fat" }, f);
    el("feGaussianBlur", { in: "fat", stdDeviation: "3.2 5", result: "soft" }, f);
    el("feOffset", { in: "soft", dx: "0", dy: "3.5", result: "sag" }, f);
    el("feDisplacementMap", {
      in: "sag", in2: "blot", scale: "16", xChannelSelector: "R", yChannelSelector: "G", result: "bleed",
    }, f);
    el("feComposite", { in: "bleed", in2: "grainA", operator: "in", result: "mottled" }, f);
    const ct = el("feComponentTransfer", { in: "mottled", result: "bleedA" }, f);
    el("feFuncA", { type: "linear", slope: String(INK_DENSITY) }, ct);
    el("feFlood", { "flood-color": INK_COLOR, result: "tone" }, f);
    el("feComposite", { in: "tone", in2: "bleedA", operator: "in", result: "tinted" }, f);
    // 文字本体：水を含んで輪郭がゆるむ
    el("feDisplacementMap", {
      in: "SourceGraphic", in2: "blot", scale: "3", xChannelSelector: "G", yChannelSelector: "R", result: "wobble",
    }, f);
    el("feGaussianBlur", { in: "wobble", stdDeviation: "0.7", result: "core" }, f);
    const merge = el("feMerge", {}, f);
    el("feMergeNode", { in: "tinted" }, merge);
    el("feMergeNode", { in: "core" }, merge);
  }

  /* ---------- にじみの本体：乾いた層と濡れた層、マスクのアニメーション ---------- */
  function createWet(target, opts) {
    ensureDefs();
    const block = !!opts.block;
    const maxR = opts.radius || 46;
    const grow = opts.grow || 0.9;
    const follow = opts.follow || 3.5;
    const dry = opts.dry || 1.1;

    const tag = "span";   // 行内・ブロックどちらでも使えるよう span（ブロック時は CSS で block に）
    const base = document.createElement(tag);
    base.className = "ink__base";
    const wet = document.createElement(tag);
    wet.className = "ink__wet";
    wet.setAttribute("aria-hidden", "true");
    wet.style.filter = "url(#ink-wet)";

    function mirror() {
      wet.innerHTML = base.innerHTML;
      wet.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    }
    // 元の中身を乾いた層へ移し、濡れた層には同じ見た目の複製を置く
    while (target.firstChild) base.appendChild(target.firstChild);
    mirror();
    target.classList.add("ink");
    if (block) target.classList.add("ink--block");
    target.style.setProperty("--pad", `${PAD}px`);
    target.append(base, wet);

    let active = false;          // にじみが育っている最中か
    let px = 0, py = 0;          // マウス位置（要素内）
    let mx = 0, my = 0;          // にじみの中心（遅れて追従）
    let r = 0, a = 0, sag = 0;   // 半径・濃さ・垂れ
    let last = 0, raf = 0;

    function apply() {
      target.style.setProperty("--mx", mx.toFixed(1));
      target.style.setProperty("--my", (my + sag).toFixed(1));
      target.style.setProperty("--r", r.toFixed(1));
      target.style.setProperty("--a", a.toFixed(3));
    }

    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (active) {
        r += (maxR - r) * (1 - Math.exp(-grow * dt));            // じゅわっと、だんだんゆっくり
        a += (1 - a) * (1 - Math.exp(-2.2 * dt));
        sag += (maxR * 0.35 - sag) * (1 - Math.exp(-0.6 * dt));  // 重力でゆっくり下へ
        const k = 1 - Math.exp(-follow * dt);
        mx += (px - mx) * k;
        my += (py - my) * k;
      } else {
        a += (0 - a) * (1 - Math.exp(-dry * dt));
        r += (maxR * 1.1 - r) * (1 - Math.exp(-0.4 * dt));       // 乾きながら少しだけ広がる
      }
      apply();
      if (active || a > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        last = 0;
        target.classList.remove("is-wet");
      }
    }

    return {
      // マウス位置（はみ出したら要素の中に寄せる）
      point(clientX, clientY) {
        const b = target.getBoundingClientRect();
        px = Math.max(0, Math.min(b.width, clientX - b.left));
        py = Math.max(0, Math.min(b.height, clientY - b.top));
      },
      // 新しい一滴：乾いていれば今の位置から小さく始める
      start(fresh) {
        if (!fxOn()) return;
        if (fresh || a < 0.05) { mx = px; my = py; r = 4; sag = 0; }
        active = true;
        target.classList.add("is-wet");
        if (!raf) raf = requestAnimationFrame(tick);
      },
      stop() { active = false; },
      // 中身の差し替え（モーダルで作品が変わったときなど）
      set(content) {
        active = false; a = 0; apply();
        target.classList.remove("is-wet");
        base.innerHTML = "";
        if (typeof content === "string") base.textContent = content;
        else base.appendChild(content);
        mirror();
      },
    };
  }

  /* ホバーでにじむ（opts.trigger を渡すと、その要素へのホバーでにじむ） */
  function bleedOnHover(target, opts = {}) {
    const ink = createWet(target, opts);
    const trigger = opts.trigger || target;
    trigger.addEventListener("pointerenter", (e) => { ink.point(e.clientX, e.clientY); ink.start(false); });
    trigger.addEventListener("pointermove", (e) => ink.point(e.clientX, e.clientY));
    trigger.addEventListener("pointerleave", () => ink.stop());
    trigger.addEventListener("focus", () => {
      // キーボード操作のときだけ（モーダルを開いた瞬間の自動フォーカスではにじませない）
      if (!trigger.matches(":focus-visible")) return;
      const b = target.getBoundingClientRect();
      ink.point(b.left + b.width / 2, b.top + b.height / 2);
      ink.start(true);
    });
    trigger.addEventListener("blur", () => ink.stop());
    return ink;
  }

  /* マウスを止めるとにじみ、動かすと乾く（文章など） */
  function bleedOnDwell(target, opts = {}) {
    const wait = opts.wait || 750;     // 止まってからにじみ始めるまで（ms）
    const ink = createWet(target, { radius: 70, grow: 0.7, follow: 1.2, dry: 1.4, ...opts, block: true });
    let timer = 0;
    let sx = 0, sy = 0;                // にじみ始めた位置

    target.addEventListener("pointermove", (e) => {
      ink.point(e.clientX, e.clientY);
      // 大きく動いたら乾かす
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) ink.stop();
      clearTimeout(timer);
      timer = setTimeout(() => {
        sx = e.clientX; sy = e.clientY;
        ink.start(true);
      }, wait);
    });
    target.addEventListener("pointerleave", () => { clearTimeout(timer); ink.stop(); });
    return ink;
  }

  window.Ink = { bleedOnHover, bleedOnDwell };
})();
