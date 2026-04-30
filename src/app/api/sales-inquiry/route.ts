import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSalesInquiryNotification } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, message } = await request.json();

    if (!firstName || !lastName || !email || !company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from("sales_inquiries")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: company,
        message: message || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving sales inquiry:", error);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Send notification email to sales team
    try {
      await sendSalesInquiryNotification(
        firstName,
        lastName,
        email,
        company,
        message || ""
      );
    } catch (emailError) {
      console.error("Failed to send sales notification email:", emailError);
      // Don't fail the API call if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Sales inquiry saved successfully",
        inquiryId: data.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sales-inquiry route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
