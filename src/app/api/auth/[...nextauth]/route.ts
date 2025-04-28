import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export async function GET(req: Request, context: any) {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, context: any) {
  try {
    return await handler(req, context);
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 