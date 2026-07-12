/*
=======================================================
  PRODUCTS DATA — mancheeh.shop
  ───────────────────────────────────────────────────
  Edit this file to manage your store.

  FIELDS:
    id          → unique number (never repeat)
    name        → product title
    desc        → short description
    price       → e.g. "$29.99" or "₦12,500"
    category    → "phone" | "beauty" | "trending" | "medicine"
    store       → "amazon" | "jumia"
    img         → product image URL
    affiliateUrl→ your affiliate link for this product
    features    → bullet points in the popup

  ADD: copy a block, paste at end, give new id, fill fields.
  DELETE: remove the { } block and the comma before it.
  Save → refresh browser → done!
=======================================================
*/

function getProductImagePath(store, category, filename) {
  return `image/${store}/${category}/${encodeURIComponent(filename)}`;
}

const PRODUCTS = [

  // ═══════════════════════════════════════════════════
  //  AMAZON PRODUCTS
  // ═══════════════════════════════════════════════════

  // — Phone Accessories —
  {
    id: 1,
    name: "TAGRY Bluetooth Headphones ",
    desc: "TAGRY Bluetooth Headphones True Wireless Earbuds 60H Playback LED Power Display Earphones with Wireless",
    price: "",
    category: "phone",
    store: "amazon",
    img: getProductImagePath("amazon", "phoneacces", "bluetooth speaker (2).png"),
    affiliateUrl: "#",
    features: ["Bluetooth 5.2", "30h battery", "Waterproof IPX5"]
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    desc: "Bluetooth Speaker, 20W HD Sound, Portable Wireless, IPX5 Waterproof, Up to 24H Playtime, TWS Pairing, for Home/Party/Outdoor/Camping/Beach Essentials, Electronic Gadgets, Birthday Gift (Black)",
    price: "",
    category: "phone",
    store: "amazon",
    img: getProductImagePath("amazon", "phoneacces", "bluetooth speaker (1).png"),
    affiliateUrl: "#",
    features: ["20W output", "IPX7", "microSD slot"]
  },
  {
    id: 3,
    name: "Magnetic Phone Case",
    desc: "MagSafe compatible slim fit",
    price: "$14.99",
    category: "phone",
    store: "amazon",
    img: getProductImagePath("amazon", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Military drop protection", "Carbon fiber finish"]
  },
  {
    id: 4,
    name: "Smart Watch Ultra",
    desc: "Fitness tracking + smart notifications",
    price: "$79.99",
    category: "phone",
    store: "amazon",
    img: getProductImagePath("amazon", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["AMOLED display", "Built-in GPS", "Heart rate monitor"]
  },
  {
    id: 5,
    name: "GaN Fast Charger 65W",
    desc: "Charge 3 devices at once",
    price: "$22.99",
    category: "phone",
    store: "amazon",
    img: getProductImagePath("amazon", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["3 ports", "Foldable plug", "Universal compatibility"]
  },

  // — Beauty & Hair —
  {
    id: 6,
    name: "medicube Toner Pads Zero Pore Pad 2.0 ",
    desc: "Brightening & anti-aging serum",
    price: "",
    category: "beauty",
    store: "amazon",
    img: getProductImagePath("amazon", "beauty", "item1.png"),
    affiliateUrl: "#",
    features: ["Dual-Textured Facial Pad for Exfoliation and Pore Care with 4.5% AHA Lactic Acid, 0.45% BHA Salicylic Acid | Ideal for All, Korean Skin Care, 70 Pads"]
  },
  {
    id: 7,
    name: "medicube Toner Pads Red Succinic Acid Panthenol Facial Peeling Pad",
    desc: "medicube Toner Pads Red Succinic Acid Panthenol Facial Peeling Pad (70 pads, 5.46 fl oz / 155g):",
    price: "",
    category: "beauty",
    store: "amazon",
    img: getProductImagePath("amazon", "beauty", "item2.png"),
    affiliateUrl: "#",
    features: ["Soothing Panthenol - Non-Comedogenic, 70 Pads ", "Niacinamide", "AHA, BHA"]
  },
  {
    id: 8,
    name: "Nutrafol Women's Hair Growth supplement",
    desc: "Supplements, Ages 18-44, Clinically Tested for Visibly Thicker and Stronger Hair",
    price: "",
    category: "beauty",
    store: "amazon",
    img: getProductImagePath("amazon", "beauty", "item3.png"),
    affiliateUrl: "#",
    features: ["Dietary Supplement", "containing 120 Capsules", ]
  },
  {
    id: 9,
    name: "eos Shea Better Body Lotion Vanilla Cashmere",
    desc: "16 fl. oz (473ml) /24-hour moisture skin care lotion",
    price: "",
    category: "beauty",
    store: "amazon",
    img: getProductImagePath("amazon", "beauty", "item4.png"),
    affiliateUrl: "#",
    features: ["24-Hour Moisture Skin Care ", "Lightweight & Non-Greasy", "Natural Shea "]
  },

  // — Trending —
  {
    id: 10,
    name: "Cosori 9-in-1 TurboBlaze Air Fryer 6 Qt",
    desc: "PFAS-Free Ceramic Coating, 90°–450°F,120V, Dark Gray, Precise Heating for Even Results",
    price: "",
    category: "trending",
    store: "amazon",
    img: getProductImagePath("amazon", "trending", "item1.png"),
    affiliateUrl: "#",
    features: ["Air Fry", "Roast, Bake", "Broil, Dry, Frozen"]
  },
  {
    id: 11,
    name: "Shark Pet Cordless Stick Vacuum",
    desc: " XL Dust Cup, LED Headlights, Removable Handheld Vac, Crevice Tool ",
    price: "",
    category: "trending",
    store: "amazon",
    img: getProductImagePath("amazon", "trending", "item2.png"),
    affiliateUrl: "#",
    features: ["40min runtime", "HEPA filter", "Wall mount included"]
  },
  {
    id: 12,
    name:"Govee RGBIC LED Strip Lights, Smart LED Lights for Bedroom",
    desc: "Smart room lighting ",
    price: "",
    category: "trending",
    store: "amazon",
    img: getProductImagePath("amazon", "trending", "item3.png"),
    affiliateUrl: "#",
    features: ["App + voice control", "Home Decor", "Color Changing LED Strip Lighting Music Sync"]
  },

  // — Medicines —
  {
    id: 13,
    name: "Tylenol Rapid Release Extra Strength Gelcaps",
    desc: "Strong Pain Relief, Fever Reducer, Gentle on Stomach,",
    price: "",
    category: "medicine",
    store: "amazon",
    img: getProductImagePath("amazon", "medicine", "item1.png"),
    affiliateUrl: "#",
    features: ["Acetaminophen 500 mg per Gel", "100 Count Size", "rapid release galcaps for fast pain relief"]
  },
  {
    id: 14,
    name: "Amazon Basic Care Omeprazole Delayed Release",
    desc: "heartburn & acid 14-Day Course of Treatment, 28 Count (Packaging May Vary) (Pack of 2)",
    price: "",
    category: "medicine",
    store: "amazon",
    img: getProductImagePath("amazon", "medicine", "item2.png"),
    affiliateUrl: "#",
    features: ["Heartburn Medicine", "14-Day Course of Treatment", "28 Count (Packaging May Vary) (Pack of 2)"]
    
  },
  {
    id: 15,
    name: "Pepcid AC Maximum Strength Heartburn Relief tablets",
    desc: "fast-acting alternative acid reducer, 75-count. Pitcher of 75 tablets, 10 mg each, for quick relief from heartburn and acid indigestion",
    price: "",
    category: "medicine",
    store: "amazon",
    img: getProductImagePath("amazon", "medicine", "item3.png"),
    affiliateUrl: "#",
    features: ["fast-acting", "75-count", "10 mg each"]
  },
  {
    id: 16,
    name: "Neosporin",
    desc: "Original First Aid Antibiotic Ointment with Bacitracin Zinc for Infection Protection",
    price: "$12.99",
    category: "medicine",
    store: "amazon",
    img: getProductImagePath("amazon", "medicine", "item4 .png"),
    affiliateUrl: "#",
    features: ["Scrapes and Burns", "(Pack of 2)", "bacitracin zinc for infection protection"]
  },

  // ═══════════════════════════════════════════════════
  //  JUMIA PRODUCTS
  // ═══════════════════════════════════════════════════

  // — Phone Accessories —
  {
    id: 17,
    name: "Oraimo FreePods 4",
    desc: "Deep bass TWS earbuds",
    price: "₦18,500",
    category: "phone",
    store: "jumia",
    img: getProductImagePath("jumia", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["ENC noise cancellation", "28h total battery", "Fast charge"]
  },
  {
    id: 18,
    name: "Tecno Power Bank 20K",
    desc: "Slim 20000mAh dual output",
    price: "₦12,000",
    category: "phone",
    store: "jumia",
    img: getProductImagePath("jumia", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["PD 22.5W fast charge", "Dual USB-A + USB-C", "LED indicator"]
  },
  {
    id: 19,
    name: "Infinix Smart Watch",
    desc: "Fitness band with AMOLED screen",
    price: "₦25,000",
    category: "phone",
    store: "jumia",
    img: getProductImagePath("jumia", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Blood oxygen monitor", "100+ sport modes", "7-day battery"]
  },
  {
    id: 20,
    name: "Phone Holder Car Mount",
    desc: "360° magnetic dashboard mount",
    price: "₦3,500",
    category: "phone",
    store: "jumia",
    img: getProductImagePath("jumia", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Universal fit", "Strong magnet", "One-hand release"]
  },
  {
    id: 21,
    name: "USB-C Fast Charger 33W",
    desc: "Compact wall charger with cable",
    price: "₦4,200",
    category: "phone",
    store: "jumia",
    img: getProductImagePath("jumia", "phoneacces", "placeholder.png"),
    affiliateUrl: "#",
    features: ["33W fast charge", "1m braided cable included", "Overheat protection"]
  },

  // — Beauty & Hair —
  {
    id: 22,
    name: "Organic Hair Growth Oil",
    desc: "Castor & argan oil blend",
    price: "₦6,500",
    category: "beauty",
    store: "jumia",
    img: getProductImagePath("jumia", "beauty", "placeholder.png"),
    affiliateUrl: "#",
    features: ["100% natural oils", "Reduces breakage", "For all hair types"]
  },
  {
    id: 23,
    name: "Glow Lip Gloss Set",
    desc: "6-piece non-sticky high shine set",
    price: "₦4,000",
    category: "beauty",
    store: "jumia",
    img: getProductImagePath("jumia", "beauty", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Shea butter formula", "6 nude shades", "Long-lasting gloss"]
  },
  {
    id: 24,
    name: "Shea Body Butter Cream",
    desc: "Deep moisturizing 48h cream",
    price: "₦3,800",
    category: "beauty",
    store: "jumia",
    img: getProductImagePath("jumia", "beauty", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Raw shea butter", "No parabens", "Suitable for sensitive skin"]
  },
  {
    id: 25,
    name: "Gentle Foaming Cleanser",
    desc: "Salicylic acid face wash",
    price: "₦5,200",
    category: "beauty",
    store: "jumia",
    img: getProductImagePath("jumia", "beauty", "placeholder.png"),
    affiliateUrl: "#",
    features: ["2% salicylic acid", "Clears acne", "Aloe vera soothing"]
  },

  // — Trending —
  {
    id: 26,
    name: "Blender Smoothie Maker",
    desc: "Personal 300W portable blender",
    price: "₦15,000",
    category: "trending",
    store: "jumia",
    img: getProductImagePath("jumia", "trending", "placeholder.png"),
    affiliateUrl: "#",
    features: ["300W motor", "BPA-free jar", "USB rechargeable"]
  },
  {
    id: 27,
    name: "Mini Rechargeable Fan",
    desc: "3-speed silent desk fan",
    price: "₦6,000",
    category: "trending",
    store: "jumia",
    img: getProductImagePath("jumia", "trending", "placeholder.png"),
    affiliateUrl: "#",
    features: ["3 speed levels", "8h battery life", "Foldable design"]
  },
  {
    id: 28,
    name: "Insulated Water Bottle",
    desc: "Stainless steel 1L thermos",
    price: "₦7,500",
    category: "trending",
    store: "jumia",
    img: getProductImagePath("jumia", "trending", "placeholder.png"),
    affiliateUrl: "#",
    features: ["24h cold / 12h hot", "Leak-proof lid", "BPA-free"]
  },
  {
    id: 29,
    name: "Laptop Cooling Stand",
    desc: "Aluminium adjustable riser with fans",
    price: "₦9,800",
    category: "trending",
    store: "jumia",
    img: getProductImagePath("jumia", "trending", "placeholder.png"),
    affiliateUrl: "#",
    features: ["Dual silent fans", "6 height levels", "Fits 10–17 inch laptops"]
  },

  // — Medicines —
  {
    id: 30,
    name: "Vitamin C 1000mg",
    desc: "High-dose immune booster",
    price: "₦4,500",
    category: "medicine",
    store: "jumia",
    img: getProductImagePath("jumia", "medicine", "placeholder.png"),
    affiliateUrl: "#",
    features: ["1000mg per tablet", "With zinc & rosehip", "60 effervescent tabs"]
  },
  {
    id: 31,
    name: "Zinc + Selenium Capsules",
    desc: "Antioxidant & fertility support",
    price: "₦5,800",
    category: "medicine",
    store: "jumia",
    img: getProductImagePath("jumia", "medicine", "placeholder.png"),
    affiliateUrl: "#",
    features: ["25mg Zinc", "200mcg Selenium", "90 capsules"]
  },
  {
    id: 32,
    name: "Moringa Leaf Capsules",
    desc: "Superfood energy & detox supplement",
    price: "₦6,200",
    category: "medicine",
    store: "jumia",
    img: getProductImagePath("jumia", "medicine", "placeholder.png"),
    affiliateUrl: "#",
    features: ["100% organic moringa", "Rich in iron & calcium", "60 capsules"]
  },
  {
    id: 33,
    name: "Black Seed Oil Capsules",
    desc: "Nigella sativa immunity support",
    price: "₦7,000",
    category: "medicine",
    store: "jumia",
    img: "https://placecats.com/200/200?random=56",
    affiliateUrl: "#",
    features: ["Cold-pressed oil", "Anti-inflammatory", "60 softgels"]
  }

];
