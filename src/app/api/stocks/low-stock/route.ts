import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Stock from '@/models/Stock';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    await dbConnect();

    // Get all stocks with low levels
    const lowStocks = await Stock.find({
      $expr: { $lte: ['$quantity', '$minAlert'] },
    })
      .populate(['warehouseId', 'itemId'])
      .sort({ quantity: 1 });

    return successResponse(lowStocks, 'Low stock items retrieved');
  } catch (error: any) {
    console.error('Get low stock error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
