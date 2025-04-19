import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    email: string;
    fullName: string;
    phone?: string;
    address?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: Role;
      email: string;
      fullName: string;
      phone?: string;
      address?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    email: string;
    fullName: string;
    phone?: string;
    address?: string;
  }
} 