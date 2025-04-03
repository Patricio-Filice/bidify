import { NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';

// GET /api/collections/[id]/bids
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const { collectionId } = await params;

  const bids = await prisma.bid.findMany({
    where: { collectionId },
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({
    items: bids
  });
}

// POST /api/collections/[id]/bids
export async function POST(
  request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const [ body, { collectionId } ] = await Promise.all([
    request.json(),
    params
  ])
  
  // Verify collection exists and if it's owner is not creating a bid
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId }
  });
  
  if (!collection) {
    return NextResponse.json(
      { error: 'Collection not found' },
      { status: 404 }
    );
  }

  const bid = await prisma.bid.create({
    data: {
      price: parseFloat(body.price),
      collectionId: collectionId,
      // Should be retrieved from session instead of body
      userId: "1671786a-cf77-4798-937d-6c6a84d02e20",
      status: 'PENDING'
    }
  });

  return NextResponse.json(bid);
}
