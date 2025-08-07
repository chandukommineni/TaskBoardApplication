import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Board from '@/models/Board';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Verify board belongs to user
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

    const tasks = await Task.find({ 
      boardId: params.id,
      userId: user.userId 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Verify board belongs to user
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

    const { title, description, dueDate } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Task title is required' },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      boardId: params.id,
      userId: user.userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}