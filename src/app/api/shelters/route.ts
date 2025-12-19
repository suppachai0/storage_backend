import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Shelter from '@/models/Shelter';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const province = searchParams.get('province');

    let query: any = {};
    if (province) {
      query.province = province;
    }

    const shelters = await Shelter.find(query).sort({ name: 1 });

    return successResponse(shelters);
  } catch (error: any) {
    console.error('Get shelters error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    if (authResult.user?.role !== 'admin') {
      return errorResponse('Only admin can create shelters', 403);
    }

    await dbConnect();
    const body = await req.json();

    const newShelter = new Shelter(body);
    await newShelter.save();

    return successResponse(newShelter, 'Shelter created successfully', 201);
  } catch (error: any) {
    console.error('Create shelter error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
