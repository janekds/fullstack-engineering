import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('VAPI Webhook received:', body);

    // Verify webhook authenticity (optional - add VAPI webhook secret verification)
    const webhookSecret = process.env.VAPI_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-vapi-signature');
      // Add signature verification logic here if needed
    }

    // Handle different webhook events
    const { type, call } = body;

    if (type === 'end-of-call-report' && call) {
      const supabase = await createSupabaseServerClient();
      
      // Extract call data
      const {
        id: callId,
        transcript,
        recordingUrl,
        cost,
        status,
        createdAt,
        endedAt,
        artifact,
        metadata
      } = call;

      // Try to find existing interview record by call ID first
      let { data: existingInterview, error: findError } = await supabase
        .from('interviews')
        .select('*')
        .eq('vapi_call_id', callId)
        .single();

      // If not found by call ID, try to find by user and recent timestamp
      if (!existingInterview && metadata?.userId) {
        const { data: userInterview } = await supabase
          .from('interviews')
          .select('*')
          .eq('user_id', metadata.userId)
          .is('vapi_call_id', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        existingInterview = userInterview;
      }

      if (existingInterview) {
        // Update existing interview with complete call data
        const { error: updateError } = await supabase
          .from('interviews')
          .update({
            transcript: transcript || existingInterview.transcript,
            audio_url: recordingUrl || artifact?.recordingUrl,
            recording_url: recordingUrl || artifact?.recordingUrl,
            vapi_call_data: call,
            call_cost: cost,
            call_status: status,
            completed_at: endedAt || new Date().toISOString()
          })
          .eq('vapi_call_id', callId);

        if (updateError) {
          console.error('Error updating interview:', updateError);
          return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
        }

        console.log('Updated interview with VAPI call data:', callId);
      } else {
        console.log('No existing interview found for call ID:', callId);
        // Could create a new interview record here if needed
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('VAPI webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
