import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Shelter from '@/models/Shelter';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    await dbConnect();

    const shelters = await Shelter.find().select(
      'name province district address capacity currentPeople status contactName contactPhone latitude longitude'
    );

    const shelterData = shelters.map((shelter: any) => {
      const percentage = (shelter.currentPeople / shelter.capacity) * 100;
      return {
        _id: shelter._id,
        name: shelter.name,
        province: shelter.province,
        district: shelter.district,
        address: shelter.address,
        capacity: shelter.capacity,
        currentPeople: shelter.currentPeople,
        occupancyPercentage: Math.round(percentage),
        status: shelter.status,
        contactName: shelter.contactName,
        contactPhone: shelter.contactPhone,
        latitude: shelter.latitude,
        longitude: shelter.longitude,
      };
    });

    return successResponse(shelterData);
  } catch (error: any) {
    console.error('Shelter status error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
