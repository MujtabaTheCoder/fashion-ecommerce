import type { ProductCardData } from "@/types";

export type DetailedProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "women" | "men" | "accessories" | "footwear";
  categoryLabel: string;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviewsCount: number;
  badge?: "New Season" | "Bestseller" | "Limited Edition" | "Editorial Pick" | "Bespoke 3D";
  images: Array<{
    src: string;
    alt: string;
  }>;
  description: string;
  material: string;
  careInstructions: string;
  details: string[];
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
  model3dType: "ring" | "watch" | "sunglasses" | "bag" | "gem" | "pendant";
  inStock: boolean;
  isFeatured: boolean;
};

export function detailedToProductCard(p: DetailedProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : null,
  };
}

export const MOCK_PRODUCTS: DetailedProduct[] = [
  // ==================== WOMEN'S OUTFITS (6 PRODUCTS) ====================
  {
    id: "prod-w1",
    slug: "camel-wool-overcoat",
    name: "Camel Double-Faced Wool Overcoat",
    subtitle: "Architectural silhouette in pure virgin wool",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 68000, // Rs. 6,800
    compareAtCents: 85000,
    rating: 4.9,
    reviewsCount: 42,
    badge: "Bestseller",
    images: [
      {
        src: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
        alt: "Camel Double-Faced Wool Overcoat front view",
      },
      {
        src: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
        alt: "Camel Double-Faced Wool Overcoat profile angle",
      },
    ],
    description:
      "A tailored, unlined overcoat crafted from double-faced Italian virgin wool. Defined by sculpted dropped shoulders, concealed horn-button placket, and deep welt pockets.",
    material: "100% Italian Virgin Wool (520gsm)",
    careInstructions: "Specialist dry clean only.",
    details: [
      "Concealed 5-button horn closure",
      "Hand-finished double-faced seams",
      "Single back vent for fluid movement",
    ],
    colors: [
      { name: "Oat Camel", hex: "#c4a381" },
      { name: "Midnight Charcoal", hex: "#22252a" },
    ],
    sizes: ["XS", "S", "M", "L"],
    model3dType: "pendant",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-w2",
    slug: "ivory-silk-shirt",
    name: "Sandwashed Mulberry Silk Shirt",
    subtitle: "Fluid camp-collar blouse with pearlescent drape",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 34000, // Rs. 3,400
    compareAtCents: null,
    rating: 4.8,
    reviewsCount: 28,
    badge: "Editorial Pick",
    images: [
      {
        src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
        alt: "Sandwashed Mulberry Silk Shirt ivory draping",
      },
      {
        src: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1200&auto=format&fit=crop",
        alt: "Silk blouse styling shot",
      },
    ],
    description:
      "Cut from heavyweight 22-momme Mulberry silk with a peach-skin sandwashed finish. Designed to be styled relaxed and open or buttoned cleanly into tailoring.",
    material: "100% Grade 6A Mulberry Silk (22 Momme)",
    careInstructions: "Delicate hand wash cold or dry clean.",
    details: [
      "Open relaxed camp collar",
      "Mother-of-pearl engraved buttons",
      "Curved dipped hem",
    ],
    colors: [
      { name: "Silk Ivory", hex: "#f8f5ee" },
      { name: "Sage Mist", hex: "#a4b09e" },
    ],
    sizes: ["XS", "S", "M", "L"],
    model3dType: "gem",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-w3",
    slug: "column-ribbed-knit-dress",
    name: "Column Ribbed Merino Dress",
    subtitle: "Sculptural silhouette knit with seamless Japanese technology",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 39000, // Rs. 3,900
    compareAtCents: 45000,
    rating: 4.8,
    reviewsCount: 31,
    badge: "New Season",
    images: [
      {
        src: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop",
        alt: "Column Ribbed Merino Dress portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
        alt: "Long knit dress back angle",
      },
    ],
    description:
      "Engineered on whole-garment 3D knitting looms for an unbroken silhouette without chafing seams. Ribbed texture contours softly while maintaining structural weight.",
    material: "100% Ultra-Fine Extrafine Merino Wool",
    careInstructions: "Cold hand wash with wool detergent. Dry flat.",
    details: [
      "Seamless 3D knit construction",
      "High mock collar",
      "Discreet side walking split",
    ],
    colors: [
      { name: "Warm Espresso", hex: "#3a2a22" },
      { name: "Bone Ecru", hex: "#f0ece1" },
    ],
    sizes: ["XS", "S", "M", "L"],
    model3dType: "gem",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-w4",
    slug: "pleated-wide-leg-wool-trouser",
    name: "Pleated Wide-Leg Wool Trouser",
    subtitle: "High-rise tailored trousers with double deep front pleats",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 32000, // Rs. 3,200
    compareAtCents: null,
    rating: 4.7,
    reviewsCount: 38,
    badge: "Editorial Pick",
    images: [
      {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
        alt: "Pleated wide-leg trouser editorial pose",
      },
      {
        src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop",
        alt: "Tailored trouser drape",
      },
    ],
    description:
      "Fluid drape cut from lightweight tropical wool. Features extended waistband with side-adjuster buckles, avoiding the need for a belt while creating a clean line.",
    material: "98% Virgin Wool, 2% Elastane",
    careInstructions: "Dry clean only. Low steam pressing.",
    details: [
      "Deep forward double pleats",
      "Polished brass side cinch adjusters",
      "Full viscose lining to the knee",
    ],
    colors: [
      { name: "Chalk Greige", hex: "#dcd6cb" },
      { name: "Deep Caviar", hex: "#1a1918" },
    ],
    sizes: ["26", "28", "30", "32"],
    model3dType: "gem",
    inStock: true,
    isFeatured: false,
  },
  {
    id: "prod-w5",
    slug: "velvet-embroidered-anarkali-gown",
    name: "Royal Velvet Zardozi Anarkali Dress",
    subtitle: "Intricate hand-embroidered tilla and zardozi formal ensemble",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 85000, // Rs. 8,500
    compareAtCents: 98000,
    rating: 5.0,
    reviewsCount: 19,
    badge: "Limited Edition",
    images: [
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
        alt: "Royal Velvet Zardozi Dress portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
        alt: "Embroidered gown detail view",
      },
    ],
    description:
      "A majestic evening gown handcrafted in rich micro-velvet. Features gold wire zardozi embroidery along the neckline, sleeve cuffs, and flared hemline.",
    material: "100% Micro Velvet & Gold Metallic Thread",
    careInstructions: "Specialist dry clean only. Handle embellishments with care.",
    details: [
      "Handmade Zardozi needlework",
      "Flared 360-degree panel silhouette",
      "Includes embellished organza dupatta",
    ],
    colors: [
      { name: "Emerald Royale", hex: "#0b4f35" },
      { name: "Ruby Maroon", hex: "#5a0e1a" },
    ],
    sizes: ["S", "M", "L", "XL"],
    model3dType: "pendant",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-w6",
    slug: "draped-chiffon-couture-sari",
    name: "Rose Chiffon Draped Couture Sari",
    subtitle: "Fluid silk chiffon drape with hand-embellished border",
    category: "women",
    categoryLabel: "Women's Couture",
    priceCents: 92000, // Rs. 9,200
    compareAtCents: 110000,
    rating: 4.9,
    reviewsCount: 23,
    badge: "Bespoke 3D",
    images: [
      {
        src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        alt: "Rose Chiffon Draped Couture Sari photoshoot",
      },
      {
        src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        alt: "Draped silk dress closeup",
      },
    ],
    description:
      "Effortless pre-draped luxury sari cut from featherweight silk chiffon. Paired with a structured metallic sequin blouse tailored to perfection.",
    material: "100% Pure Silk Chiffon & Metallic Sequins",
    careInstructions: "Specialist dry clean only.",
    details: [
      "Pre-pleated for easy 2-minute draping",
      "Padded structured sequin blouse",
      "Hand-finished scalloped edge pallu",
    ],
    colors: [
      { name: "Dusty Rose", hex: "#c48b9f" },
      { name: "Champagne Gold", hex: "#d9c59e" },
    ],
    sizes: ["XS", "S", "M", "L"],
    model3dType: "pendant",
    inStock: true,
    isFeatured: true,
  },

  // ==================== MEN'S OUTFITS (6 PRODUCTS) ====================
  {
    id: "prod-m1",
    slug: "unstructured-tailored-blazer",
    name: "Unstructured Cashmere Wool Blazer",
    subtitle: "Modern relaxed tailoring with soft Italian canvas",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 54000, // Rs. 5,400
    compareAtCents: 62000,
    rating: 4.9,
    reviewsCount: 34,
    badge: "New Season",
    images: [
      {
        src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
        alt: "Unstructured Cashmere Wool Blazer on model",
      },
      {
        src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
        alt: "Tailored suit jacket in studio light",
      },
    ],
    description:
      "Zero shoulder padding, lightweight butterfly lining, and softly draped cashmere-blend wool make this jacket effortlessly adaptable for formal & evening events.",
    material: "90% Merino Wool, 10% Cashmere",
    careInstructions: "Dry clean only. Store on shaped wooden hanger.",
    details: [
      "Natural soft shoulder construction",
      "Patch hip pockets with ticket divider",
      "Dual rear vents",
    ],
    colors: [
      { name: "Deep Navy", hex: "#1c2230" },
      { name: "Anthracite Grey", hex: "#32353b" },
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    model3dType: "bag",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-m2",
    slug: "raw-silk-bespoke-kurta-suit",
    name: "Raw Silk Kurta & Prince Waistcoat",
    subtitle: "Bespoke raw silk embroidered collar ensemble",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 45000, // Rs. 4,500
    compareAtCents: 55000,
    rating: 5.0,
    reviewsCount: 40,
    badge: "Bestseller",
    images: [
      {
        src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
        alt: "Raw Silk Kurta with waistcoat portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
        alt: "Waistcoat tailoring detail",
      },
    ],
    description:
      "Handcrafted raw silk Kurta paired with a structured jacquard prince coat waistcoat. Features brass buttons and subtle thread embroidery on band collar.",
    material: "100% Raw Silk & Jacquard Weave",
    careInstructions: "Dry clean only.",
    details: [
      "Bandhgala mandarin collar",
      "Hand-carved metal buttons",
      "Includes matching straight trousers",
    ],
    colors: [
      { name: "Onyx Black", hex: "#121212" },
      { name: "Ivory Gold", hex: "#ece4d0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    model3dType: "bag",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-m3",
    slug: "double-breasted-navy-tuxedo",
    name: "Super 130s Double-Breasted Suit",
    subtitle: "Peak lapel bespoke tuxedo suit in dark navy wool",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 115000, // Rs. 11,500
    compareAtCents: 135000,
    rating: 5.0,
    reviewsCount: 15,
    badge: "Limited Edition",
    images: [
      {
        src: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop",
        alt: "Double-breasted navy suit portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
        alt: "Peak lapel suit detail",
      },
    ],
    description:
      "Crafted from superfine Italian 130s wool. Sculpted 6x2 double-breasted jacket featuring satin peak lapels and flat-front trousers with side adjusters.",
    material: "100% Super 130s Italian Virgin Wool",
    careInstructions: "Specialist dry clean only.",
    details: [
      "Satin covered buttons & peak lapels",
      "Full canvas interior floating chest piece",
      "Side waist cinches on trousers",
    ],
    colors: [
      { name: "Midnight Navy", hex: "#0f172a" },
      { name: "Obsidian Black", hex: "#050505" },
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    model3dType: "bag",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "prod-m4",
    slug: "normandy-linen-camp-shirt",
    name: "Normandy Pure Linen Summer Shirt",
    subtitle: "Relaxed camp-collar shirt cut from French flax",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 28000, // Rs. 2,800
    compareAtCents: null,
    rating: 4.8,
    reviewsCount: 22,
    badge: "New Season",
    images: [
      {
        src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
        alt: "Normandy Linen Shirt product shot",
      },
      {
        src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
        alt: "Linen fabric texture close up",
      },
    ],
    description:
      "Breathable, lightweight 100% Normandy flax linen shirt. Pre-washed for a soft vintage feel that cools naturally in summer heat.",
    material: "100% French Normandy Linen",
    careInstructions: "Machine wash cold. Hang dry.",
    details: [
      "Camp convertible collar",
      "Mother-of-pearl buttons",
      "Single chest welt pocket",
    ],
    colors: [
      { name: "Sand Beige", hex: "#d8c4b0" },
      { name: "Sky Azure", hex: "#a4c2d4" },
    ],
    sizes: ["S", "M", "L", "XL"],
    model3dType: "gem",
    inStock: true,
    isFeatured: false,
  },
  {
    id: "prod-m5",
    slug: "heavyweight-organic-hoodie",
    name: "Loopback Organic French Terry Hoodie",
    subtitle: "Dense 500gsm knit with seamless double-lined hood",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 22000, // Rs. 2,200
    compareAtCents: null,
    rating: 4.8,
    reviewsCount: 75,
    badge: "Editorial Pick",
    images: [
      {
        src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
        alt: "Heavyweight hoodie studio shot",
      },
      {
        src: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
        alt: "Terry hoodie texture detail",
      },
    ],
    description:
      "Knitted from custom-spun 100% GOTS organic combed cotton on vintage loopwheel machines. Heavyweight yet soft with a boxy drape.",
    material: "100% GOTS Certified Organic Cotton (500gsm)",
    careInstructions: "Machine wash cold inside out. Hang dry.",
    details: [
      "Double-layered structured hood",
      "Heavy-duty 2x2 rib side gussets",
      "Kangaroo pocket with bartack points",
    ],
    colors: [
      { name: "Washed Slate", hex: "#525961" },
      { name: "Vintage Black", hex: "#222222" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    model3dType: "pendant",
    inStock: true,
    isFeatured: false,
  },
  {
    id: "prod-m6",
    slug: "selvedge-relaxed-denim-jeans",
    name: "Japanese Selvedge Raw Denim",
    subtitle: "Kuroki Mills 14oz shuttle-loom raw indigo denim",
    category: "men",
    categoryLabel: "Men's Tailoring",
    priceCents: 29000, // Rs. 2,900
    compareAtCents: null,
    rating: 4.8,
    reviewsCount: 46,
    badge: "Editorial Pick",
    images: [
      {
        src: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
        alt: "Selvedge denim jeans close up with redline hem",
      },
      {
        src: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
        alt: "Classic denim texture on model",
      },
    ],
    description:
      "Woven in Okayama, Japan on vintage Toyoda shuttle looms. Features a natural redline selvedge ID, steel button fly, and straight-leg drape.",
    material: "100% Cotton (14oz Kuroki Selvedge)",
    careInstructions: "Soak cold inside out. Hang dry.",
    details: [
      "Custom redline selvedge at cuff",
      "Hidden copper back pocket rivets",
      "Heavy leather waistband patch",
    ],
    colors: [
      { name: "Raw Deep Indigo", hex: "#1e2a44" },
      { name: "Vintage Faded Wash", hex: "#627896" },
    ],
    sizes: ["30x32", "32x32", "34x32", "36x32"],
    model3dType: "gem",
    inStock: true,
    isFeatured: false,
  },

  // ==================== ACCESSORIES & FOOTWEAR ====================
  {
    id: "prod-a1",
    slug: "aurora-gold-signet-ring",
    name: "Atelier 18K Solid Gold Signet Ring",
    subtitle: "Hand-sculpted brushed signet with bevelled facets",
    category: "accessories",
    categoryLabel: "Haute Jewelry",
    priceCents: 49000, // Rs. 4,900
    compareAtCents: 58000,
    rating: 5.0,
    reviewsCount: 56,
    badge: "Limited Edition",
    images: [
      {
        src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
        alt: "18K Gold Signet Ring detail",
      },
    ],
    description: "Cast in solid recycled 18k yellow gold with satin brushed face and mirror-polished chamfered edges.",
    material: "100% Recycled 18K Yellow Gold",
    careInstructions: "Polish with microfibre jewelry cloth.",
    details: ["Comfort-fit band", "Satin micro-texture"],
    colors: [{ name: "Yellow Gold", hex: "#dfb15b" }],
    sizes: ["6", "7", "8", "9", "10"],
    model3dType: "ring",
    inStock: true,
    isFeatured: false,
  },
  {
    id: "prod-f1",
    slug: "artisan-leather-derby-shoes",
    name: "Goodyear-Welted Leather Derby Shoes",
    subtitle: "Full-grain French box calf with oak-bark tanned sole",
    category: "footwear",
    categoryLabel: "Artisan Footwear",
    priceCents: 56000, // Rs. 5,600
    compareAtCents: 68000,
    rating: 4.9,
    reviewsCount: 27,
    badge: "Bestseller",
    images: [
      {
        src: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop",
        alt: "Luxury leather derby shoes",
      },
    ],
    description: "Constructed using traditional 360-degree Goodyear welt technique for decades of purposeful wear.",
    material: "French Box Calfskin & Oak-Bark Leather Sole",
    careInstructions: "Condition regularly with leather balm.",
    details: ["360 Goodyear welted construction", "Natural cork footbed"],
    colors: [{ name: "Polished Black", hex: "#181818" }],
    sizes: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU"],
    model3dType: "ring",
    inStock: true,
    isFeatured: false,
  },
];
