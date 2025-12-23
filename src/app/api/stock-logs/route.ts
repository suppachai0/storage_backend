import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import StockLog from '@/models/StockLog';
import { successResponse, errorResponse } from '@/utils/responseHandler';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    await dbConnect();

    // Get query params
    const { searchParams } = new URL(req.url);
    const warehouseId = searchParams.get('warehouseId');
    const itemId = searchParams.get('itemId');
    const changeType = searchParams.get('changeType'); // in, out, adjustment
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = {};
    if (warehouseId) query.warehouseId = warehouseId;
    if (itemId) query.itemId = itemId;
    if (changeType) query.changeType = changeType;

    // Count total
    const total = await StockLog.countDocuments(query);

    // Fetch logs with pagination
    const logs = await StockLog.find(query)
      .populate('itemId', 'name unit')
      .populate('warehouseId', 'name province')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform data for frontend
    const transformedLogs = logs.map((log: any) => ({
      _id: log._id,
      item: {
        _id: log.itemId?._id,
        name: log.itemId?.name,
        unit: log.itemId?.unit,
      },
      warehouse: {
        _id: log.warehouseId?._id,
        name: log.warehouseId?.name,
        province: log.warehouseId?.province,
      },
      changeType: log.changeType,
      changeTypeLabel: log.changeType === 'in' ? 'รับเข้า' : log.changeType === 'out' ? 'จ่ายออก' : 'ปรับปรุง',
      quantity: log.quantity,
      reason: log.reason,
      createdBy: {
        _id: log.createdBy?._id,
        name: log.createdBy?.name,
        email: log.createdBy?.email,
      },
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    }));

    return successResponse({
      logs: transformedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Stock logs error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return authResult.response || errorResponse('Unauthorized', 401);
    }

    if (authResult.user?.role !== 'admin' && authResult.user?.role !== 'warehouse_staff') {
      return errorResponse('Only admin or warehouse staff can create stock logs', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { itemId, warehouseId, changeType, quantity, reason } = body;

    if (!itemId || !warehouseId || !changeType || quantity === undefined) {
      return errorResponse('itemId, warehouseId, changeType and quantity are required', 400);
    }

    const newLog = await StockLog.create({
      itemId,
      warehouseId,
      changeType,
      quantity,
      reason,
      createdBy: authResult.user.userId,
    });

    await newLog.populate([
      { path: 'itemId', select: 'name unit' },
      { path: 'warehouseId', select: 'name province' },
      { path: 'createdBy', select: 'name email' },
    ]);

    return successResponse(newLog, 'Stock log created successfully', 201);
  } catch (error: any) {
    console.error('Create stock log error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
