/* 暗室の薬液：暗い液の中を煙のようなムラがゆっくり渦巻き、ときどき波紋が広がる */
(function () {
  const VERT = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision mediump float;
    uniform vec2  uRes;
    uniform float uTime;

    // ---- 色（暗いブルーグレー。ほぼモノクロの範囲で調整） ----
    const vec3 C_DEEP  = vec3(0.022, 0.029, 0.035);   // いちばん暗い所
    const vec3 C_MID   = vec3(0.150, 0.192, 0.210);   // 煙の本体
    const vec3 C_LIGHT = vec3(0.540, 0.660, 0.690);   // 光を受けた煙
    const float SPEED  = 0.045;                       // 流れる速さ

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                 mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    // オクターブごとに少し回転させて、筋が揃わないようにする
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.02 + vec2(11.3, 4.7);
        a *= 0.5;
      }
      return v;
    }

    // 滴が落ちたような、ゆっくり広がる波紋（座標をわずかに押し広げる）
    vec2 drops(vec2 p, float t, float aspect) {
      vec2 push = vec2(0.0);
      for (int k = 0; k < 2; k++) {
        float fk = float(k);
        float period = 14.0;
        float tt = t + fk * period * 0.5;
        float id = floor(tt / period);
        float age = mod(tt, period);
        vec2 c = vec2((0.15 + 0.7 * hash(vec2(id, fk * 3.1))) * aspect,
                      0.2 + 0.6 * hash(vec2(fk * 5.7, id)));
        vec2 d = p - c;
        float r = length(d);
        float x = r - age * 0.07;
        float ring = sin(x * 45.0) * exp(-x * x * 90.0) * exp(-age * 0.3) * smoothstep(0.0, 0.5, age);
        push += normalize(d + 1e-4) * ring * 0.012;
      }
      return push;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      float aspect = uRes.x / uRes.y;
      vec2 q = vec2(uv.x * aspect, uv.y);
      float t = uTime * SPEED;

      vec2 p = q * 2.2 + drops(q, uTime, aspect) * 2.2;

      // ドメインワーピング：ノイズで座標を2段階に歪ませ、煙のように渦を巻かせる
      vec2 w1 = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.6),
                     fbm(p + vec2(5.2, 1.3) - t * 0.4));
      vec2 w2 = vec2(fbm(p + 3.5 * w1 + vec2(1.7, 9.2) + t * 1.0),
                     fbm(p + 3.5 * w1 + vec2(8.3, 2.8) + t * 0.8));
      float f = fbm(p + 3.0 * w2);

      vec3 col = mix(C_DEEP, C_MID, clamp(f * f * 3.2, 0.0, 1.0));
      col = mix(col, C_DEEP, clamp(length(w1) * 0.5, 0.0, 1.0) * 0.45);
      col = mix(col, C_LIGHT, clamp(w2.x * w2.x * 1.5, 0.0, 1.0) * smoothstep(0.35, 0.9, f));

      // 中央（作品の奥）を少し明るく、周辺はしっかり落とす
      vec2 v = (uv - vec2(0.5, 0.48)) * vec2(1.0, 1.15);
      float len = length(v);
      col *= 0.82 + 0.5 * exp(-len * len * 3.0);
      col *= smoothstep(1.25, 0.15, len * 1.2);

      // フィルムの粒子
      col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 100.0) - 0.5) * 0.02;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function makeLayer(canvas, scale) {
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return null;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
    };

    function resize() {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    return {
      draw(time) {
        resize();
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  }

  // 霧とぼんやりした反射なので低解像度で十分
  const SCALE = 0.6;
  const enabled = !(window.SITE && window.SITE.waterBackground === false);
  const bg = document.getElementById("water-bg");
  if (bg && !enabled) bg.remove();
  let layer = bg && enabled ? makeLayer(bg, SCALE) : null;
  if (!layer) document.documentElement.classList.add("no-webgl");

  /* ---------- 白く光る対策 ----------
     Chrome / Firefox はページを離れるとき、次のページが出る前に WebGL の描画内容を捨てる。
     捨てられた canvas は真っ白に描かれるので、離れる瞬間と描画が失われた瞬間に canvas を隠し、
     後ろの暗い背景色だけが見えるようにする。 */
  function hideCanvas() { if (bg) bg.style.visibility = "hidden"; }
  function showCanvas() { if (bg) bg.style.visibility = ""; }
  if (bg) {
    bg.addEventListener("webglcontextlost", (e) => { e.preventDefault(); hideCanvas(); layer = null; });
    bg.addEventListener("webglcontextrestored", () => {
      layer = makeLayer(bg, SCALE);
      if (layer) { showCanvas(); kick(); }
    });
  }
  let leaveTimer = 0;
  function leaving() {
    hideCanvas();
    // メールリンクなどでページが切り替わらなかったときは元に戻す
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => { if (layer) { showCanvas(); kick(); } }, 1500);
  }
  window.addEventListener("beforeunload", leaving);
  window.addEventListener("pagehide", hideCanvas);
  window.addEventListener("pageshow", () => { clearTimeout(leaveTimer); if (layer) { showCanvas(); kick(); } });
  if (window.navigation) {
    // Chrome：リンクのクリック・戻る/進むなど、別ページへの移動が始まった瞬間に隠す
    window.navigation.addEventListener("navigate", (e) => {
      // works のタブ切り替え（#web など）のような、同じページ内の URL 変更では隠さない
      if (e.hashChange || e.downloadRequest || (e.destination && e.destination.sameDocument)) return;
      leaving();
    });
  }

  let running = false;
  let looping = false;
  // 最初から霧が程よく広がった状態で始める。ページを移動しても続きから流れるように時刻を引き継ぐ
  let clock = 20;
  try {
    const saved = parseFloat(sessionStorage.getItem("hn-water-t"));
    if (saved > 0) clock = saved;
  } catch (e) {}
  window.addEventListener("pagehide", () => {
    try { sessionStorage.setItem("hn-water-t", String(clock)); } catch (e) {}
  });
  let last = 0;

  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (running) clock += dt;
    if (layer) layer.draw(clock);
    if (running) {
      requestAnimationFrame(frame);
    } else {
      looping = false;
      last = 0;
    }
  }
  function kick() {
    if (looping) return;
    looping = true;
    requestAnimationFrame(frame);
  }

  window.Water = {
    setRunning(on) { running = on; kick(); },
    redraw: kick,
  };

  window.addEventListener("resize", kick);
})();
