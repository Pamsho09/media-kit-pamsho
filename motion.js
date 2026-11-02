const story = document.querySelector(".scroll-story");
const pin = document.querySelector(".story-sticky");
const scenes = [...document.querySelectorAll(".story-scene")];
const label = document.querySelector(".chapter-label");
let queued = false;
const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
function animateStory() {
  queued = false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = story.getBoundingClientRect();
  const progress = clamp(-rect.top / (story.offsetHeight - innerHeight));
  pin.style.setProperty("--progress", progress * 100 + "%");
  label.textContent = "0" + Math.min(4, Math.floor(progress * 4) + 1) + " / 04";
  const centers = [0.08, 0.35, 0.64, 0.92];
  scenes.forEach((el, i) => {
    const distance = progress - centers[i];
    const opacity = clamp(1 - Math.max(0, Math.abs(distance) - 0.07) / 0.11);
    el.style.opacity = opacity;
    el.setAttribute("aria-hidden", String(opacity < 0.1));
    el.inert = opacity < 0.1;
    el.style.transform =
      "translateY(" +
      -distance * 220 +
      "px) scale(" +
      (1 - Math.max(0, distance) * 0.14) +
      ")";
    el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
  });
  document
    .querySelectorAll(".viral-card")
    .forEach((card, i) =>
      card.style.setProperty(
        "--card-y",
        (progress - 0.64) * (i % 2 ? 500 : -700) + "px",
      ),
    );
  scenes[0].style.setProperty(
    "--orbit-shift",
    Math.max(0, progress - 0.13) * 400 + "px",
  );
}
addEventListener(
  "scroll",
  () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(animateStory);
    }
  },
  { passive: true },
);
addEventListener("resize", animateStory);
animateStory();

const portrait = document.querySelector(".visual");
let visualQueued = false;
function movePortrait() {
  visualQueued = false;
  if (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    innerWidth > 750
  )
    portrait.style.transform =
      "translateY(" + Math.min(scrollY, 700) * 0.07 + "px)";
}
addEventListener(
  "scroll",
  () => {
    if (!visualQueued) {
      visualQueued = true;
      requestAnimationFrame(movePortrait);
    }
  },
  { passive: true },
);
