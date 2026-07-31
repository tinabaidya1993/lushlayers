import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/models/Order';
import { BOUTIQUE_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validation
    const { customerName, phoneNumber, deliveryAddress, deliveryDate, deliveryTime } = body.customerDetails || {};
    const { cakeName, image } = body.cakeSnapshot || {};
    const { weight, flavor, estimatedPrice } = body;

    if (!customerName || !phoneNumber || !deliveryAddress || !cakeName) {
      return NextResponse.json(
        { error: 'Customer Name, Mobile Number, Delivery Address, and Cake Name are required.' },
        { status: 400 }
      );
    }

    const orderId = `LL-${Date.now().toString().slice(-6)}`;

    // 2. Generate Clean Professional WhatsApp Message
    const textMessage = `✨ *LUSH LAYERS (MADE WITH LOVE) — CONFIRMED ORDER* ✨
Order ID: #${orderId}

👤 *Customer Name:* ${customerName}
📞 *Phone:* ${phoneNumber}
📍 *Delivery Address:* ${deliveryAddress}
📅 *Delivery Date:* ${deliveryDate || 'As soon as possible'}
⏰ *Time Slot:* ${deliveryTime || 'Standard Delivery'}

🎂 *Cake:* ${cakeName}
⚖️ *Weight/Size:* ${weight || 'Standard'}
🍫 *Flavor:* ${flavor || 'Signature Vanilla/Chocolate'}
🔷 *Shape:* ${body.selectedOptions?.shape || 'Classic Round'}
🎨 *Theme Color:* ${body.selectedOptions?.themeColor || 'Ivory & Gold'}

✍️ *Cake Plaque Message:* "${body.selectedOptions?.cakeMessage || 'None'}"
${body.selectedOptions?.referenceImageUrl ? `📷 *Reference Image:* ${body.selectedOptions.referenceImageUrl}\n` : ''}${body.selectedOptions?.specialNotes ? `📝 *Special Instructions:* ${body.selectedOptions.specialNotes}\n` : ''}
💰 *Estimated Price:* ₹${(estimatedPrice || 0).toLocaleString()}

Please confirm availability for my date & send payment confirmation. Thank you! ❤️💫`;

    const targetWhatsAppNumber = process.env.WHATSAPP_NUMBER || BOUTIQUE_WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(textMessage)}`;

    // 3. Save Order to MongoDB Atlas
    await connectToDatabase();
    const orderDoc = await Order.create({
      orderId,
      customerDetails: {
        customerName,
        phoneNumber,
        deliveryAddress,
        deliveryDate: deliveryDate || 'Flexible',
        deliveryTime: deliveryTime || 'Morning Slot',
      },
      cakeSnapshot: {
        cakeId: body.cakeSnapshot?.cakeId || '',
        cakeName,
        cakeCategory: body.cakeSnapshot?.cakeCategory || 'signature',
        image: image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      },
      selectedOptions: {
        weight: weight || '1.5 kg',
        flavor: flavor || 'Signature',
        shape: body.selectedOptions?.shape || 'Round',
        creamType: body.selectedOptions?.creamType || 'Swiss Meringue Buttercream',
        themeColor: body.selectedOptions?.themeColor || 'Ivory & Gold',
        cakeMessage: body.selectedOptions?.cakeMessage || '',
        referenceImageUrl: body.selectedOptions?.referenceImageUrl || '',
        specialNotes: body.selectedOptions?.specialNotes || '',
      },
      estimatedPrice: estimatedPrice || 0,
      generatedWhatsAppMessage: textMessage,
      status: 'New',
    });

    return NextResponse.json({
      success: true,
      orderId,
      whatsappUrl,
      order: orderDoc,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    const query: any = {};
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: body.orderId },
      { status: body.status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  }
}
