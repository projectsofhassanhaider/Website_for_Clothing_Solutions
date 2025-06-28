/**
 * Simplified Hoodie Website JavaScript
 */
class HoodieWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.initMobileMenus();
    this.initImageLoading();
    this.initNavigation();
  }

  /**
   * Handle both header and footer mobile menus
   */
  initMobileMenus() {
    // Header menu
    const headerToggle = document.getElementById("menu-toggle");
    const headerNav = document.querySelector(".navbar-items-list");

    if (headerToggle && headerNav) {
      headerToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        headerNav.classList.toggle("show");
      });
    }

    // Footer menu
    const footerToggle = document.getElementById("footer-menu-toggle");
    const footerNav = document.getElementById("footer-items-list");

    if (footerToggle && footerNav) {
      footerToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        footerNav.classList.toggle("show");

        // Update icon
        const icon = footerToggle.querySelector("i");
        const span = footerToggle.querySelector("span");
        const isOpen = footerNav.classList.contains("show");

        icon.className = isOpen ? "fa-solid fa-times" : "fa-solid fa-bars";
        span.textContent = isOpen ? "Close" : "Menu";
      });
    }

    // Close menus when clicking outside
    document.addEventListener("click", (e) => {
      if (
        headerNav &&
        !headerNav.contains(e.target) &&
        !headerToggle?.contains(e.target)
      ) {
        headerNav.classList.remove("show");
      }
      if (
        footerNav &&
        !footerNav.contains(e.target) &&
        !footerToggle?.contains(e.target)
      ) {
        footerNav.classList.remove("show");
        const icon = footerToggle.querySelector("i");
        const span = footerToggle.querySelector("span");
        icon.className = "fa-solid fa-bars";
        span.textContent = "Menu";
      }
    });

    // Close menus on window resize (desktop)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        headerNav?.classList.remove("show");
        footerNav?.classList.remove("show");
      }
    });
  }

  /**
   * Simple image loading
   */
  initImageLoading() {
    const images = document.querySelectorAll("img.loading");

    images.forEach((img) => {
      const removeLoading = () => img.classList.remove("loading");

      img.addEventListener("load", removeLoading);
      img.addEventListener("error", removeLoading);

      // If already loaded
      if (img.complete) removeLoading();
    });
  }

  /**
   * Navigation with simple loading states (no artificial delays)
   */
  initNavigation() {
    // Set active page
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll("a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });

    // Add loading states to buttons and links
    this.initButtonLoading();
  }

  /**
   * Simple loading states without delays
   */
  initButtonLoading() {
    // Hero button
    const heroBtn = document.querySelector(".hero-section a");
    if (heroBtn) {
      heroBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showLoading(heroBtn, "Redirecting to Order...");
        setTimeout(() => (window.location.href = "order.html"), 100);
      });
    }

    // Product buttons
    const productBtns = document.querySelectorAll(".hoodie-card a");
    productBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showLoading(btn, "Redirecting to Order...");
        setTimeout(() => (window.location.href = "order.html"), 100);
      });
    });

    // Customize button
    const customizeBtn = document.querySelector(".customize-button");
    if (customizeBtn) {
      customizeBtn.addEventListener("click", (e) => {
        this.showLoading(customizeBtn, "Loading Customizer...");
        // Let natural navigation happen
      });
    }
  }

  /**
   * Show loading state on element
   */
  showLoading(element, text) {
    if (element.tagName === "BUTTON") {
      element.disabled = true;
      element.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
    } else {
      element.style.pointerEvents = "none";
      element.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new HoodieWebsite();
});
document.addEventListener("DOMContentLoaded", function () {
  // Animate statistics on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          animateNumber(stat);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Animate review cards on scroll
  const reviewCards = document.querySelectorAll(".review-card");
  const reviewObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  reviewCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    reviewObserver.observe(card);
  });
});

function animateNumber(element) {
  const target = element.textContent;

  // Special handling for "24/7" format
  if (target.includes("/")) {
    const parts = target.split("/");
    const firstNumber = parseInt(parts[0]);
    const secondNumber = parseInt(parts[1]);
    let current = 0;
    const increment = firstNumber / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= firstNumber) {
        current = firstNumber;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + "/" + secondNumber;
    }, 30);
    return;
  }

  // Handle other formats (50K+, 4.9, 99%)
  const number = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  let current = 0;
  const increment = number / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      current = number;
      clearInterval(timer);
    }

    // Handle decimal numbers (like 4.9)
    if (target.includes(".")) {
      element.textContent = current.toFixed(1) + suffix;
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}
