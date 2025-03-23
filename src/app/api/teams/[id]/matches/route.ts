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
        { message: 'Invalid team ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find all matches for the team (where team is either teamA or teamB)
    const matches = await Match.find({
      $or: [
        { teamA: id },
        { teamB: id }
      ]
    })
    .populate('teamA', 'name')
    .populate('teamB', 'name')
    .sort({ date: 1, time: 1 });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching team matches:', error);
    return NextResponse.json(
      { message: 'Error fetching team matches' },
      { status: 500 }
    );
  }
}