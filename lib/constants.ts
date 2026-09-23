export const BRAND_NAME = "ATELIER";

export const BRAND_TAGLINE = "Haute Couture & 3D Interactive Outfits";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop Outfits" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/track-order", label: "Track Order" },
  { href: "/#customizer-3d", label: "3D Bespoke Outfit" },
  { href: "/admin", label: "Owner Portal" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Curated Collections",
    links: [
      { href: "/shop", label: "All Creations" },
      { href: "/shop?category=women", label: "Women's Silhouettes" },
      { href: "/shop?category=men", label: "Men's Tailoring" },
      { href: "/#customizer-3d", label: "3D Bespoke Shirt Studio" },
      { href: "/#atelier-3d", label: "3D Interactive Studio" },
    ],
  },
  {
    title: "Maison & Salon",
    links: [
      { href: "/admin", label: "Owner / Admin Portal" },
      { href: "/admin/orders", label: "Live Orders Management" },
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Private Atelier Appointments" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { href: "/shipping", label: "White-Glove Delivery" },
      { href: "/returns", label: "Complimentary Returns" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
] as const;
