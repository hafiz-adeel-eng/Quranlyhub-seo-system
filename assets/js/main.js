(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  /* Mega-menu tap support on touch devices */
  document.querySelectorAll(".has-dropdown > .nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  /* FAQ accordion */
  function setAccordionItemState(item, open) {
    var panel = item.querySelector(".accordion-panel");
    if (!panel) return;
    if (open) {
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    } else {
      item.classList.remove("open");
      panel.style.maxHeight = 0;
    }
  }

  document.querySelectorAll("[data-accordion] .accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;

    setAccordionItemState(item, item.classList.contains("open"));

    trigger.addEventListener("click", function () {
      var willOpen = !item.classList.contains("open");
      item.parentElement.querySelectorAll(".accordion-item").forEach(function (other) {
        if (other !== item) setAccordionItemState(other, false);
      });
      setAccordionItemState(item, willOpen);
    });
  });

  window.addEventListener("resize", function () {
    document.querySelectorAll(".accordion-item.open .accordion-panel").forEach(function (panel) {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

  /* Contact / quote form (front-end only placeholder) */
  var quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("formNote");
      if (note) note.style.display = "block";
      quoteForm.reset();
    });
  }

  /* Sticky header shadow on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8
        ? "0 6px 20px rgba(11,37,69,0.12)"
        : "0 1px 3px rgba(11,37,69,0.08)";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
