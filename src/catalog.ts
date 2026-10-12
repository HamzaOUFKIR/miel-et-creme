import type { Locale } from "./i18n.ts";

export type LocalizedText = Record<Locale, string>;
export type CatalogCategory =
  | "celebration"
  | "layer-cakes"
  | "little-treats"
  | "baking-tools"
  | "decorations";
export interface CatalogItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: CatalogCategory;
  image: string;
  imageAlt: LocalizedText;
  inquiry: { flavor: string; style: string } | null;
}

export const catalogCategories: Record<CatalogCategory, LocalizedText> = {
  celebration: { en: "Celebration cakes", ar: "كيك المناسبات" },
  "layer-cakes": { en: "Layers & cheesecakes", ar: "كيك الطبقات والتشيز كيك" },
  "little-treats": { en: "Little treats", ar: "حلويات صغيرة" },
  "baking-tools": { en: "Baking tools", ar: "أدوات الخَبز" },
  decorations: { en: "Finishing touches", ar: "لمسات التزيين" },
};

// Illustrative catalog: replace these concepts with the baker's actual products.
export const catalog: CatalogItem[] = [
  {
    id: "berry-celebration",
    category: "celebration",
    name: { en: "Berry beautiful", ar: "حلاوة التوت" },
    description: {
      en: "Vanilla sponge, soft cream, and fresh berries. A lovely starting point for birthdays and gatherings.",
      ar: "كيك فانيليا إسفنجي وكريمة ناعمة وتوت طازج. فكرة جميلة لأعياد الميلاد واللقاءات.",
    },
    image: "/images/berry-cake.jpg",
    imageAlt: {
      en: "White cake decorated with fresh berries",
      ar: "كيك أبيض مزيّن بالتوت الطازج",
    },
    inquiry: { flavor: "Vanilla & berries", style: "Two tiers" },
  },
  {
    id: "chocolate-dream",
    category: "celebration",
    name: { en: "Chocolate daydream", ar: "حلم الشوكولاتة" },
    description: {
      en: "Rich chocolate layers, silky frosting, and a generous chocolate drip. Made for the chocolate lover.",
      ar: "طبقات شوكولاتة غنية وكريمة ناعمة وتزيين بالشوكولاتة السائلة. لعشّاق الشوكولاتة.",
    },
    image: "/images/chocolate-cake.jpg",
    imageAlt: {
      en: "Chocolate drip cake with piped frosting",
      ar: "كيك شوكولاتة مزيّن بالكريمة والشوكولاتة السائلة",
    },
    inquiry: { flavor: "Chocolate", style: "One tier" },
  },
  {
    id: "confetti-birthday",
    category: "celebration",
    name: { en: "The confetti cake", ar: "كيكة البهجة" },
    description: {
      en: "Playful sprinkles, a pink drip, and a little birthday magic. Discuss your colors and cake message with the baker.",
      ar: "حبيبات تزيين مرحة ولمسات وردية لعيد ميلاد مميز. ناقش الألوان والعبارة مع صانع الحلويات.",
    },
    image: "/images/celebration-cake.jpg",
    imageAlt: {
      en: "Pink drip birthday cake with colorful sprinkles",
      ar: "كيك عيد ميلاد بتزيين وردي وحبيبات ملونة",
    },
    inquiry: { flavor: "Help me choose", style: "One tier" },
  },
  {
    id: "wedding-berries",
    category: "celebration",
    name: { en: "A berry lovely wedding", ar: "كيكة زفاف بالتوت" },
    description: {
      en: "An elegant tiered cake with a fresh berry finish. Plan the servings, tiers, and final design together.",
      ar: "كيكة زفاف أنيقة متعددة الطوابق بلمسة توت طازج. اتفق على عدد الحصص والطوابق والتصميم النهائي.",
    },
    image: "/images/berry-cake.jpg",
    imageAlt: {
      en: "Tiered white celebration cake with berries",
      ar: "كيكة مناسبات بيضاء متعددة الطوابق مع التوت",
    },
    inquiry: { flavor: "Vanilla & berries", style: "Three tiers" },
  },
  {
    id: "raspberry-layers",
    category: "layer-cakes",
    name: { en: "Raspberry & cream", ar: "توت العليق والكريمة" },
    description: {
      en: "Delicate sponge layered with cream and a bright berry filling. A fresh, fruity inspiration for your cake.",
      ar: "كيك إسفنجي خفيف بطبقات من الكريمة وحشوة التوت. إلهام منعش بطعم الفاكهة لكيكتك.",
    },
    image: "/images/strawberry-cake.jpg",
    imageAlt: {
      en: "Layered cream cake slice topped with raspberries",
      ar: "قطعة كيك بطبقات كريمة مزيّنة بتوت العليق",
    },
    inquiry: { flavor: "Vanilla & berries", style: "One tier" },
  },
  {
    id: "coffee-layers",
    category: "layer-cakes",
    name: { en: "Coffee & cream layers", ar: "طبقات القهوة والكريمة" },
    description: {
      en: "Soft layers, coffee-inspired cream, and a cocoa finish. Tell the baker how you like your coffee notes.",
      ar: "طبقات ناعمة وكريمة مستوحاة من القهوة ولمسة كاكاو. أخبر صانع الحلويات بدرجة نكهة القهوة التي تحبها.",
    },
    image: "/images/layer-cake.jpg",
    imageAlt: {
      en: "Cream layer cake slices dusted with cocoa",
      ar: "شرائح كيك بطبقات كريمة ورشة كاكاو",
    },
    inquiry: { flavor: "Something else", style: "One tier" },
  },
  {
    id: "berry-cheesecake",
    category: "layer-cakes",
    name: { en: "Berry cheesecake", ar: "تشيز كيك بالتوت" },
    description: {
      en: "A creamy cheesecake concept with a biscuit base and a berry finish. Ask about sizes and seasonal toppings.",
      ar: "فكرة تشيز كيك كريمي بقاعدة بسكويت وتزيين بالتوت. اسأل عن الأحجام والإضافات الموسمية.",
    },
    image: "/images/cheesecake.jpg",
    imageAlt: {
      en: "Cheesecake with a berry topping",
      ar: "تشيز كيك مزيّن بالتوت",
    },
    inquiry: { flavor: "Something else", style: "One tier" },
  },
  {
    id: "lemon-celebration",
    category: "layer-cakes",
    name: { en: "Lemon celebration", ar: "كيكة الليمون" },
    description: {
      en: "A lemon-flavored cake idea with cream and berries. The photo illustrates a possible finish; agree on the recipe and design with the baker.",
      ar: "فكرة كيكة بنكهة الليمون مع الكريمة والتوت. الصورة تقترح شكلاً للتزيين؛ اتفق على الوصفة والتصميم مع صانع الحلويات.",
    },
    image: "/images/strawberry-cake.jpg",
    imageAlt: {
      en: "Cream and berry cake as a decoration reference",
      ar: "كيك بالكريمة والتوت كمرجع للتزيين",
    },
    inquiry: { flavor: "Lemon", style: "One tier" },
  },
  {
    id: "party-cupcakes",
    category: "little-treats",
    name: { en: "Party cupcakes", ar: "كب كيك الحفلات" },
    description: {
      en: "Little frosted cakes with colorful sprinkles. Discuss a matching palette and the number of treats you need.",
      ar: "كيكات صغيرة بالكريمة وحبيبات التزيين الملونة. اختر ألواناً متناسقة وحدد العدد الذي تحتاجه.",
    },
    image: "/images/little-treats.jpg",
    imageAlt: {
      en: "Cupcakes with pastel frosting and sprinkles",
      ar: "كب كيك بكريمة بألوان ناعمة وحبيبات تزيين",
    },
    inquiry: { flavor: "Help me choose", style: "Little treats" },
  },
  {
    id: "macaron-moments",
    category: "little-treats",
    name: { en: "Macaron moments", ar: "لحظات الماكرون" },
    description: {
      en: "A pastel assortment of delicate macarons. Ask about available fillings and a selection for your occasion.",
      ar: "تشكيلة ماكرون رقيقة بألوان ناعمة. اسأل عن الحشوات المتوفرة وتشكيلة تناسب مناسبتك.",
    },
    image: "/images/macarons.jpg",
    imageAlt: {
      en: "Colorful macarons stacked on a pink background",
      ar: "ماكرون ملون فوق خلفية وردية",
    },
    inquiry: { flavor: "Help me choose", style: "Little treats" },
  },
  {
    id: "chocolate-bites",
    category: "little-treats",
    name: { en: "Chocolate little bites", ar: "قطع الشوكولاتة الصغيرة" },
    description: {
      en: "Rich chocolate squares with a chocolate drizzle. A little indulgence for dessert tables and sharing.",
      ar: "مربعات شوكولاتة غنية بتزيين من الشوكولاتة السائلة. متعة صغيرة لموائد الحلويات والمشاركة.",
    },
    image: "/images/brownies.jpg",
    imageAlt: {
      en: "Chocolate cake squares drizzled with chocolate",
      ar: "مربعات كيك شوكولاتة مزيّنة بالشوكولاتة السائلة",
    },
    inquiry: { flavor: "Chocolate", style: "Little treats" },
  },
  {
    id: "berry-tartlets",
    category: "little-treats",
    name: { en: "Berry tartlets", ar: "تارت التوت" },
    description: {
      en: "Buttery pastry and a fruit-filled center. Ask about a tart or smaller treats for your gathering.",
      ar: "عجينة غنية بالزبدة وقلب مليء بالفاكهة. اسأل عن تارت كامل أو قطع صغيرة للقاءاتك.",
    },
    image: "/images/berry-tarts.jpg",
    imageAlt: {
      en: "Berry tarts with lattice pastry tops",
      ar: "تارت توت بغطاء من شرائح العجين",
    },
    inquiry: { flavor: "Something else", style: "Little treats" },
  },
  {
    id: "piping-kit",
    category: "baking-tools",
    name: { en: "Piping bag & tips", ar: "كيس ورؤوس التزيين" },
    description: {
      en: "A decorating-kit idea for swirls, borders, and buttercream details. Confirm tip shapes, materials, and availability before ordering.",
      ar: "فكرة طقم لصنع الورود والحواف وتفاصيل الكريمة. تأكد من أشكال الرؤوس والخامات والتوفر قبل الطلب.",
    },
    image: "/images/piping-kit.svg",
    imageAlt: {
      en: "Illustration of a piping bag and decorating tips",
      ar: "رسم توضيحي لكيس ورؤوس تزيين الكيك",
    },
    inquiry: null,
  },
  {
    id: "cake-tins",
    category: "baking-tools",
    name: { en: "Round cake tins", ar: "قوالب كيك دائرية" },
    description: {
      en: "Round tins for your next layer cake. Ask about diameters, depths, materials, and care instructions.",
      ar: "قوالب دائرية لكيكة الطبقات القادمة. اسأل عن الأقطار والعمق والخامات وطريقة العناية.",
    },
    image: "/images/cake-tins.svg",
    imageAlt: {
      en: "Illustration of two round cake tins",
      ar: "رسم توضيحي لقالبَي كيك دائريين",
    },
    inquiry: null,
  },
  {
    id: "icing-spatula",
    category: "baking-tools",
    name: { en: "Icing spatula", ar: "ملعقة فرد الكريمة" },
    description: {
      en: "A finishing tool for spreading and smoothing frosting. Confirm the blade size and handle material with the baker.",
      ar: "أداة لفرد الكريمة وتسوية سطحها. تأكد من مقاس الشفرة وخامة المقبض مع صانع الحلويات.",
    },
    image: "/images/spatula.svg",
    imageAlt: {
      en: "Illustration of an offset icing spatula",
      ar: "رسم توضيحي لملعقة فرد كريمة منحنية",
    },
    inquiry: null,
  },
  {
    id: "birthday-candles",
    category: "decorations",
    name: { en: "Celebration candles", ar: "شموع الاحتفال" },
    description: {
      en: "The little finishing touch before a wish. Ask about available colors, lengths, and pack sizes.",
      ar: "اللمسة الأخيرة قبل الأمنية. اسأل عن الألوان والأطوال وعدد الشموع في العبوة.",
    },
    image: "/images/candles.svg",
    imageAlt: {
      en: "Illustration of pastel birthday candles",
      ar: "رسم توضيحي لشموع عيد ميلاد بألوان ناعمة",
    },
    inquiry: null,
  },
  {
    id: "cake-topper",
    category: "decorations",
    name: { en: "A personal cake topper", ar: "زينة كيك بلمستك" },
    description: {
      en: "A topper idea for a name, number, or special message. Discuss wording, size, and suitable materials before confirming.",
      ar: "فكرة زينة تحمل اسماً أو رقماً أو عبارة خاصة. ناقش العبارة والمقاس والخامات المناسبة قبل التأكيد.",
    },
    image: "/images/cake-topper.svg",
    imageAlt: {
      en: "Illustration of a decorative cake topper",
      ar: "رسم توضيحي لزينة توضع فوق الكيك",
    },
    inquiry: null,
  },
  {
    id: "cake-stand",
    category: "decorations",
    name: { en: "The finishing cake stand", ar: "حامل الكيك" },
    description: {
      en: "An elegant pedestal for your centerpiece. Confirm dimensions and whether purchase or rental is available.",
      ar: "حامل أنيق لعرض كيكتك. تأكد من الأبعاد وإمكانية الشراء أو الاستئجار.",
    },
    image: "/images/cake-stand.svg",
    imageAlt: {
      en: "Illustration of a pedestal cake stand",
      ar: "رسم توضيحي لحامل كيك بقاعدة",
    },
    inquiry: null,
  },
];

export function filterCatalog(
  category: CatalogCategory | "all",
  query: string,
): CatalogItem[] {
  const normalize = (value: string): string =>
    value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return catalog.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    const searchable = normalize(
      [
        ...Object.values(item.name),
        ...Object.values(item.description),
        ...Object.values(catalogCategories[item.category]),
      ].join(" "),
    );
    return words.every((word) => searchable.includes(word));
  });
}
