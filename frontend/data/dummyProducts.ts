/**
 * Dummy product list using images from public/images.
 * Use for development, fallback when API is down, or static pages.
 */

const IMG = (path: string) => `/images/${path}`;

export interface DummyProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  customizable: boolean;
  image_url: string;
  images?: { id: number; url: string; alt: string; sort_order: number }[];
}

export const dummyProducts: DummyProduct[] = [
  {
    id: 1,
    name: "Anniversary Gift Box",
    slug: "anniversary-gift-box",
    description: "Elegant anniversary gift box, perfect for couples. Premium packaging with a personal touch.",
    price: 699,
    category: "Anniversary Gifts",
    customizable: true,
    image_url: IMG("Anniversary_Gift_Product1_00.png"),
    images: [
      { id: 1, url: IMG("Anniversary_Gift_Product1_00.png"), alt: "Anniversary Gift Box", sort_order: 0 },
      { id: 2, url: IMG("Anniversary_Gift_Product1_01.png"), alt: "Anniversary Gift Box", sort_order: 1 },
    ],
  },
  {
    id: 2,
    name: "Anniversary Lamp",
    slug: "anniversary-lamp",
    description: "Beautiful decorative lamp for anniversaries. Creates a warm, romantic ambience.",
    price: 1099,
    category: "Anniversary Gifts",
    customizable: false,
    image_url: IMG("Anniversary_Gift_Product2_lamp_00.png"),
    images: [
      { id: 3, url: IMG("Anniversary_Gift_Product2_lamp_00.png"), alt: "Anniversary Lamp", sort_order: 0 },
      { id: 4, url: IMG("Anniversary_Gift_Product2_lamp_01.png"), alt: "Anniversary Lamp", sort_order: 1 },
      { id: 5, url: IMG("Anniversary_Gift_Product2_lamp_02.png"), alt: "Anniversary Lamp", sort_order: 2 },
      { id: 6, url: IMG("Anniversary_Gift_Product2_lamp_03.png"), alt: "Anniversary Lamp", sort_order: 3 },
    ],
  },
  {
    id: 3,
    name: "Colorful Candles Set",
    slug: "colorful-candles-set",
    description: "Vibrant scented candles set. Ideal for birthdays and housewarming.",
    price: 499,
    category: "Birthday Gifts",
    customizable: false,
    image_url: IMG("Candles_Colorful.png"),
    images: [{ id: 7, url: IMG("Candles_Colorful.png"), alt: "Colorful Candles Set", sort_order: 0 }],
  },
  {
    id: 4,
    name: "Unique Candles Collection",
    slug: "unique-candles-collection",
    description: "Premium unique candles in elegant designs. Perfect luxury hamper addition.",
    price: 699,
    category: "Luxury Hampers",
    customizable: false,
    image_url: IMG("Candles_Unique_00.png"),
    images: [
      { id: 8, url: IMG("Candles_Unique_00.png"), alt: "Unique Candles", sort_order: 0 },
      { id: 9, url: IMG("Candles_Unique_01.png"), alt: "Unique Candles", sort_order: 1 },
      { id: 10, url: IMG("Candles_Unique_02.png"), alt: "Unique Candles", sort_order: 2 },
    ],
  },
  {
    id: 5,
    name: "Premium Ceramic Mugs",
    slug: "premium-ceramic-mugs",
    description: "Customizable ceramic mugs. Add names or a special message for a personal gift.",
    price: 599,
    category: "Corporate Gifts",
    customizable: true,
    image_url: IMG("Mugs.png"),
    images: [{ id: 11, url: IMG("Mugs.png"), alt: "Premium Mugs", sort_order: 0 }],
  },
  {
    id: 6,
    name: "Custom Photo Frame",
    slug: "custom-photo-frame",
    description: "Upload your photo and add a name or message. Choose frame color and font style.",
    price: 499,
    category: "Romantic Gifts",
    customizable: true,
    image_url: IMG("Photo_frame_00.png"),
    images: [
      { id: 12, url: IMG("Photo_frame_00.png"), alt: "Custom Photo Frame", sort_order: 0 },
      { id: 13, url: IMG("Photo_frame_01.png"), alt: "Custom Photo Frame", sort_order: 1 },
    ],
  },
  {
    id: 7,
    name: "Baby Photo Frame",
    slug: "baby-photo-frame",
    description: "Adorable photo frame for baby's first moments. Personalize with name and date.",
    price: 399,
    category: "Birthday Gifts",
    customizable: true,
    image_url: IMG("Photoframe_baby_00.png"),
    images: [
      { id: 14, url: IMG("Photoframe_baby_00.png"), alt: "Baby Photo Frame", sort_order: 0 },
      { id: 15, url: IMG("Photoframe_baby_01.png"), alt: "Baby Photo Frame", sort_order: 1 },
    ],
  },
];

/** Categories derived from dummy products */
export const dummyCategories = [
  "Anniversary Gifts",
  "Birthday Gifts",
  "Corporate Gifts",
  "Luxury Hampers",
  "Romantic Gifts",
] as const;
