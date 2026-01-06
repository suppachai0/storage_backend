import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Shelter from '@/models/Shelter';
import { verifyToken, extractToken } from '@/lib/auth';

// POST /api/shelters/bulk - นำเข้า shelters หลายรายการ
export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ token
    const token = extractToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { shelters } = body;

    if (!Array.isArray(shelters) || shelters.length === 0) {
      return NextResponse.json(
        { success: false, message: 'shelters array is required' },
        { status: 400 }
      );
    }

    // เตรียมข้อมูลสำหรับ insert
    const sheltersToInsert = shelters.map(s => ({
      name: s.name,
      province: s.province || '',
      district: s.district || '',
      address: s.address || '',
      capacity: parseInt(s.capacity) || 0,
      currentPeople: parseInt(s.currentPeople) || 0,
      phone: s.phone || '',
      contactName: s.contactName || '',
      contactPhone: s.contactPhone || s.phone || '',
      status: s.status || 'normal',
      shelterType: s.shelterType || 'ศูนย์พักพิงหลัก',
      latitude: s.latitude || s.location?.lat || 0,
      longitude: s.longitude || s.location?.lng || 0,
      location: s.location || { lat: 0, lng: 0 }
    }));

    // Insert หลายรายการพร้อมกัน
    const result = await Shelter.insertMany(sheltersToInsert, { ordered: false });

    return NextResponse.json({
      success: true,
      message: `นำเข้าสำเร็จ ${result.length} รายการ`,
      data: {
        inserted: result.length,
        total: shelters.length
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Bulk insert error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'มีข้อมูลซ้ำในระบบ' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
