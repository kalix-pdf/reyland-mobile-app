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
  image: Images[];
  description: string;
  agent: {
    name: string;
    phone: string;
    avatar: string;
  };
  tags: string[];
};

export type Images = {
  image_id: number;
  public_id: string;
  image_url: string;
}

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
    image: [{
      image_id: 0,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453455/7d641104-dd6a-4e37-8493-b317244f1ee6_fq29ev.jpg"
    },
    {
      image_id: 1,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453455/7d641104-dd6a-4e37-8493-b317244f1ee6_fq29ev.jpg"
    },
    {
      image_id: 2,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453455/7d641104-dd6a-4e37-8493-b317244f1ee6_fq29ev.jpg"
    }],
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
    image: [{
      image_id: 0,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453453/010d6e26-edd1-4e7c-9341-b83076df258f_gevgjt.jpg"
    },
    { 
      image_id: 1,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453453/010d6e26-edd1-4e7c-9341-b83076df258f_gevgjt.jpg"
    },
    {
      image_id: 2,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453448/f9e25828-d660-4ef2-a397-377fb1955ba1_bc3uio.jpg"
    }],
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
    image: [{
      image_id: 1,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453447/f61397cb-bc06-45bd-9c64-4dc824e38a62_isrolq.jpg"
    },
    {
      image_id: 2,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453447/f61397cb-bc06-45bd-9c64-4dc824e38a62_isrolq.jpg"
    }],
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
    image: [{
      image_id: 0,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453448/5246a63f-e663-4254-8194-8e4bb4ae3ac2_xv9btr.jpg"
    },
    {
      image_id: 1,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453448/5246a63f-e663-4254-8194-8e4bb4ae3ac2_xv9btr.jpg"
    }],
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
    image: [{
      image_id: 0,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453447/99f667ee-c421-4b86-800a-df0706c82642_c30psa.jpg"
    },
    {
      image_id: 1,
      public_id: "",
      image_url: "https://res.cloudinary.com/dobki0oaf/image/upload/v1777453447/99f667ee-c421-4b86-800a-df0706c82642_c30psa.jpg"
    }],
    description:
      "A well-maintained 2-bedroom unit in the middle of Ortigas Center. Close to major malls, restaurants, and corporate offices. Building amenities include a sky lounge, lap pool, and function rooms.",
    agent: { name: "Grace Tan", phone: "+63 921 567 8901", avatar: "GT" },
    tags: ["Sky Lounge", "Lap Pool", "Near Mall", "Balcony"],
  },
];
