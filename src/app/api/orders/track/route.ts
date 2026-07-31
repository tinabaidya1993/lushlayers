import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const rawOrderId = searchParams.get('orderId') || '';

    const orderId = rawOrderId.trim().toUpperCase().replace('#', '');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Find order by orderId
    const order = await Order.findOne({
      orderId: { $regex: new RegExp(`^${orderId}$`, 'i') },
    });

    if (!order) {
      return NextResponse.json({ error: `No active order found with ID "${orderId}". Please check your Order ID.` }, { status: 404 });
    }

    const isClosed = order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Cancelled';

    if (isClosed) {
      return NextResponse.json({
        success: true,
        isClosed: true,
        orderId: order.orderId,
        status: order.status,
        customerName: order.customerDetails?.customerName || 'Valued Guest',
        cakeName: order.cakeSnapshot?.cakeName || 'Custom Cake',
        message: 'This order has been completed & delivered. Live tracking is closed for completed orders.',
      });
    }

    return NextResponse.json({
      success: true,
      isClosed: false,
      order: {
        orderId: order.orderId,
        status: order.status,
        customerDetails: {
          customerName: order.customerDetails.customerName,
          deliveryAddress: order.customerDetails.deliveryAddress,
          deliveryDate: order.customerDetails.deliveryDate,
          deliveryTime: order.customerDetails.deliveryTime,
        },
        cakeSnapshot: order.cakeSnapshot,
        selectedOptions: order.selectedOptions,
        estimatedPrice: order.estimatedPrice,
        createdAt: order.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error tracking order' }, { status: 500 });
  }
}
