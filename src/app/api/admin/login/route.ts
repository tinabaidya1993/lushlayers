import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import { comparePassword, hashPassword, signJwtToken, setAuthCookie } from '@/lib/auth';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 Minutes lockout

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    // Auto-seed default Master Admin if database has no admin users yet
    let admin = await AdminUser.findOne({ email: normalizedEmail });

    if (!admin) {
      const totalAdmins = await AdminUser.countDocuments({});
      if (totalAdmins === 0 && normalizedEmail === 'admin@lushlayers.com') {
        const hashedPassword = await hashPassword('admin123');
        admin = await AdminUser.create({
          email: 'admin@lushlayers.com',
          password: hashedPassword,
          name: 'Master Pastry Chef',
          role: 'Super Admin',
        });
      } else {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }
    }

    // Check account lockout status
    if (admin.lockUntil && admin.lockUntil.getTime() > Date.now()) {
      const remainingMins = Math.ceil((admin.lockUntil.getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json(
        { error: `Account locked due to multiple failed attempts. Please try again in ${remainingMins} minute(s).` },
        { status: 429 }
      );
    }

    // Verify Password
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }
      await admin.save();

      return NextResponse.json(
        { error: `Invalid credentials. (${MAX_LOGIN_ATTEMPTS - admin.loginAttempts} attempt(s) remaining)` },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Sign JWT Token
    const token = signJwtToken({
      userId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Return response with HttpOnly Cookie
    const res = NextResponse.json({
      success: true,
      user: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    return setAuthCookie(res, token);
  } catch (error: any) {
    console.error('Admin login API error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}
