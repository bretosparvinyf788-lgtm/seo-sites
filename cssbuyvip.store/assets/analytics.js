(function () {
  "use strict";

  function sendEvent(name, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, parameters || {});
  }

  function labelFor(link) {
    return (
      link.getAttribute("aria-label") ||
      link.textContent ||
      link.getAttribute("href") ||
      "unknown"
    )
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 120);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="/guides"]').forEach(function (link) {
      link.addEventListener("click", function () {
        sendEvent("guide_click", {
          link_url: link.href,
          link_text: labelFor(link),
          page_location: window.location.href,
        });
      });
    });

    document
      .querySelectorAll('a[href^="https://kakobuymake.com"]')
      .forEach(function (link) {
        try {
          var destination = new URL(link.href);
          destination.searchParams.set("utm_source", "cssbuyvip.store");
          destination.searchParams.set("utm_medium", "referral");
          destination.searchParams.set("utm_campaign", "cssbuy_spreadsheet");
          link.href = destination.toString();
        } catch (error) {
          return;
        }

        link.addEventListener("click", function () {
          var eventName = "main_site_click";
          if (link.closest(".product-card")) eventName = "product_click";
          if (link.closest(".category-tile")) eventName = "spreadsheet_click";
          sendEvent(eventName, {
            link_url: link.href,
            link_text: labelFor(link),
            page_location: window.location.href,
          });
        });
      });

    var searchForm = document.querySelector(".hero-search");
    if (searchForm) {
      searchForm.addEventListener("submit", function () {
        var input = searchForm.querySelector("input");
        sendEvent("site_search", {
          search_term: input ? input.value.trim().slice(0, 100) : "",
        });
      });
    }

    var calculatorTracked = false;
    document.querySelectorAll(".parcel-inputs input").forEach(function (input) {
      input.addEventListener("change", function () {
        if (calculatorTracked) return;
        calculatorTracked = true;
        sendEvent("shipping_calculator_use", {
          tool_name: "chargeable_weight_estimator",
        });
      });
    });

    var languagePicker = document.querySelector(".language-picker select");
    if (languagePicker) {
      languagePicker.addEventListener("change", function () {
        sendEvent("language_change", {
          language: languagePicker.value,
        });
      });
    }
  });
})();
