/* ==========================================================================
   HERMES Mini App — router.js
   Minimal hash-based router. No framework, no page reloads.

   Supported route shapes:
     #/                                    -> home
     #/c/<category-slug>                   -> category list view
     #/i/<category-slug>/<id>              -> item detail
     #/i/<category-slug>/<artist>/<painting-id> -> painting detail (2-segment id)
   ========================================================================== */

const Router = (() => {
  let currentHandler = null;
  const historyStack = [];

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    if (!raw) return { name: "home", params: {} };

    const parts = raw.split("/").filter(Boolean);
    const [kind, ...rest] = parts;

    if (kind === "c" && rest[0]) {
      return { name: "category", params: { slug: rest[0] } };
    }
    if (kind === "i" && rest[0] && rest[1]) {
      // For painting: /i/painting/<artist>/<paintingId>
      // For others: /i/<slug>/<id>
      if (rest[0] === "painting" && rest[2]) {
        return {
          name: "item",
          params: {
            slug: rest[0],
            id: rest.slice(1).join("/"),  // artist/paintingId
          },
        };
      }
      return { name: "item", params: { slug: rest[0], id: rest[1] } };
    }
    return { name: "home", params: {} };
  }

  function handleChange() {
    const route = parseHash();
    historyStack.push(route);
    if (currentHandler) currentHandler(route);
  }

  function navigate(path) {
    window.location.hash = path;
  }

  function replace(path) {
    const url = window.location.pathname + window.location.search + "#" + path.replace(/^#/, "");
    window.history.replaceState(null, "", url);
    handleChange();
  }

  function back() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  }

  function init(handler) {
    currentHandler = handler;
    window.addEventListener("hashchange", handleChange);
    handleChange();
  }

  function current() {
    return parseHash();
  }

  return { init, navigate, replace, back, current };
})();
