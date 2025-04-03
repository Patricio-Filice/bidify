import { NextResponse } from "next/server";
import prisma from "../../../../../../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/collections/[id]/bids/[id]/accept
export async function POST(
    _request: Request,
    { params }: { params: Promise<{ collectionId: string, bidId: string }> }
  ) {
    const { collectionId, bidId } = await params

    const session = await getServerSession(authOptions);
        
    if (!session) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    });
    
    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    if (collection.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Can't accept bids from other user's collections" },
        { status: 403 }
      );
    }

    if (collection.stocks <= 0) {
      return NextResponse.json(
        { error: "Can't accept bids if the collection is out of stock" },
        { status: 400 }
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
  