window.CRASHX_SITE_CONFIG = {
  repositoryURL: "",
  supportEmail: ""
};

(() => {
  const config = window.CRASHX_SITE_CONFIG;
  const storedLanguage = localStorage.getItem("crashx-language");
  let language = storedLanguage || (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.textContent = language === "zh" ? "EN" : "中文";
      button.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换到中文");
    });
    localStorage.setItem("crashx-language", language);
  }

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(language === "zh" ? "en" : "zh"));
  });

  function inferredRepositoryURL() {
    if (config.repositoryURL) return config.repositoryURL.replace(/\/$/, "");
    if (!location.hostname.endsWith(".github.io")) return "";
    const owner = location.hostname.split(".")[0];
    const firstPath = location.pathname.split("/").filter(Boolean)[0];
    const repository = firstPath || `${owner}.github.io`;
    return `https://github.com/${owner}/${repository}`;
  }

  const repositoryURL = inferredRepositoryURL();
  document.querySelectorAll("[data-repository-link]").forEach((link) => {
    if (repositoryURL) link.href = repositoryURL;
  });
  document.querySelectorAll("[data-support-link]").forEach((link) => {
    if (config.supportEmail) {
      link.href = `mailto:${config.supportEmail}?subject=CrashBeacon%20Support`;
    } else if (repositoryURL) {
      link.href = `${repositoryURL}/issues/new?title=CrashBeacon%20Support%3A%20`;
    }
  });
  document.querySelectorAll("[data-contact-value]").forEach((element) => {
    if (config.supportEmail) {
      element.textContent = config.supportEmail;
    } else if (repositoryURL) {
      element.textContent = `${repositoryURL}/issues`;
    }
  });

  applyLanguage(language);
})();
