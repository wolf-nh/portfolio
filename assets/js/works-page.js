/* works：カテゴリのタブ切り替えと、印画紙のグリッド */
(function () {
  const SITE = window.SITE || {};
  const WORKS = window.WORKS || [];
  const Site = window.Site;

  const tabsEl = document.getElementById("works-tabs");
  const grid = document.getElementById("works-grid");

  // 新しい年から。同じ年は works.js の順（"2019-2026" のような期間は新しいほうの年で比べる）
  const latestYear = (w) => Math.max(0, ...(String(w.year || "").match(/\d{4}/g) || []).map(Number));
  const byYear = (list) => list
    .map((w, i) => ({ w, i }))
    .sort((a, b) => latestYear(b.w) - latestYear(a.w) || a.i - b.i)
    .map((x) => x.w);

  const groups = (SITE.workGroups || []).filter((g) => WORKS.some((w) => w.group === g));
  const tabs = [
    { id: "all", label: "All", items: byYear(WORKS) },
    ...groups.map((g) => ({ id: g.toLowerCase(), label: g, items: byYear(WORKS.filter((w) => w.group === g)) })),
  ];

  /* ---------- タブ ---------- */
  const buttons = tabs.map((tab) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tabs__btn";
    b.id = `tab-${tab.id}`;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "works-grid");
    b.innerHTML = `<span class="tabs__label"></span><span class="tabs__count">${Site.pad(tab.items.length)}</span>`;
    b.querySelector(".tabs__label").textContent = tab.label;
    b.addEventListener("click", () => select(tab.id));
    if (window.Ink) window.Ink.bleedOnHover(b.querySelector(".tabs__label"), { trigger: b, radius: 40 });
    tabsEl.appendChild(b);
    return b;
  });

  // 下線：選択中のタブの下にあり、ホバーしたタブへ左右になめらかに移動する
  const line = document.createElement("span");
  line.className = "tabs__line";
  line.setAttribute("aria-hidden", "true");
  tabsEl.appendChild(line);
  let current = buttons[0];
  function moveLine(btn, instant) {
    if (!btn) return;
    if (instant) line.style.transition = "none";
    line.style.setProperty("--x", `${btn.offsetLeft}px`);
    line.style.setProperty("--w", `${btn.offsetWidth}px`);
    if (instant) { void line.offsetWidth; line.style.transition = ""; }
  }
  buttons.forEach((b) => b.addEventListener("pointerenter", () => moveLine(b)));
  tabsEl.addEventListener("pointerleave", () => moveLine(current));
  window.addEventListener("resize", () => moveLine(current, true));
  if (document.fonts) document.fonts.ready.then(() => moveLine(current, true));

  // ← → キーでタブを移動
  tabsEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const now = buttons.indexOf(document.activeElement);
    if (now < 0) return;
    const next = (now + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
    select(tabs[next].id);
  });

  /* ---------- グリッド：画面に入った印画紙から浮かび上がる ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 })
    : null;

  function render(tab) {
    grid.innerHTML = "";
    grid.setAttribute("aria-labelledby", `tab-${tab.id}`);
    tab.items.forEach((work, i) => {
      const li = document.createElement("li");
      li.className = "card";
      li.style.setProperty("--i", i % 3);
      li.style.setProperty("--focus", work.focus || "center");
      li.innerHTML = `
        <button type="button" class="card__btn">
          <span class="card__paper"><span class="card__window"><img alt="" loading="lazy" src="${work.images[0]}"></span></span>
          <span class="card__caption">
            <span class="card__title"></span>
            <span class="card__meta"><span class="card__year">${work.year || ""}</span><span class="card__cat"></span></span>
          </span>
        </button>`;
      li.querySelector(".card__title").textContent = work.title;
      li.querySelector(".card__cat").textContent = work.category || "";
      const btn = li.querySelector(".card__btn");
      btn.setAttribute("aria-label", `${work.title} の詳細を見る`);
      btn.addEventListener("click", () => Site.openWork(work));
      // 作品にホバーすると、タイトルがにじむ
      if (window.Ink) window.Ink.bleedOnHover(li.querySelector(".card__title"), { trigger: btn, block: true, radius: 60 });
      grid.appendChild(li);
      if (io) io.observe(li);
      else li.classList.add("is-in");
    });
  }

  function select(id) {
    const tab = tabs.find((t) => t.id === id) || tabs[0];
    buttons.forEach((b, i) => {
      const on = tabs[i] === tab;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) current = b;
    });
    moveLine(current, !line.style.getPropertyValue("--w"));
    render(tab);
    history.replaceState(null, "", tab.id === "all" ? location.pathname : `#${tab.id}`);
  }

  select(location.hash.slice(1));
})();
