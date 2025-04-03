import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ collectionId: string }> }
  ) {
    const { collectionId } = await params
    const body = await request.json()
    
    const collection = await prisma.collection.update({
      where: {
        id: collectionId
      },
      data: body
    });

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
    
    // Validate if exists and if user can see it
    const collection = await prisma.collection.delete({
      where: {
        id: collectionId
      }
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }
  
    return new NextResponse(null, { status: 204 });;
  }
  