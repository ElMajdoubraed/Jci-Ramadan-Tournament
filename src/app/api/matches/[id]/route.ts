import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
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
        { message: 'Invalid match ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find match by ID and populate team data
    const match = await Match.findById(id)
      .populate('teamA')
      .populate('teamB');
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error fetching match details:', error);
    return NextResponse.json(
      { message: 'Error fetching match details' },
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
    
    // Find match by ID and update with provided data
    const match = await Match.findByIdAndUpdate(id, data, { new: true });
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { message: 'Error updating match' },
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
        { message: 'Invalid match ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find match by ID and delete
    const match = await Match.findByIdAndDelete(id);
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { message: 'Error deleting match' },
      { status: 500 }
    );
  }
}