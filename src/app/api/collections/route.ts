import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const name = decodeURIComponent(searchParams.get('name') || '');

  const where = name ? {
    name: {
      contains: name,
      mode: 'insensitive'
    }
  } : undefined

  const [collections, total] = await Promise.all([
    prisma.collection.findMany({
      where: where as never,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: {
          select: { name: true }
        }
      }
    }),
    prisma.collection.count({ where: where as never })
  ]);

  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    items: collections,
    meta: {
      total,
      page,
      limit,
      totalPages: totalPages,
      nextPage: totalPages === page ? null : `api/collections?page=${page + 1}&limit=${limit}${name ? '&name=' + encodeURIComponent(name) : ''}`
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }

  const collection = await prisma.collection.create({
    data: {
      name: body.name,
      description: body.description,
      stocks: parseInt(body.stocks),
      price: parseFloat(body.price),
      ownerId: session.user.id
    }
  });

  return NextResponse.json(collection);
}