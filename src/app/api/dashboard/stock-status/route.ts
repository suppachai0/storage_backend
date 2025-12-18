import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import Stock from '@/models/Stock';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const warehouseId = searchParams.get('warehouseId');

    if (!warehouseId) {
      return errorResponse('warehouseId is required', 400);
    }

    const stocks = await Stock.find({ warehouseId })
      .populate(['itemId', 'warehouseId'])
      .sort({ quantity: 1 });

    const stockData = stocks.map((stock: any) => {
      const isLow = stock.quantity <= stock.minAlert;
      return {
        _id: stock._id,
        itemId: stock.itemId._id,
        itemName: stock.itemId.name,
        unit: stock.itemId.unit,
        quantity: stock.quantity,
        minAlert: stock.minAlert,
        status: isLow ? 'low_stock' : 'normal',
        percentageOfMin: Math.round((stock.quantity / stock.minAlert) * 100),
      };
    });

    return successResponse({
      warehouseName: stocks.length > 0 ? stocks[0].warehouseId.name : 'Unknown',
      totalItems: stocks.length,
      lowStockItems: stocks.filter((s: any) => s.quantity <= s.minAlert).length,
      items: stockData,
    });
  } catch (error: any) {
    console.error('Stock status error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
