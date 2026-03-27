/* ===========================
   Clean Media Platforms - Instagram
   =========================== */

/* --- Redirect homepage to "Following" feed --- */
function enforceFollowingVariant() {
  if (
    window.location.pathname === "/" &&
    !window.location.search.includes("variant=following")
  ) {
    window.location.replace("/?variant=following");
  }
}

// Run on initial load
enforceFollowingVariant();

// Watch for SPA navigation (client-side URL changes)
const observer = new MutationObserver(() => {
  enforceFollowingVariant();
});

observer.observe(document.documentElement, { childList: true, subtree: true });

// Also catch popstate (back/forward navigation)
window.addEventListener("popstate", enforceFollowingVariant);
