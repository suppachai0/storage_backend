import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Shelter from '@/models/Shelter';
import Request from '@/models/Request';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    await dbConnect();

    // Count shelters by status
    const totalShelters = await Shelter.countDocuments();
    const sheltersNearlyFull = await Shelter.countDocuments({ status: 'nearly_full' });
    const sheltersFull = await Shelter.countDocuments({ status: 'full' });
    const sheltersNormal = await Shelter.countDocuments({ status: 'normal' });

    // Count requests by status
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const approvedRequests = await Request.countDocuments({ status: 'approved' });
    const transferredRequests = await Request.countDocuments({ status: 'transferred' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });

    // Calculate occupancy metrics
    const sheltersWithOccupancy = await Shelter.find().select(
      'name capacity currentPeople status occupancyPercentage'
    );

    const avgOccupancy =
      sheltersWithOccupancy.reduce((sum, s: any) => {
        return sum + (s.currentPeople / s.capacity) * 100;
      }, 0) / sheltersWithOccupancy.length;

    return successResponse({
      shelters: {
        total: totalShelters,
        normal: sheltersNormal,
        nearlyFull: sheltersNearlyFull,
        full: sheltersFull,
        avgOccupancy: Math.round(avgOccupancy),
      },
      requests: {
        pending: pendingRequests,
        approved: approvedRequests,
        transferred: transferredRequests,
        rejected: rejectedRequests,
        total: pendingRequests + approvedRequests + transferredRequests + rejectedRequests,
      },
    });
  } catch (error: any) {
    console.error('Dashboard overview error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
