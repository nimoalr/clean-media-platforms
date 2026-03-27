/* ===========================
   Clean Media Platforms - X (Twitter)
   =========================== */

/* --- Auto-select "Following" tab and "Recent" sort mode --- */
(function () {
  let hasClickedFollowing = false;
  let hasSetRecent = false;

  function isHomePage() {
    return (
      window.location.pathname === "/home" ||
      window.location.pathname === "/"
    );
  }

  function clickFollowingTab() {
    if (hasClickedFollowing || !isHomePage()) return;
    const tabs = document.querySelectorAll('div[role="tab"]');
    for (const tab of tabs) {
      const text = tab.textContent?.trim();
      if (text === "Following" || text === "Suivi(e)" || text === "Abonnements") {
        const isSelected = tab.getAttribute("aria-selected") === "true";
        if (!isSelected) {
          tab.click();
        }
        hasClickedFollowing = true;
        // After switching to Following, set Recent mode
        setTimeout(clickSortRecent, 500);
        return;
      }
    }
  }

  function clickSortRecent() {
    if (hasSetRecent) return;
    // Find the sort dropdown button (the chevron next to "Following")
    const tabs = document.querySelectorAll('div[role="tab"]');
    for (const tab of tabs) {
      const text = tab.textContent?.trim();
      if (text === "Following" || text === "Suivi(e)" || text === "Abonnements") {
        const isSelected = tab.getAttribute("aria-selected") === "true";
        if (!isSelected) return;
        // Look for the sort/chevron button near the Following tab
        const sortButton = tab.querySelector('div[aria-label]') ||
          tab.parentElement.querySelector('[data-testid="sortTimeline"]');
        if (sortButton) {
          sortButton.click();
          setTimeout(selectRecentOption, 300);
        }
        return;
      }
    }
  }

  function selectRecentOption() {
    // Find "Recent" or "Récents" in the dropdown menu
    const menuItems = document.querySelectorAll('[role="menuitem"], [role="menuitemradio"]');
    for (const item of menuItems) {
      const text = item.textContent?.trim();
      if (text === "Recent" || text === "Récents" || text === "Latest") {
        const isChecked = item.getAttribute("aria-checked") === "true";
        if (!isChecked) {
          item.click();
        }
        hasSetRecent = true;
        return;
      }
    }
  }

  // Reset state on SPA navigation
  let lastPath = window.location.pathname;
  function checkNavigation() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (isHomePage()) {
        hasClickedFollowing = false;
        hasSetRecent = false;
      }
    }
  }

  // Observe DOM changes for SPA navigation
  const observer = new MutationObserver(() => {
    checkNavigation();
    if (isHomePage() && !hasClickedFollowing) {
      clickFollowingTab();
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  window.addEventListener("popstate", () => {
    checkNavigation();
    if (isHomePage()) {
      hasClickedFollowing = false;
      hasSetRecent = false;
      setTimeout(clickFollowingTab, 500);
    }
  });
})();
