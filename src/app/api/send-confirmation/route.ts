import { NextRequest, NextResponse } from 'next/server';
import { sendEmailConfirmation } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, confirmationToken } = await request.json();

    if (!email || !firstName || !confirmationToken) {
      return NextResponse.json(
        { error: 'Email, firstName, and confirmationToken are required' },
        { status: 400 }
      );
    }

    const result = await sendEmailConfirmation(email, firstName, confirmationToken);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json(
        { error: 'Failed to send confirmation email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-confirmation route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
