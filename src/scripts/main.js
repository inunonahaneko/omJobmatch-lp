import { animate, inView, stagger } from "motion";
import { Alignment, Fit, Layout, Rive } from "@rive-app/canvas";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const intentLinks = document.querySelectorAll("[data-intent-link]");
const leadForm = document.querySelector("[data-lead-form]");
const formMessage = document.querySelector("[data-form-message]");
const riveFaceCanvas = document.querySelector("[data-rive-face]");
const heroSection = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = reduceMotion
  ? null
  : new Lenis({
      autoRaf: true,
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 0.88,
      touchMultiplier: 1,
      anchors: false,
    });

const scrollToTarget = (target) => {
  if (lenis) {
    lenis.scrollTo(target, { offset: -88, duration: 1.15 });
    return;
  }

  target.scrollIntoView({ behavior: "auto", block: "start" });
};

const setupRiveFace = async () => {
  if (!riveFaceCanvas) {
    return;
  }

  const basePath = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const src = `${basePath}assets/omjob-face.riv`;
  const response = await fetch(src, { method: "HEAD" });

  if (!response.ok) {
    return;
  }

  const rive = new Rive({
    src,
    canvas: riveFaceCanvas,
    autoplay: !reduceMotion,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      rive.resizeDrawingSurfaceToCanvas();
      riveFaceCanvas.closest(".video-shell")?.classList.add("is-rive-ready");
    },
  });
};

setupRiveFace().catch(() => {
  // Keep the CSS fallback face if the Rive asset is not available.
});

const heroRevealTargets = [
  ...document.querySelectorAll(".hero .eyebrow, .hero-lead, .hero-actions, .hero .video-shell"),
];
const heroHeadlineLines = document.querySelectorAll(".headline-line span");

if (!reduceMotion) {
  heroHeadlineLines.forEach((line) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(112%)";
  });

  heroRevealTargets.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(18px)";
  });

  animate(
    heroHeadlineLines,
    { opacity: 1, transform: "translateY(0%)" },
    {
      duration: 0.86,
      delay: stagger(0.1, { start: 0.12 }),
      easing: [0.2, 0, 0.18, 1],
    },
  );

  animate(
    heroRevealTargets,
    { opacity: 1, transform: "translateY(0px)" },
    {
      duration: 0.74,
      delay: stagger(0.08, { start: 0.42 }),
      easing: [0.2, 0, 0.18, 1],
    },
  );

  if (heroSection) {
    heroSection.classList.add("is-face-active");

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heroSection.classList.remove("is-face-active");
          requestAnimationFrame(() => {
            heroSection.classList.add("is-face-active");
          });
          return;
        }

        heroSection.classList.remove("is-face-active");
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.08 },
    );

    heroObserver.observe(heroSection);
  }
}

if (!reduceMotion) {
  const revealItems = document.querySelectorAll(
    ".section-heading > .eyebrow, .section-heading > p:not(.eyebrow), .cta-copy > .eyebrow, .cta-copy > p, .feature-row, .outcome-grid article, .lead-form",
  );
  const revealHeadings = document.querySelectorAll(".reveal-heading");

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(28px)";
  });

  revealHeadings.forEach((heading) => {
    const inner = heading.querySelector(":scope > span");

    if (!inner) {
      return;
    }

    inner.style.opacity = "0";
    inner.style.transform = "translateY(108%)";
  });

  inView(
    revealItems,
    (item) => {
      animate(
        item,
        { opacity: 1, transform: "translateY(0px)" },
        { duration: 0.72, easing: [0.2, 0, 0.18, 1] },
      );
    },
    { margin: "0px 0px -14% 0px" },
  );

  inView(
    revealHeadings,
    (heading) => {
      const inner = heading.querySelector(":scope > span");

      if (!inner) {
        return;
      }

      animate(
        inner,
        { opacity: 1, transform: "translateY(0%)" },
        { duration: 0.82, easing: [0.2, 0, 0.18, 1] },
      );
    },
    { margin: "0px 0px -16% 0px" },
  );

  inView(
    ".outcomes",
    (section) => {
      section.classList.add("is-face-active");
    },
    { margin: "0px 0px -34% 0px" },
  );
}

const createIrisCurtain = () => {
  const curtain = document.createElement("div");
  curtain.className = "iris-curtain";
  curtain.setAttribute("aria-hidden", "true");
  document.body.appendChild(curtain);
  return curtain;
};

const runIrisTransition = async (target, originElement) => {
  if (reduceMotion) {
    scrollToTarget(target);
    return;
  }

  const curtain = createIrisCurtain();
  const rect = originElement.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const maxX = Math.max(originX, window.innerWidth - originX);
  const maxY = Math.max(originY, window.innerHeight - originY);
  const radius = Math.hypot(maxX, maxY);

  curtain.style.setProperty("--iris-x", `${originX}px`);
  curtain.style.setProperty("--iris-y", `${originY}px`);

  await animate(
    curtain,
    {
      clipPath: [
        `circle(0px at ${originX}px ${originY}px)`,
        `circle(${radius}px at ${originX}px ${originY}px)`,
      ],
      opacity: [0, 1],
    },
    { duration: 0.34, easing: [0.45, 0, 0.2, 1] },
  ).finished;

  scrollToTarget(target);

  await animate(
    curtain,
    {
      clipPath: [
        `circle(${radius}px at ${originX}px ${originY}px)`,
        `circle(0px at ${originX}px ${originY}px)`,
      ],
      opacity: [1, 0],
    },
    { duration: 0.44, easing: [0.2, 0, 0.25, 1] },
  ).finished;

  curtain.remove();
};

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    history.pushState(null, "", href);
    runIrisTransition(target, link);
  });
});

intentLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const intent = link.dataset.intentLink;
    const input = document.querySelector(`input[name="intent"][value="${intent}"]`);

    if (input) {
      input.checked = true;
    }
  });
});

if (leadForm && formMessage) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const company = String(formData.get("company") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const intent = String(formData.get("intent") || "download");

    if (!company || !name || !email) {
      formMessage.textContent = "未入力の項目があります。内容を確認してください。";
      return;
    }

    const action = intent === "consult" ? "相談希望" : "サービス資料受け取り希望";
    formMessage.textContent = `${action}の入力内容を確認しました。送信先を設定すると受付できます。`;
  });
}
