import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'warehouse_staff' | 'shelter_staff';
  shelterId?: string;
  warehouseId?: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function authenticate(request: NextRequest) {
  const token = extractToken(request);
  
  if (!token) {
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    user: payload,
    response: null,
  };
}
