import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Match from '@/models/Match';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const matches = await Match.find({})
      .populate('teamA', 'name image')
      .populate('teamB', 'name image')
      .sort({ date: 1, time: 1 });
    
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