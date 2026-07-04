export const environment = {
  analytics: {
    measurementId: 'G-75EBZSGLQ9',
  },
  adsense: {
    clientId: 'ca-pub-6601440400464024',
    sidebarSlot: '9683601281',
    dashboardSlot: '2401831464',
  },
  site: {
    // Canonical origin used for all indexable URLs (canonical/hreflang/sitemap/
    // structured data). This is the single source of truth: scripts/postbuild.mjs
    // reads this same value out of this file (see BASE_URL there), so Angular
    // (browser build) and the Node postbuild step never drift apart. Can be
    // overridden per-environment via the BASE_URL env var in CI (see postbuild.mjs).
    baseUrl: 'https://devtools.morihara.tech',
  },
};
