import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Stock from '@/models/Stock';
import Item from '@/models/Item';
import { errorResponse, successResponse } from '@/utils/responseHandler';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    await dbConnect();
    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || !quantity) {
      return errorResponse('itemId and quantity are required', 400);
    }

    // Check all warehouses for this item
    const stocks = await Stock.find({ itemId }).populate('warehouseId');

    let totalAvailable = 0;
    const availability: any[] = [];

    for (const stock of stocks) {
      totalAvailable += stock.quantity;
      if (stock.quantity > 0) {
        availability.push({
          warehouseId: stock.warehouseId._id,
          warehouseName: stock.warehouseId.name,
          available: stock.quantity,
          canFulfill: stock.quantity >= quantity,
        });
      }
    }

    return successResponse({
      itemId,
      quantityRequested: quantity,
      totalAvailable,
      isAvailable: totalAvailable >= quantity,
      availability,
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
