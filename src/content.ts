import type { BakeryConfig, Product } from "./types.ts";

// Replace these demo settings with the bakery's real, public contact information.
// An empty email intentionally prevents sending inquiries to a placeholder address.
export const bakery: BakeryConfig = {
  name: "Miel & Crème",
  email: "",
  phone: "",
  isDemo: true,
};

export const products: Product[] = [
  {
    id: "berry-bliss",
    name: "Berry beautiful",
    description: "Vanilla sponge, soft cream & a generous tumble of berries.",
    category: "cakes",
    image: "/images/berry-cake.jpg",
    imageAlt: "Celebration cake decorated with cream and fresh berries",
    flavor: "Vanilla & berries",
    tag: "A celebration classic",
  },
  {
    id: "chocolate",
    name: "For the love of chocolate",
    description: "Rich chocolate layers for the unapologetic chocolate lover.",
    category: "cakes",
    image: "/images/chocolate-cake.jpg",
    imageAlt: "Chocolate cake finished with rich chocolate frosting",
    flavor: "Chocolate",
    tag: "Something indulgent",
  },
  {
    id: "little-joys",
    name: "Little bites of joy",
    description:
      "Pretty little treats, made for sharing. Or keeping all to yourself.",
    category: "little-treats",
    image: "/images/little-treats.jpg",
    imageAlt: "Small frosted cupcakes, ready for a sweet celebration",
    flavor: "Help me choose",
    tag: "Small but special",
  },
];

export const flavors = [
  "Vanilla & berries",
  "Chocolate",
  "Lemon",
  "Red velvet",
  "Something else",
  "Help me choose",
] as const;
export const sizes = [
  "6–8 servings",
  "10–14 servings",
  "18–24 servings",
  "30+ servings",
  "Help me choose",
] as const;
export const tiers = [
  "One tier",
  "Two tiers",
  "Three tiers",
  "Little treats",
  "Help me choose",
] as const;
export const occasions = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Baby shower",
  "Just because",
  "Something else",
] as const;
export const dietaryOptions = [
  "Gluten-free request",
  "Dairy-free request",
  "Vegan request",
  "Nut allergy",
] as const;
