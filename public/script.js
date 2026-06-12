const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const intentLinks = document.querySelectorAll("[data-intent-link]");
const leadForm = document.querySelector("[data-lead-form]");
const formMessage = document.querySelector("[data-form-message]");
const demoButton = document.querySelector("[data-demo-button]");
const demoStatus = document.querySelector("[data-demo-status]");

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

intentLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const intent = link.dataset.intentLink;
    const input = document.querySelector(`input[name="intent"][value="${intent}"]`);

    if (input) {
      input.checked = true;
    }
  });
});

if (demoButton && demoStatus) {
  demoButton.addEventListener("click", () => {
    demoStatus.textContent = "プロダクトデモ動画は現在準備中です。";
  });
}

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

    const action = intent === "consult" ? "相談希望" : "資料ダウンロード希望";
    formMessage.textContent = `${action}の入力内容を確認しました。送信先を設定すると受付できます。`;
  });
}
