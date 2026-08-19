/* ==========================================================================
   HERMES Mini App — app.js
   Procedural Artworks, Dark Card Carousel & Multi-Font Integration
   ========================================================================== */

(() => {
  "use strict";

  const viewEl = document.getElementById("view");
  const crumbEl = document.getElementById("topbar-crumb");
  const backBtn = document.getElementById("topbar-back");

  const cache = new Map();
  const artworkCache = new Map();

  /* ------------------------------------------------------------------ *
   * Procedural Artwork Engine
   * ------------------------------------------------------------------ */

  function generateArtwork(slug) {
    if (artworkCache.has(slug)) return artworkCache.get(slug);

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#07070a";
    ctx.fillRect(0, 0, 400, 560);

    if (slug === "world-poetry") {
      const g = ctx.createRadialGradient(260, 160, 20, 200, 240, 320);
      g.addColorStop(0, "rgba(201, 179, 126, 0.45)");
      g.addColorStop(0.5, "rgba(24, 24, 32, 0.85)");
      g.addColorStop(1, "rgba(7, 7, 10, 0.98)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 400, 560);

      ctx.strokeStyle = "rgba(201, 179, 126, 0.25)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(200, 180, 40 + i * 22, 0.2 * Math.PI, 1.1 * Math.PI);
        ctx.stroke();
      }
    } else if (slug === "literary-news") {
      const g = ctx.createLinearGradient(0, 0, 400, 560);
      g.addColorStop(0, "rgba(35, 35, 45, 0.9)");
      g.addColorStop(0.6, "rgba(14, 14, 20, 0.95)");
      g.addColorStop(1, "rgba(7, 7, 10, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 400, 560);

      ctx.fillStyle = "rgba(233, 230, 221, 0.04)";
      for (let y = 60; y < 480; y += 18) {
        const w = (y % 36 === 0) ? 280 : 340;
        ctx.fillRect(30, y, w, 6);
      }
      ctx.strokeStyle = "rgba(201, 179, 126, 0.35)";
      ctx.strokeRect(30, 50, 340, 1);
    } else if (slug === "painting") {
      const g = ctx.createRadialGradient(200, 220, 10, 200, 220, 280);
      g.addColorStop(0, "rgba(201, 179, 126, 0.4)");
      g.addColorStop(0.4, "rgba(30, 24, 18, 0.7)");
      g.addColorStop(1, "rgba(7, 7, 10, 0.98)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 400, 560);

      ctx.strokeStyle = "rgba(201, 179, 126, 0.3)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(60, 60, 280, 380);
      ctx.strokeStyle = "rgba(233, 230, 221, 0.1)";
      ctx.strokeRect(85, 85, 230, 330);
      ctx.beginPath();
      ctx.arc(200, 250, 70, 0, Math.PI * 2);
      ctx.stroke();
    } else if (slug === "persian-literature") {
      const g = ctx.createRadialGradient(200, 240, 20, 200, 240, 260);
      g.addColorStop(0, "rgba(201, 179, 126, 0.35)");
      g.addColorStop(0.6, "rgba(18, 16, 22, 0.85)");
      g.addColorStop(1, "rgba(7, 7, 10, 0.98)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 400, 560);

      ctx.strokeStyle = "rgba(201, 179, 126, 0.25)";
      ctx.lineWidth = 1.2;
      for (let r = 30; r <= 150; r += 30) {
        ctx.beginPath();
        ctx.arc(200, 240, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(200, 70); ctx.lineTo(340, 240); ctx.lineTo(200, 410); ctx.lineTo(60, 240); ctx.closePath();
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 400;
      const ry = Math.random() * 560;
      ctx.fillRect(rx, ry, 1, 1);
    }

    const dataUrl = canvas.toDataURL("image/png");
    artworkCache.set(slug, dataUrl);
    return dataUrl;
  }

  const REALM_CONFIG = {
    "world-poetry": {
      sub: "VOICES OF THE WORLD",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`
    },
    "literary-news": {
      sub: "DISPATCHES & ESSAYS",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
    },
    "painting": {
      sub: "VISUAL ARCHIVE",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
    },
    "persian-literature": {
      sub: "CLASSICAL MANUSCRIPTS",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    }
  };

  /* ------------------------------------------------------------------ *
   * Data Loading
   * ------------------------------------------------------------------ */

  async function fetchJSON(path) {
    if (cache.has(path)) return cache.get(path);
    // Use no-cache to avoid aggressive locking on empty payloads in Telegram Desktop
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load " + path);
    const json = await res.json();
    cache.set(path, json);
    return json;
  }

  async function getManifest() {
    return fetchJSON("data/manifest.json");
  }

  async function getCategoryData(slug) {
    const manifest = await getManifest();
    const cat = manifest.categories.find((c) => c.slug === slug);
    if (!cat) throw new Error("Unknown category: " + slug);
    const data = await fetchJSON(cat.source);
    return { cat, data };
  }

  /* ------------------------------------------------------------------ *
   * DOM Helpers
   * ------------------------------------------------------------------ */

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, "");
      else if (v !== false && v != null) node.setAttribute(k, v);
    }
    for (const child of [].concat(children)) {
      if (child == null) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function clearView() {
    viewEl.innerHTML = "";
  }

  function mount(node) {
    clearView();
    node.classList.add("view-enter");
    viewEl.appendChild(node);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function setChrome({ crumb = "", showBack = false }) {
    crumbEl.textContent = crumb;
    backBtn.classList.toggle("is-visible", showBack);
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    } catch { return iso.slice(0, 10); }
  }

  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const img = entry.target;
              loadImage(img);
              observer.unobserve(img);
            });
          },
          { rootMargin: "120px 0px" }
        )
      : null;

  function loadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;
    const real = new Image();
    real.onload = () => {
      img.src = src;
      img.classList.add("is-loaded");
    };
    real.onerror = () => {
      const fallback = el("div", { class: "img-fallback font-geist" }, img.getAttribute("data-label") || "HERMES");
      img.replaceWith(fallback);
    };
    real.src = src;
  }

  function lazyImg(src, alt, label) {
    if (!src) {
      return el("div", { class: "img-fallback font-geist" }, label || "HERMES");
    }
    const img = el("img", {
      "data-src": src,
      "data-label": label || "HERMES",
      alt: alt || "",
      loading: "lazy",
    });
    if (io) io.observe(img);
    else loadImage(img);
    return img;
  }

  function renderState(title, body) {
    mount(
      el("div", { class: "state-message font-niloofar" }, [
        el("div", { class: "state-message__title" }, title),
        el("div", {}, body),
      ])
    );
  }

  /* ------------------------------------------------------------------ *
   * View: Home (Pure Image-Led Carousel)
   * ------------------------------------------------------------------ */

  async function renderHome() {
    setChrome({ crumb: "", showBack: false });
    try {
      const manifest = await getManifest();

      const cards = manifest.categories.map((cat, i) => {
        const config = REALM_CONFIG[cat.slug] || { sub: "ARCHIVE", icon: "" };
        const artworkUrl = generateArtwork(cat.slug);

        return el(
          "div",
          {
            class: `showcase-card ${i === 0 ? "is-active" : ""}`,
            onclick: () => Router.navigate(`/c/${cat.slug}`),
            tabindex: "0",
            "aria-label": `${cat.title_fa} — ${cat.title_en}`,
          },
          [
            el("div", {
              class: "showcase-card__image",
              style: `background-image: url('${artworkUrl}')`
            }),
            el("div", { class: "showcase-card__scrim" }),
            el("div", { class: "showcase-card__badge" }, [
              el("div", { class: "showcase-card__badge-icon", html: config.icon }),
              el("span", { class: "showcase-card__badge-sub font-geist" }, config.sub),
            ]),
            el("div", { class: "showcase-card__bottom" }, [
              el("div", { class: "showcase-card__latin-tag font-kenfolg" }, cat.title_en),
              el("h2", { class: "showcase-card__fa-title font-niloofar-bold" }, cat.title_fa),
              el("div", { class: "showcase-card__footer" }, [
                el("span", { class: "showcase-card__cta font-niloofar" }, [
                  "ورود به مجموعه ",
                  el("span", { class: "showcase-card__cta-arrow" }, "←"),
                ]),
                el("span", { class: "showcase-card__num font-geist" }, `0${i + 1}`),
              ]),
            ]),
          ]
        );
      });

      const dots = manifest.categories.map((_, i) =>
        el("div", { class: `carousel-pill ${i === 0 ? "is-active" : ""}` })
      );

      const track = el("div", { class: "showcase-track" }, cards);
      const pagination = el("div", { class: "showcase-pagination" }, dots);

      track.addEventListener("scroll", () => {
        const scrollLeft = Math.abs(track.scrollLeft);
        const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 20 : 330;
        const activeIndex = Math.min(
          manifest.categories.length - 1,
          Math.max(0, Math.round(scrollLeft / cardWidth))
        );

        dots.forEach((d, idx) => d.classList.toggle("is-active", idx === activeIndex));
        cards.forEach((c, idx) => c.classList.toggle("is-active", idx === activeIndex));
      }, { passive: true });

      const wrap = el("div", { class: "home-stage" }, [
        el("header", { class: "stage-header" }, [
          el("span", { class: "stage-header__eyebrow font-geist" }, "EST. 2026 · ISSUE NO. 1"),
          el("h1", { class: "stage-header__logo latin" }, "HERMES"),
          el("div", { class: "stage-header__sub font-niloofar" }, "مجلهٔ ادبیات، اندیشه و هنرهای دیداری"),
        ]),
        el("div", { class: "showcase-wrapper" }, [track, pagination]),
        el("footer", { class: "stage-footer font-geist" }, "HERMES LITERARY & ART JOURNAL"),
      ]);

      mount(wrap);
    } catch (err) {
      renderState("خطا در بارگذاری", "لطفاً دوباره تلاش کنید.");
    }
  }

  /* ------------------------------------------------------------------ *
   * Category Views
   * ------------------------------------------------------------------ */

  async function renderCategory(slug) {
    try {
      const { cat, data } = await getCategoryData(slug);
      setChrome({ crumb: cat.title_fa, showBack: true });

      if (slug === "world-poetry") return renderWorldPoetryList(cat, data);
      if (slug === "painting") return renderPaintingList(cat, data);
      if (slug === "persian-literature") return renderPersianList(cat, data);
      if (slug === "literary-news") return renderNewsList(cat, data);

      renderState("بخش یافت نشد", "");
    } catch (err) {
      renderState("این بخش در دسترس نیست", "");
    }
  }

  function renderWorldPoetryList(cat, data) {
    const authors = data.authors || [];
    const header = el("div", { class: "list-header" }, [
      el("div", { class: "list-header__title-en latin" }, cat.title_en),
      el("div", { class: "list-header__title-fa font-niloofar-bold" }, cat.title_fa),
    ]);

    const list = el("div", { class: "author-list" });
    authors.forEach((author) => {
      const bio = author.name_fa ? el("div", { class: "author-card__bio font-niloofar" }, author.name_fa) : null;
      list.appendChild(
        el("button", {
          class: "author-card",
          onclick: () => Router.navigate(`/i/world-poetry/${encodeURIComponent(author.name)}`),
        }, [
          el("div", { class: "author-card__name latin" }, author.name),
          bio,
          el("div", { class: "author-card__count font-geist" }, `${author.poem_count} POEMS`),
        ])
      );
    });

    mount(el("div", {}, [header, list]));
  }

  async function renderWorldPoetryDetail(cat, authorName) {
    try {
      const { data } = await getCategoryData("world-poetry");
      const author = (data.authors || []).find((a) => a.name === authorName);
      if (!author) return renderState("یافت نشد", "");

      setChrome({ crumb: author.name, showBack: true });

      const profile = el("div", { class: "profile" }, [
        el("div", { class: "profile__name-en latin" }, author.name),
        author.name_fa ? el("div", { class: "profile__name-fa font-niloofar" }, author.name_fa) : null,
        el("div", { class: "profile__meta font-geist" }, `${author.poem_count} PUBLISHED WORKS`),
      ]);

      const poems = author.poems || [];
      const poemList = el("div", { class: "poem-list" }, [
        el("div", { class: "poem-list__label font-geist" }, "ARCHIVE POEMS"),
        ...poems.map((poem) =>
          el("button", {
            class: "poem-list__item",
            onclick: () => openPostLink(poem.telegraph_url, poem.post_id),
          }, [
            el("span", { class: "latin" }, poem.title),
            poem.title_original ? el("span", { class: "poem-list__item-title-fa font-niloofar" }, poem.title_original) : null,
            el("span", { class: "poem-list__item-date font-ui" }, formatDate(poem.published)),
          ])
        ),
      ]);

      mount(el("div", {}, [profile, poemList]));
    } catch (err) {
      renderState("خطا در بارگذاری", "");
    }
  }

  function renderPaintingList(cat, data) {
    const artists = data.artists || [];
    const header = el("div", { class: "list-header" }, [
      el("div", { class: "list-header__title-en latin" }, cat.title_en),
      el("div", { class: "list-header__title-fa font-niloofar-bold" }, cat.title_fa),
    ]);

    const list = el("div", { class: "item-list item-list--wide" });
    artists.forEach((artist) => {
      artist.paintings.forEach((painting) => {
        const meta = [painting.year, painting.movement, painting.museum].filter(Boolean).join(" · ");
        list.appendChild(
          el("button", {
            class: "item-card",
            onclick: () => Router.navigate(`/i/painting/${encodeURIComponent(artist.name)}/${encodeURIComponent(painting.id)}`),
          }, [
            el("div", { class: "item-card__media" }, lazyImg(painting.image_url, painting.title, cat.title_en)),
            el("div", { class: "item-card__body" }, [
              el("div", { class: "item-card__title font-niloofar" }, painting.title),
              el("div", { class: "item-card__meta latin" }, painting.artist),
              meta ? el("div", { class: "item-card__meta font-geist" }, meta) : null,
            ]),
          ])
        );
      });
    });

    mount(el("div", {}, [header, list]));
  }

  async function renderPaintingDetail(cat, artistName, paintingId) {
    try {
      const { data } = await getCategoryData("painting");
      const artist = (data.artists || []).find((a) => a.name === artistName);
      const painting = artist ? artist.paintings.find((p) => p.id === paintingId) : null;
      if (!painting) return renderState("یافت نشد", "");

      setChrome({ crumb: painting.artist, showBack: true });

      const meta = [painting.year, painting.medium, painting.country, painting.museum].filter(Boolean).join(" · ");

      const detail = el("div", { class: "detail-page" }, [
        el("div", { class: "detail-page__eyebrow latin" }, "GALLERY ARCHIVE"),
        el("h1", { class: "detail-page__title font-niloofar" }, painting.title),
        el("div", { class: "detail-page__meta latin" }, painting.artist),
        meta ? el("div", { class: "detail-page__meta font-geist" }, meta) : null,
        painting.image_url ? el("div", { class: "detail-page__media" }, lazyImg(painting.image_url, painting.title, "Painting")) : null,
        painting.original_url ? el("div", { class: "detail-page__link" }, [
          el("button", {
            class: "detail-page__link-btn font-geist",
            onclick: () => openPostLink(painting.original_url, painting.post_id),
          }, "VIEW ORIGINAL WORK →"),
        ]) : null,
      ]);

      mount(detail);
    } catch (err) {
      renderState("خطا در بارگذاری", "");
    }
  }

  /* --- Persian Literature (authors → detail, mirrors World Poetry) --- */
  function renderPersianList(cat, data) {
    const authors = data.authors || [];
    const header = el("div", { class: "list-header" }, [
      el("div", { class: "list-header__title-en latin" }, cat.title_en),
      el("div", { class: "list-header__title-fa font-niloofar-bold" }, cat.title_fa),
    ]);

    const list = el("div", { class: "author-list" });
    authors.forEach((author) => {
      list.appendChild(
        el("button", {
          class: "author-card",
          onclick: () => Router.navigate(`/i/persian-literature/${encodeURIComponent(author.name)}`),
        }, [
          el("div", { class: "author-card__name font-niloofar-bold" }, author.name),
          el("div", { class: "author-card__count font-geist" }, `${author.item_count} WORKS`),
        ])
      );
    });

    mount(el("div", {}, [header, list]));
  }

  async function renderPersianDetail(cat, authorName) {
    try {
      const { data } = await getCategoryData("persian-literature");
      const decoded = decodeURIComponent(authorName);
      const author = (data.authors || []).find((a) => a.name === decoded);
      if (!author) return renderState("یافت نشد", "");

      setChrome({ crumb: author.name, showBack: true });

      const profile = el("div", { class: "profile" }, [
        el("div", { class: "profile__name-en font-niloofar-bold" }, author.name),
        el("div", { class: "profile__meta font-geist" }, `${author.item_count} PUBLISHED WORKS`),
      ]);

      const items = author.items || [];
      const itemList = el("div", { class: "poem-list" }, [
        el("div", { class: "poem-list__label font-geist" }, "PUBLISHED WORKS"),
        ...items.map((item) =>
          el("button", {
            class: "poem-list__item font-niloofar",
            onclick: () => openPostLink(
              item.telegraph_url || item.original_url,
              item.post_id
            ),
          }, [
            el("span", {}, item.title),
            item.book ? el("span", { class: "poem-list__item-title-fa font-ui" }, item.book) : null,
            el("span", { class: "poem-list__item-date font-ui" }, formatDate(item.published)),
          ])
        ),
      ]);

      mount(el("div", {}, [profile, itemList]));
    } catch (err) {
      renderState("خطا در بارگذاری", "");
    }
  }

  function renderNewsList(cat, data) {
    const items = data.items || [];
    const header = el("div", { class: "list-header" }, [
      el("div", { class: "list-header__title-en latin" }, cat.title_en),
      el("div", { class: "list-header__title-fa font-niloofar-bold" }, cat.title_fa),
    ]);

    const list = el("div", { class: "news-list" });
    items.forEach((item) => {
      const card = el("button", {
        class: "news-card",
        onclick: () => openPostLink(item.original_url, item.post_id),
      }, [
        el("div", { class: "news-card__source font-kenfolg" }, item.source),
        el("div", { class: "news-card__title font-ui" }, item.title),
        el("div", { class: "news-card__date font-ui" }, formatDate(item.published)),
      ]);
      list.appendChild(card);
    });

    mount(el("div", {}, [header, list]));
  }

  /* ------------------------------------------------------------------ *
   * Telegram deep links — every item opens inside Telegram
   * ------------------------------------------------------------------ */

  const TELEGRAM_CHANNEL = "https://t.me/Hermesmag";

  function tg() {
    try {
      return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    } catch (e) {
      return null;
    }
  }

  function openPostLink(link, postId) {
    const id = postId ? String(postId).trim() : "";
    const channel = id ? TELEGRAM_CHANNEL + "/" + id : null;

    // Channel post link: first-class, always stays inside Telegram.
    if (channel) {
      const api = tg();
      if (api && typeof api.openTelegramLink === "function") {
        try {
          api.openTelegramLink(channel);
          return;
        } catch (e) { /* fall through */ }
      }
      window.location.href = channel;
      return;
    }

    // Editorial link (Telegraph post etc.): keep inside the app too.
    if (link) {
      try {
        new URL(link);
      } catch (e) {
        return;
      }
      const api = tg();
      if (api && typeof api.openLink === "function") {
        try {
          api.openLink(link);
          return;
        } catch (e) { /* fall through */ }
      }
      window.open(link, "_blank", "noopener");
    }
  }

  /* ------------------------------------------------------------------ *
   * Router & Boot
   * ------------------------------------------------------------------ */

  function handleRoute(route) {
    switch (route.name) {
      case "category":
        renderCategory(route.params.slug);
        break;
      case "item":
        handleItemRoute(route.params.slug, route.params.id);
        break;
      default:
        renderHome();
    }
  }

  function handleItemRoute(slug, id) {
    if (slug === "world-poetry") return renderWorldPoetryDetail(null, decodeURIComponent(id));
    if (slug === "painting") {
      const parts = id.split("/");
      if (parts.length >= 2) {
        return renderPaintingDetail(null, decodeURIComponent(parts[0]), decodeURIComponent(parts[1]));
      }
    }
    if (slug === "persian-literature") return renderPersianDetail(null, decodeURIComponent(id));
    if (slug === "literary-news") {
      window.location.hash = "#/c/literary-news";
    }
  }

  backBtn.addEventListener("click", () => Router.back());

  function initTelegramIfPresent() {
    try {
      const tg = window.Telegram && window.Telegram.WebApp;
      if (!tg) return;
      tg.ready();
      tg.expand();
    } catch (e) {}
  }

  function boot() {
    initTelegramIfPresent();
    Router.init(handleRoute);
  }

  Intro.run(boot);
})();