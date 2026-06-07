import { showView } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");

  const menuButton = document.getElementById("menu-btn");

  const sidebar = document.getElementById("sidebar");

  /* =====================================
MOBILE MENU
===================================== */

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("show");

      menuButton.setAttribute("aria-expanded", isOpen);

      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close Navigation Menu" : "Open Navigation Menu",
      );
    });
  }

  /* =====================================
NAVIGATION
===================================== */

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const viewId = button.dataset.view;

      if (!viewId) return;

      /* Update active button */

      navButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      });

      button.classList.add("active");

      button.setAttribute("aria-current", "page");

      /* Show page */

      showView(viewId);

      /* Save page */

      localStorage.setItem("activeView", viewId);

      /* Focus section */

      const section = document.getElementById(viewId);

      section?.focus();

      /* Close mobile sidebar */

      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove("show");

        menuButton?.setAttribute("aria-expanded", "false");

        menuButton?.setAttribute("aria-label", "Open Navigation Menu");
      }
    });
  });

  /* =====================================
CLICK OUTSIDE SIDEBAR
===================================== */

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 768 &&
      sidebar?.classList.contains("show") &&
      !sidebar.contains(event.target) &&
      !menuButton?.contains(event.target)
    ) {
      sidebar.classList.remove("show");

      menuButton?.setAttribute("aria-expanded", "false");

      menuButton?.setAttribute("aria-label", "Open Navigation Menu");
    }
  });

  /* =====================================
ESC KEY CLOSES SIDEBAR
===================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar?.classList.contains("show")) {
      sidebar.classList.remove("show");

      menuButton?.setAttribute("aria-expanded", "false");

      menuButton?.setAttribute("aria-label", "Open Navigation Menu");

      menuButton?.focus();
    }
  });

  /* =====================================
RESTORE LAST PAGE
===================================== */

  const savedView = localStorage.getItem("activeView") || "home";

  showView(savedView);

  const activeButton = document.querySelector(`[data-view="${savedView}"]`);

  if (activeButton) {
    navButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.removeAttribute("aria-current");
    });

    activeButton.classList.add("active");

    activeButton.setAttribute("aria-current", "page");
  }

  /* =====================================
LUCIDE ICONS
===================================== */

  if (window.lucide) {
    lucide.createIcons();
  }
});
