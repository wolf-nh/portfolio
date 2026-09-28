/* 全ページ共通：テキストの差し込み、エフェクト切り替え、作品詳細モーダル、ヘッダーのにじみ */
(function () {
  const SITE = window.SITE || {};
  const root = document.documentElement;

  const pad = (n) => String(n).padStart(2, "0");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- モーダルの枠（各ページに共通で差し込む） ---------- */
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="sheet" id="work-modal" aria-labelledby="work-title">
      <div class="sheet__paper">
        <button type="button" class="sheet__close" data-close aria-label="閉じる"><span class="sheet__close-x" aria-hidden="true"></span></button>
        <div class="sheet__media">
          <div class="sheet__frame"><img id="work-image" alt=""></div>
          <div class="sheet__thumbs" id="work-thumbs"></div>
        </div>
        <div class="sheet__body">
          <p class="sheet__meta"><span id="work-cat"></span><span id="work-year"></span></p>
          <h2 class="sheet__title" id="work-title"></h2>
          <p class="sheet__lead" id="work-lead"></p>
          <div class="sheet__text" id="work-text"></div>
          <a class="sheet__link" id="work-link" href="#" target="_blank" rel="noopener"><span class="sheet__link-box">Visit site</span><span class="visually-hidden">（新しいタブで開きます）</span></a>
        </div>
      </div>
    </dialog>`);

  /* ---------- 共通テキスト ---------- */
  document.querySelectorAll('[data-bind="name"]').forEach((el) => (el.textContent = SITE.name || ""));
  document.querySelectorAll('[data-bind="role"]').forEach((el) => (el.textContent = SITE.role || ""));

  /* ---------- エフェクト ON / OFF ---------- */
  const fxSwitch = document.getElementById("fx-switch");
  const isOn = () => root.classList.contains("fx-on");

  function applyEffect(on) {
    root.classList.toggle("fx-on", on);
    root.classList.toggle("fx-off", !on);
    if (fxSwitch) {
      fxSwitch.setAttribute("aria-pressed", String(on));
      fxSwitch.setAttribute("aria-label", `エフェクト ${on ? "ON" : "OFF"}`);
    }
  }

  if (fxSwitch) {
    fxSwitch.addEventListener("click", () => {
      const on = !isOn();
      store.set("hn-effect", on ? "1" : "0");
      // ページ独自の切り替え（TOPの移動演出など）があればそちらに任せる
      if (Site.onToggle) {
        Site.onToggle(on);
      } else {
        applyEffect(on);
        if (window.Water) window.Water.setRunning(on);
      }
    });
  }
  applyEffect(isOn());
  if (window.Water) window.Water.setRunning(isOn());

  /* ---------- 作品詳細モーダル ---------- */
  const workModal = document.getElementById("work-modal");
  const workImage = document.getElementById("work-image");
  const workThumbs = document.getElementById("work-thumbs");

  function showImage(src, alt) {
    workImage.src = src;
    workImage.alt = alt;
    workThumbs.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-current", String(b.dataset.src === src))
    );
  }

  // マウスを止めると、文字のインクがにじむ
  const titleEl = document.getElementById("work-title");
  const textEl = document.getElementById("work-text");
  const inkTitle = window.Ink ? window.Ink.bleedOnDwell(titleEl, { radius: 56 }) : null;
  const inkText = window.Ink ? window.Ink.bleedOnDwell(textEl) : null;

  function openWork(work) {
    document.getElementById("work-cat").textContent = work.category || "";
    document.getElementById("work-year").textContent = work.year || "";

    if (inkTitle) inkTitle.set(work.title);
    else titleEl.textContent = work.title;
    const lead = document.getElementById("work-lead");
    lead.textContent = work.lead || "";
    lead.hidden = !work.lead;

    const frag = document.createDocumentFragment();
    (work.text || "").split(/\n{2,}/).forEach((para) => {
      const p = document.createElement("p");
      para.split("\n").forEach((line, i) => {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(line));
      });
      frag.appendChild(p);
    });
    if (inkText) inkText.set(frag);
    else { textEl.innerHTML = ""; textEl.appendChild(frag); }

    const link = document.getElementById("work-link");
    link.hidden = !work.link;
    link.href = work.link || "#";

    const images = work.images || [];
    workThumbs.innerHTML = "";
    if (images.length > 1) {
      images.forEach((src, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.src = src;
        b.setAttribute("aria-label", `画像 ${i + 1}`);
        b.innerHTML = `<img alt="" src="${src}">`;
        b.addEventListener("click", () => showImage(src, work.title));
        workThumbs.appendChild(b);
      });
    }
    showImage(images[0] || "", work.title);
    workModal.showModal();
  }

  /* ---------- モーダル共通：閉じる ---------- */
  document.querySelectorAll(".sheet").forEach((dlg) => {
    dlg.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dlg.close()));
    // 紙の外（背景）をクリックで閉じる
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  });

  /* ---------- ヘッダーのにじみ ---------- */
  if (window.Ink) {
    // ヘッダーの名前とページリンク
    const name = document.querySelector(".site-name");
    if (name) window.Ink.bleedOnHover(name);
    document.querySelectorAll(".site-nav a").forEach((el) => window.Ink.bleedOnHover(el));
    // モーダルのボタン：文字だけでなく枠線や × の線もにじむ
    const link = document.querySelector("#work-modal .sheet__link");
    window.Ink.bleedOnHover(link.querySelector(".sheet__link-box"), { trigger: link, radius: 34 });
    const close = document.querySelector("#work-modal .sheet__close");
    window.Ink.bleedOnHover(close.querySelector(".sheet__close-x"), { trigger: close, radius: 30 });
  }

  const Site = { pad, store, applyEffect, openWork, onToggle: null };
  window.Site = Site;
})();
