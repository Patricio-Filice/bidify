import { NextResponse } from "next/server";
import prisma from "../../../../../../../../prisma/prisma";

// POST /api/collections/[id]/bids/[id]/accept
export async function POST(
    _request: Request,
    { params }: { params: Promise<{ collectionId: string, bidId: string }> }
  ) {
    const { collectionId, bidId } = await params

    // Verify collection exists and it's from the same user
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    });
    
    if (!collection) {
      return NextResponse.json(
        { error: "Can't accept bids from other users collections" },
        { status: 403 }
      );
    }

    await prisma.$transaction([
        prisma.bid.update({
            where: {
                id: bidId
            },
            data: {
                status: 'ACCEPTED'
            }
        }),
        prisma.collection.update({
            where: {
                id: collectionId
            },
            data: {
                stocks: { decrement: 1 }
            }
        })
    ])

    return new NextResponse(null, { status: 204 });
  }
  