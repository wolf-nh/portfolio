/* history：プロフィールと、経歴の年表（各時期の代表作サムネイル付き） */
(function () {
  const WORKS = window.WORKS || [];
  const HISTORY = window.HISTORY || [];
  const PROFILE = window.PROFILE || {};
  const Site = window.Site;
  const byId = Object.fromEntries(WORKS.map((w) => [w.id, w]));

  /* ---------- プロフィール ---------- */
  const text = document.getElementById("profile-text");
  (PROFILE.text || "").split("\n").forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    text.appendChild(p);
  });
  const facts = document.getElementById("profile-facts");
  (PROFILE.facts || []).forEach((f) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = f.label;
    dd.textContent = f.value;
    facts.append(dt, dd);
  });
  if (!facts.children.length) facts.remove();

  // プロフィールの文字：マウスを止めるとにじむ（sticky を保つため、中身を1つの箱にまとめてから）
  const profile = document.querySelector(".profile");
  const profileInner = document.createElement("div");
  profileInner.className = "profile__inner";
  while (profile.firstChild) profileInner.appendChild(profile.firstChild);
  profile.appendChild(profileInner);

  /* ---------- 年表 ---------- */
  const timeline = document.getElementById("timeline");
  HISTORY.forEach((item) => {
    const li = document.createElement("li");
    li.className = "event";
    li.innerHTML = `
      <p class="event__date"></p>
      <div class="event__body">
        <div class="event__text">
          <h2 class="event__title"></h2>
          <p class="event__note"></p>
        </div>
        <ul class="event__works"></ul>
      </div>`;
    li.querySelector(".event__date").textContent = item.date;
    li.querySelector(".event__title").textContent = item.title;
    const note = li.querySelector(".event__note");
    if (item.note) note.textContent = item.note;
    else note.remove();

    const list = li.querySelector(".event__works");
    const works = (item.works || []).map((id) => byId[id]).filter(Boolean);
    if (!works.length) list.remove();
    works.forEach((work, i) => {
      const w = document.createElement("li");
      w.className = "thumb";
      w.style.setProperty("--i", i % 6);
      w.style.setProperty("--focus", work.focus || "center");
      w.innerHTML = `
        <button type="button" class="thumb__btn">
          <span class="thumb__paper"><img alt="" loading="lazy" src="${work.images[0]}"></span>
        </button>`;
      const btn = w.querySelector("button");
      btn.setAttribute("aria-label", `${work.title}（${work.year}）の詳細を見る`);
      btn.title = work.title;
      btn.addEventListener("click", () => Site.openWork(work));
      list.appendChild(w);
    });
    timeline.appendChild(li);
    if (window.Ink) window.Ink.bleedOnDwell(li.querySelector(".event__text"), { radius: 56 });
  });
  if (window.Ink) window.Ink.bleedOnDwell(profileInner, { radius: 64 });

  /* ---------- 画面に入った項目から浮かび上がる ---------- */
  const events = [...timeline.children];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    events.forEach((el) => io.observe(el));
  } else {
    events.forEach((el) => el.classList.add("is-in"));
  }
})();
