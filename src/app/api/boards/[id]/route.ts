import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Board from '@/models/Board';
import Task from '@/models/Task';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  const params=await context.params
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const board = await Board.findOne({ 
      _id: params.id, 
      userId: user.userId 
    });

    if (!board) {
      return NextResponse.json(
        { success: false, message: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error('Get board error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) { 
  const params=await context.params
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { name, description } = await request.json();

    const board = await Board.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      { name, description },
      { new: true }
    );

    if (!board) {
      return NextResponse.json(
        { success: false, message: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Board updated successfully',
      data: board,
    });
  } catch (error) {
    console.error('Update board error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) { 
  const params=await context.params
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const board = await Board.findOneAndDelete({
      _id: params.id,
      userId: user.userId,
    });

    if (!board) {
      return NextResponse.json(
        { success: false, message: 'Board not found' },
        { status: 404 }
      );
    }

    // Also delete all tasks in this board
    await Task.deleteMany({ boardId:  params.id });

    return NextResponse.json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}