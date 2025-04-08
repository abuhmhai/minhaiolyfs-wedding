import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import mysql from 'mysql2/promise';

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nhungtrang_wedding',
};

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Connect to MySQL
    const connection = await mysql.createConnection(dbConfig);

    // Get user information
    const [users] = await connection.execute(
      'SELECT id, email, full_name FROM users WHERE id = ?',
      [payload.userId]
    );

    await connection.end();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0] as any;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
} 