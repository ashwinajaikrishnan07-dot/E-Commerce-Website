// Page context injected into the chatbot's system prompt so it can be
// context-aware on every page.
export const PAGE_CONTEXT = {
  "/": {
    page_name: "Home",
    page_description:
      "Brand landing page for KraftWear South Indian ethnic wear with featured garments.",
    available_actions: ["Browse the catalogue", "Open the AI Mannequin Studio"],
  },
  "/catalogue": {
    page_name: "Catalogue",
    page_description:
      "Browse all garments and filter by type, occasion, price and fabric.",
    available_actions: [
      "Want me to filter by kanjivaram sarees?",
      "Show wedding blouses",
      "Filter cotton kurtis under ₹800",
    ],
  },
  "/studio": {
    page_name: "AI Mannequin Studio",
    page_description:
      "This page lets you pick a garment, zoom into the neckline, choose an embroidery style, and upload a reference image to see it rendered on a mannequin.",
    available_actions: [
      "Explain how the mannequin studio works",
      "Which neckline suits a saree blouse?",
      "Suggest an embroidery for silk",
    ],
  },
  "/craft-explorer": {
    page_name: "Craft Explorer",
    page_description:
      "Learn about six South Indian embroidery crafts with AI explanations.",
    available_actions: [
      "Want me to explain the difference between Aari and Kasuti work?",
      "Which craft is best for a wedding?",
    ],
  },
  "/customiser": {
    page_name: "Customiser",
    page_description:
      "Input occasion, fabric and budget to get an AI craft recommendation.",
    available_actions: [
      "Recommend a craft for a cotton office kurti",
      "What suits a silk wedding saree?",
    ],
  },
  "/wishlist": {
    page_name: "Wishlist",
    page_description: "Your saved garment and craft configurations.",
    available_actions: ["Explain a saved configuration"],
  },
  "/orders": {
    page_name: "Orders",
    page_description: "Orders placeholder page (coming in Phase 2).",
    available_actions: ["When can I place orders?"],
  },
};

export function contextForPath(pathname) {
  return (
    PAGE_CONTEXT[pathname] || {
      page_name: "KraftWear",
      page_description: "South Indian ethnic wear platform.",
      available_actions: [],
    }
  );
}
