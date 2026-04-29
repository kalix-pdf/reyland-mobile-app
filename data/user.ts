//dummy user data
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  phone: string;
  memberSince: string;
  role: number;
};

export const DUMMY_USER: User = {
  id: 1,
  role: 0,
  name: "Juan dela Cruz",
  email: "juan@email.com",
  password: "password123",
  avatar: "https://i.pravatar.cc/150?img=12",
  phone: "+63 912 345 6789",
  memberSince: "January 2024",
};
