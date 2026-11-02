(() => {
  const init = () => {
    const data = window.MEDIA_KIT;
    const metrics = window.MEDIA_KIT_METRICS;
    let lang =
      new URLSearchParams(location.search).get("lang") === "en" ? "en" : "es";
    let filter = "all";
    const track = document.getElementById("partner-track");
    const group = document.createElement("div");
    group.className = "partner-group";
    data.partners.forEach((partner) => {
      const item = document.createElement(partner.url ? "a" : "span");
      item.className = "partner";
      if (partner.url) {
        item.href = partner.url;
        item.target = "_blank";
        item.rel = "noopener";
      }
      if (partner.image) {
        const image = document.createElement("img");
        image.src = "assets/" + partner.image;
        image.alt = partner.wordmark ? partner.name : "";
        image.loading = "eager";
        if (partner.wordmark) item.classList.add("partner-wordmark");
        if (partner.dark) image.classList.add("logo-dark");
        item.append(image);
      } else if (partner.name === "rocket.new") {
        const symbol = document.createElement("span");
        symbol.className = "rocket-symbol";
        symbol.textContent = "↗";
        item.append(symbol);
      }
      if (!partner.wordmark) item.append(document.createTextNode(partner.name));
      group.append(item);
    });
    track.append(group);
    const copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    track.append(copy);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let paused = reducedMotion.matches,
      hovering = false,
      focused = false,
      dragging = false,
      position = 0,
      previousTime = 0;
    const pauseButton = document.getElementById("partner-pause");
    function updatePauseLabel() {
      pauseButton.textContent = paused ? "▶" : "Ⅱ";
      pauseButton.setAttribute(
        "aria-label",
        lang === "es"
          ? paused
            ? "Reanudar carrusel"
            : "Pausar carrusel"
          : paused
            ? "Resume carousel"
            : "Pause carousel",
      );
      pauseButton.setAttribute("aria-pressed", String(paused));
    }
    pauseButton.onclick = () => {
      paused = !paused;
      position = track.scrollLeft;
      updatePauseLabel();
    };
    track.addEventListener("mouseenter", () => {
      hovering = true;
    });
    track.addEventListener("mouseleave", () => {
      hovering = false;
      position = track.scrollLeft;
    });
    track.addEventListener("focusin", () => {
      focused = true;
    });
    track.addEventListener("focusout", (e) => {
      focused = track.contains(e.relatedTarget);
      position = track.scrollLeft;
    });
    track.addEventListener("pointerdown", () => {
      dragging = true;
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      position = track.scrollLeft;
    });
    document.getElementById("partner-prev").onclick = () => {
      const width = group.getBoundingClientRect().width;
      position = (track.scrollLeft - 350 + width) % width;
      track.scrollLeft = position;
    };
    document.getElementById("partner-next").onclick = () => {
      position = (track.scrollLeft + 350) % group.getBoundingClientRect().width;
      track.scrollLeft = position;
    };
    reducedMotion.addEventListener("change", (e) => {
      paused = e.matches;
      position = track.scrollLeft;
      updatePauseLabel();
    });
    function animate(time) {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const width = group.getBoundingClientRect().width;
      if (
        !paused &&
        !hovering &&
        !focused &&
        !dragging &&
        !document.hidden &&
        width > 0
      ) {
        position = (position + elapsed * 0.035) % width;
        track.scrollLeft = position;
      } else {
        position = track.scrollLeft;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    function renderVideos() {
      const grid = document.getElementById("videos");
      grid.replaceChildren();
      data.videos.forEach((video) => {
        const card = document.createElement("article");
        card.className = "video-card";
        card.hidden = filter !== "all" && video.category !== filter;
        const link = document.createElement("a");
        link.href = video.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "video-image";
        link.setAttribute(
          "aria-label",
          (lang === "es" ? "Ver video: " : "Watch video: ") + video.title[lang],
        );
        const image = document.createElement("img");
        image.src = "assets/" + video.image;
        image.alt = video.title[lang];
        image.loading = "lazy";
        link.append(image);
        const play = document.createElement("span");
        play.className = "play";
        play.textContent = "↗";
        play.setAttribute("aria-hidden", "true");
        link.append(play);
        const badge = document.createElement("span");
        badge.className = "video-badge";
        badge.textContent = video.views
          ? video.views + (lang === "es" ? " VISTAS" : " VIEWS")
          : video.date;
        link.append(badge);
        card.append(link);
        const meta = document.createElement("div");
        meta.className = "video-meta";
        [video.brand, video.platform].forEach((text) => {
          const span = document.createElement("span");
          span.textContent = text;
          meta.append(span);
        });
        card.append(meta);
        const h = document.createElement("h3");
        h.textContent = video.title[lang];
        card.append(h);
        const p = document.createElement("p");
        p.textContent = video.description[lang];
        card.append(p);
        const cta = document.createElement("a");
        cta.href = video.url;
        cta.target = "_blank";
        cta.rel = "noopener";
        cta.textContent = lang === "es" ? "Ver video ↗" : "Watch video ↗";
        card.append(cta);
        grid.append(card);
      });
    }
    const searchInput = document.getElementById("video-search");
    const brandSelect = document.getElementById("video-brand");
    const platformSelect = document.getElementById("video-platform");
    const moreButton = document.getElementById("library-more");
    const library = window.VIDEO_LIBRARY;
    let shown = 12;
    const normalize = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const allOption = document.createElement("option");
    allOption.value = "all";
    brandSelect.append(allOption);
    [...new Set(library.map((video) => video.brand))]
      .sort((a, b) => a.localeCompare(b))
      .forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandSelect.append(option);
      });
    function renderLibrary() {
      allOption.textContent = lang === "es" ? "Todas las marcas" : "All brands";
      platformSelect.options[0].textContent =
        lang === "es" ? "Todas las plataformas" : "All platforms";
      const query = normalize(searchInput.value.trim());
      const matches = library.filter(
        (video) =>
          (brandSelect.value === "all" || video.brand === brandSelect.value) &&
          (platformSelect.value === "all" ||
            video.platform === platformSelect.value) &&
          normalize(video.brand + " " + video.title).includes(query),
      );
      const container = document.getElementById("library-results");
      container.replaceChildren();
      matches.slice(0, shown).forEach((video) => {
        const row = document.createElement("a");
        row.className = "library-row";
        row.href = video.url;
        row.target = "_blank";
        row.rel = "noopener";
        const brand = document.createElement("span");
        brand.className = "library-brand";
        brand.textContent = video.brand;
        const title = document.createElement("strong");
        title.textContent = video.title;
        const info = document.createElement("span");
        info.className = "library-info";
        info.textContent = video.platform + " · " + video.date;
        const arrow = document.createElement("span");
        arrow.textContent = "↗";
        arrow.setAttribute("aria-hidden", "true");
        row.append(brand, title, info, arrow);
        container.append(row);
      });
      document.getElementById("library-count").textContent =
        lang === "es"
          ? Math.min(shown, matches.length) +
            " de " +
            matches.length +
            " publicaciones"
          : Math.min(shown, matches.length) +
            " of " +
            matches.length +
            " publications";
      if (!matches.length) {
        const empty = document.createElement("p");
        empty.className = "library-empty";
        empty.textContent =
          lang === "es"
            ? "No hay publicaciones con esos filtros."
            : "No publications match these filters.";
        container.append(empty);
      }
      moreButton.hidden = shown >= matches.length;
    }
    searchInput.oninput = () => {
      shown = 12;
      renderLibrary();
    };
    brandSelect.onchange = platformSelect.onchange = () => {
      shown = 12;
      renderLibrary();
    };
    moreButton.onclick = () => {
      shown += 12;
      renderLibrary();
    };
    function translate() {
      document.documentElement.lang = lang;
      updatePauseLabel();
      document.querySelectorAll("[data-es]").forEach((el) => {
        el.innerHTML = el.dataset[lang];
      });
      document
        .querySelectorAll("[data-lang]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.lang === lang),
          ),
        );
      const number = new Intl.NumberFormat(lang === "es" ? "es-MX" : "en-US");
      document.getElementById("ig-followers").textContent = number.format(
        metrics.instagram.followers,
      );
      document.getElementById("ig-views").textContent = number.format(
        metrics.instagram.views,
      );
      const caption = document.querySelector(".portrait-caption strong");
      caption.innerHTML =
        lang === "es"
          ? "El código es solo<br>el comienzo."
          : "Code is just<br>the beginning.";
      document
        .querySelector("nav")
        .setAttribute("aria-label", lang === "es" ? "Principal" : "Main");
      document
        .querySelector(".filters")
        .setAttribute(
          "aria-label",
          lang === "es" ? "Filtrar videos" : "Filter videos",
        );
      document
        .getElementById("partner-prev")
        .setAttribute(
          "aria-label",
          lang === "es" ? "Partners anteriores" : "Previous partners",
        );
      document
        .getElementById("partner-next")
        .setAttribute(
          "aria-label",
          lang === "es" ? "Siguientes partners" : "Next partners",
        );
      document.title =
        lang === "es"
          ? "Pamsho — Media Kit | Programación y tecnología"
          : "Pamsho — Media Kit | Programming & Technology";
      renderVideos();
      renderLibrary();
    }
    document.querySelectorAll("[data-lang]").forEach(
      (button) =>
        (button.onclick = () => {
          lang = button.dataset.lang;
          const url = new URL(location.href);
          url.searchParams.set("lang", lang);
          history.replaceState(null, "", url);
          translate();
        }),
    );
    document.querySelectorAll("[data-filter]").forEach(
      (button) =>
        (button.onclick = () => {
          filter = button.dataset.filter;
          document
            .querySelectorAll("[data-filter]")
            .forEach((b) =>
              b.setAttribute("aria-pressed", String(b === button)),
            );
          renderVideos();
        }),
    );
    translate();
  };
  window.addEventListener("media-kit-data-ready", init, { once: true });
})();
