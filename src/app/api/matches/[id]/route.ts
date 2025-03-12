import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Match from '@/models/Match';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const { status } = data;
    
    await connectToDatabase();
    
    // Find match by ID and update status
    const match = await Match.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match status:', error);
    return NextResponse.json(
      { message: 'Error updating match status' },
      { status: 500 }
    );
  }
}