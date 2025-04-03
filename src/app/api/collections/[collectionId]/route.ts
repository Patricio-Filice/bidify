import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ collectionId: string }> }
  ) {
    const { collectionId } = await params
    const body = await request.json()

      const session = await getServerSession(authOptions);
    
      if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
      }
    
    const collection = await prisma.collection.update({
      where: {
        id: collectionId,
        ownerId: session.user.id
      },
      data: body
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }
  
    return NextResponse.json(collection);
  }

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ collectionId: string }> }
  ) {
    const { collectionId } = await params

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const collection = await prisma.collection.delete({
      where: {
        id: collectionId,
        ownerId: session.user.id
      }
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }
  
    return new NextResponse(null, { status: 204 });;
  }
  