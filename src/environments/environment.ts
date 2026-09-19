export const environment = {
  analytics: {
    measurementId: 'G-75EBZSGLQ9',
  },
  adsense: {
    clientId: 'ca-pub-6601440400464024',
    sidebarSlot: '9683601281',
    dashboardSlot: '2401831464',
    // Placeholder slot ID for the landing page's single ad unit (see PR
    // description for the landing-page rollout: this is not a real slot ID
    // provisioned in the AdSense account yet, unlike sidebarSlot/dashboardSlot
    // above. It must be replaced with a real slot ID from the AdSense dashboard
    // before this ad unit will actually serve — until then AdComponent's
    // ad-block/fill detection will simply hide the slot).
    landingSlot: '0000000000',
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
