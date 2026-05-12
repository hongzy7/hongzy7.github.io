(function () {
  var THEME_KEY = "preferred-theme";
  var LANG_KEY = "preferred-language";

  var labels = {
    en: {
      emailLabel: "Email:",
      phoneLabel: "Phone:",
      resumeLabel: "Resume:",
      resumeLink: "Resume.pdf",
      navAbout: "About Me",
      navEducation: "Education",
      navWork: "Work",
      themeDark: "☾",
      themeLight: "☀",
      langToggle: "zh"
    },
    zh: {
      emailLabel: "邮箱：",
      phoneLabel: "电话：",
      resumeLabel: "简历：",
      resumeLink: "简历.pdf",
      navAbout: "关于我",
      navEducation: "教育背景",
      navWork: "工作经历",
      themeDark: "☾",
      themeLight: "☀",
      langToggle: "en"
    }
  };

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var langButton = document.querySelector("[data-lang-toggle]");
  var languageBlocks = document.querySelectorAll("[data-lang-content]");

  function getStored(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function systemLanguage() {
    var language = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return language.indexOf("zh") === 0 ? "zh" : "en";
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      setStored(THEME_KEY, theme);
    }
    updateThemeButton(theme);
  }

  function updateThemeButton(theme) {
    if (!themeButton) return;
    var lang = root.getAttribute("lang") === "zh-CN" ? "zh" : "en";
    themeButton.textContent = theme === "dark" ? labels[lang].themeLight : labels[lang].themeDark;
    themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function setLanguage(lang, persist) {
    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en-US");

    Array.prototype.forEach.call(languageBlocks, function (block) {
      if (block.getAttribute("data-lang-content") === lang) {
        block.setAttribute("data-active-lang", "");
      } else {
        block.removeAttribute("data-active-lang");
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (node) {
      var key = node.getAttribute("data-i18n");
      if (labels[lang][key]) {
        node.textContent = labels[lang][key];
      }
    });

    if (langButton) {
      langButton.textContent = labels[lang].langToggle;
      langButton.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    }

    if (persist) {
      setStored(LANG_KEY, lang);
    }
    updateThemeButton(root.getAttribute("data-theme"));
  }

  var initialTheme = getStored(THEME_KEY) || systemTheme();
  var initialLanguage = getStored(LANG_KEY) || systemLanguage();
  setTheme(initialTheme, false);
  setLanguage(initialLanguage, false);

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  if (langButton) {
    langButton.addEventListener("click", function () {
      setLanguage(root.getAttribute("lang") === "zh-CN" ? "en" : "zh", true);
    });
  }

  var themeMedia = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (themeMedia) {
    var handleThemeChange = function (event) {
      if (!getStored(THEME_KEY)) {
        setTheme(event.matches ? "dark" : "light", false);
      }
    };

    if (themeMedia.addEventListener) {
      themeMedia.addEventListener("change", handleThemeChange);
    } else if (themeMedia.addListener) {
      themeMedia.addListener(handleThemeChange);
    }
  }
})();
