import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Team from '@/models/Team';
import Match from '@/models/Match';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const stage = searchParams.get('stage');

    await connectToDatabase();

    let query = {};

    // If date is provided, filter by that date
    if (date) {
      const formattedDate = new Date(date).toISOString()
      console.log('formattedDate:', formattedDate);
      query = { date: formattedDate };
    } else if (stage) {
      let phase = stage;
      if (stage === 'Quarterfinals') {
        phase = 'quarter';
      } else if (stage === 'Semifinals') {
        phase = 'semi';
      } else if (stage === 'Final') {
        phase = 'final';
      }
      query = { phase };
    }

    const teams = await Team.find();

    // Find matches with optional date filter
    const matches = await Match.find(query)
      .populate('teamA', 'name image')
      .populate('teamB', 'name image')
      .sort({ date: -1, time: 1 });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { message: 'Error fetching matches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newMatch = new Match(data);
    const savedMatch = await newMatch.save();
    return NextResponse.json(savedMatch, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { message: 'Error creating match' },
      { status: 400 }
    );
  }
}