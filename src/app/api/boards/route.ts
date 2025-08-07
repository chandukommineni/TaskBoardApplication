import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Board from '@/models/Board';
import Task from '@/models/Task';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const boards = await Board.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    // Get task counts for each board
    const boardsWithCounts = await Promise.all(
      boards.map(async (board) => {
        const totalTasks = await Task.countDocuments({ boardId: board._id });
        const completedTasks = await Task.countDocuments({ 
          boardId: board._id, 
          status: 'completed' 
        });
        
        return {
          ...board.toObject(),
          totalTasks,
          completedTasks,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: boardsWithCounts,
    });
  } catch (error) {
    console.error('Get boards error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Board name is required' },
        { status: 400 }
      );
    }

    const board = await Board.create({
      name,
      description,
      userId: user.userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Board created successfully',
      data: board,
    });
  } catch (error) {
    console.error('Create board error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}