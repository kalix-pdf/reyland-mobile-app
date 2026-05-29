import { User } from "@/types/user.types";
//dummy user data

export const DUMMY_USERS: User[] = [
  {
    // INVESTOR USER
    uuid: "2",
    role: 1,
    accessToken: "",
    name: "JAKE POGI",
    email: "jakepogi123@email.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=14",
    phone: "+63 912 345 6789",
    memberSince: "January 2024",
    status: 1,
  },
  {
    // BUYER USER
    uuid: "1",
    role: 0,
    accessToken: "",
    name: "Juan dela Cruz",
    email: "juan@email.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=12",
    phone: "+63 912 345 6789",
    memberSince: "January 2024",
    status: 1,
  }
];
