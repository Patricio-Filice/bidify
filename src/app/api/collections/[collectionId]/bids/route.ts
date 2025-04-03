import { NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

  const session = await getServerSession(authOptions);
      
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }
  
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId }
  });
  
  if (!collection) {
    return NextResponse.json(
      { error: 'Collection not found' },
      { status: 404 }
    );
  }

  if (collection.ownerId === session.user.id) {
    return NextResponse.json({ error: "Can't place a bid on your own collection" }, { status: 400 })
  }

  const bid = await prisma.bid.create({
    data: {
      price: parseFloat(body.price),
      collectionId: collectionId,
      userId: session.user.id,
      status: 'PENDING'
    }
  });

  return NextResponse.json(bid);
}
