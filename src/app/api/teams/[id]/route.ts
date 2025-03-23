import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Team from '@/models/Team';
import Match from '@/models/Match';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params;
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid team ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find team by ID
    const team = await Team.findById(id);
    
    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json(
      { message: 'Error fetching team details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params;
    const data = await request.json();
    
    await connectToDatabase();
    
    // Find team by ID and update with provided data
    const team = await Team.findByIdAndUpdate(id, data, { new: true });
    
    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { message: 'Error updating team' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params;
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid team ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find team by ID and delete
    const team = await Team.findByIdAndDelete(id);
    
    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { message: 'Error deleting team' },
      { status: 500 }
    );
  }
}