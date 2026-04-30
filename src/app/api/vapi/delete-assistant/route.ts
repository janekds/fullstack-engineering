import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { assistant_id }: { assistant_id: string } = await request.json();

    if (!assistant_id) {
      return NextResponse.json(
        { error: "assistant_id is required" },
        { status: 400 }
      );
    }

    // Get the Vapi API token from environment variables
    const vapiToken = process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY;

    if (!vapiToken) {
      return NextResponse.json(
        { error: "Vapi API token not configured" },
        { status: 500 }
      );
    }

    // Make request to Vapi API to delete the assistant
    const response = await fetch(
      `https://api.vapi.ai/assistant/${assistant_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vapiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Vapi API error:", errorData);
      return NextResponse.json(
        { error: "Failed to delete assistant", details: errorData },
        { status: response.status }
      );
    }

    const deletedAssistant = await response.json();

    return NextResponse.json({
      success: true,
      message: "Assistant deleted successfully",
      assistant_id: deletedAssistant.id,
    });
  } catch (error) {
    console.error("Error deleting assistant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
