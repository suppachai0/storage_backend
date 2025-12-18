import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import User from '@/models/User';
import { errorResponse, successResponse } from '@/utils/responseHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      shelterId: user.shelterId?.toString(),
      warehouseId: user.warehouseId?.toString(),
    });

    return successResponse(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
      'Login successful'
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
