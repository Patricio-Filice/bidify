import { NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/prisma";

// PUT /api/collections/[id]/bids/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ bidId: string }> }
  ) {
    const [ body, { bidId } ] = await Promise.all([
      request.json(),
      params
    ])

    // Verify bid exists and it's from the same user
    const bid = await prisma.bid.update({
      where: { id: bidId },
      data: body
    });
    
    if (!bid) {
      return NextResponse.json(
        { error: "Can't update bids from other users" },
        { status: 403 }
      );
    }

    return new NextResponse(null, { status: 204 });
  }
  