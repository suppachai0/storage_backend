import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import User from '@/models/User';
import { errorResponse, successResponse } from '@/utils/responseHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, username, password, role, phone } = await req.json();

    // Validate input
    if (!name || !email || !username || !password) {
      return errorResponse('Name, email, username, and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return errorResponse('Email or username already exists', 400);
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password,
      role: role || 'shelter_staff',
      phone,
    });

    await newUser.save();

    // Generate token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return successResponse(
      {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      'Registration successful',
      201
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
