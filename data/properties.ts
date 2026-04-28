//this is mock data only

export type Property = {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "For Sale" | "For Rent";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  description: string;
  agent: {
    name: string;
    phone: string;
    avatar: string;
  };
  tags: string[];
};

export const PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Condo in BGC",
    address: "Bonifacio Global City, Taguig, Metro Manila",
    price: 8500000,
    type: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 65,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    description:
      "A stunning modern condominium unit located in the heart of Bonifacio Global City. Features floor-to-ceiling windows with panoramic city views, premium finishes, and access to world-class amenities including a rooftop pool, gym, and 24/7 concierge.",
    agent: { name: "Maria Santos", phone: "+63 917 123 4567", avatar: "MS" },
    tags: ["Pool", "Gym", "Parking", "Pet-Friendly"],
  },
  {
    id: "2",
    title: "Spacious House & Lot",
    address: "Alabang, Muntinlupa, Metro Manila",
    price: 25000000,
    type: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 280,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    description:
      "A beautiful corner lot house in a prestigious subdivision in Alabang. Fully renovated with modern kitchen, landscaped garden, and a private swimming pool. Ideal for a growing family seeking comfort and security.",
    agent: { name: "Jose Reyes", phone: "+63 918 234 5678", avatar: "JR" },
    tags: ["Pool", "Garden", "2-Car Garage", "Gated"],
  },
  {
    id: "3",
    title: "Studio Loft Near Makati CBD",
    address: "Salcedo Village, Makati City",
    price: 28000,
    type: "For Rent",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 32,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    description:
      "A chic and fully furnished studio loft just minutes from Makati's central business district. Perfect for young professionals. Includes high-speed WiFi, smart TV, and access to a co-working lounge.",
    agent: { name: "Ana Cruz", phone: "+63 919 345 6789", avatar: "AC" },
    tags: ["Furnished", "WiFi", "Co-working", "Near MRT"],
  },
  {
    id: "4",
    title: "Beachfront Villa in Batangas",
    address: "Laiya, San Juan, Batangas",
    price: 45000000,
    type: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 420,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
    description:
      "An exclusive beachfront villa with direct access to pristine white sand beach. Features an infinity pool, outdoor dining area, and breathtaking ocean views. A rare investment opportunity in one of Batangas' most sought-after coastal communities.",
    agent: { name: "Luis Lim", phone: "+63 920 456 7890", avatar: "LL" },
    tags: ["Beachfront", "Infinity Pool", "Ocean View", "Private Beach"],
  },
  {
    id: "5",
    title: "2BR Condo in Ortigas",
    address: "Ortigas Center, Pasig City",
    price: 45000,
    type: "For Rent",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 55,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    description:
      "A well-maintained 2-bedroom unit in the middle of Ortigas Center. Close to major malls, restaurants, and corporate offices. Building amenities include a sky lounge, lap pool, and function rooms.",
    agent: { name: "Grace Tan", phone: "+63 921 567 8901", avatar: "GT" },
    tags: ["Sky Lounge", "Lap Pool", "Near Mall", "Balcony"],
  },
];
