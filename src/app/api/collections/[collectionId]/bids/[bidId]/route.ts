import { NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PUT /api/collections/[id]/bids/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ bidId: string }> }
  ) {
    const [ body, { bidId } ] = await Promise.all([
      request.json(),
      params
    ])

    const session = await getServerSession(authOptions);
        
    if (!session) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }
  
    const bid = await prisma.bid.update({
      where: { id: bidId, userId: session.user.id },
      data: body
    });
    
    if (!bid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  }


// DELETE /api/collections/[id]/bids/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bidId: string }> }
) {
  const { bidId } = await params

  const session = await getServerSession(authOptions);
      
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }

  // Verify bid exists and it's from the same user
  const bid = await prisma.bid.delete({
    where: { id: bidId, userId: session.user.id }
  });
  
  if (!bid) {
    return NextResponse.json(
      { error: "Bid not found" },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
}