import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Team from '../../../models/Team';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const teams = await Team.find({}).sort({ 'groupStageDetails.points': -1 });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { message: 'Error fetching teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newTeam = new Team(data);
    const savedTeam = await newTeam.save();
    return NextResponse.json(savedTeam, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { message: 'Error creating team' },
      { status: 400 }
    );
  }
}