import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Match, { MatchStatus, MatchPhase, IMatch } from '@/models/Match';
import Team, { ITeam } from '@/models/Team';
import mongoose, { Error } from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const { teamAScore, teamBScore } = await request.json();

    if (typeof teamAScore !== 'number' || typeof teamBScore !== 'number') {
      return NextResponse.json(
        { message: 'Invalid score values' },
        { status: 400 }
      );
    }
    
    // Find the match first without population
    const match = await Match.findById(id);
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    // Update match status and scores
    match.status = MatchStatus.FINISHED;
    match.teamAScore = teamAScore;
    match.teamBScore = teamBScore;
    
    await match.save();
    
    // Only update team stats for group stage matches
    if (match.phase === MatchPhase.GROUP) {
      // Get team ids from the match
      const teamAId = match.teamA as mongoose.Types.ObjectId;
      const teamBId = match.teamB as mongoose.Types.ObjectId;
      
      // Find both teams separately using their IDs
      const teamA = await Team.findById(teamAId);
      const teamB = await Team.findById(teamBId);
      
      if (!teamA || !teamB) {
        return NextResponse.json(
          { message: 'One or both teams not found' },
          { status: 404 }
        );
      }
      
      // Update played matches count
      teamA.groupStageDetails.playedMatches += 1;
      teamB.groupStageDetails.playedMatches += 1;
      
      // Update goals
      teamA.goalsScored += teamAScore;
      teamA.goalsAccepted += teamBScore;
      teamA.groupStageDetails.goalsFor += teamAScore;
      teamA.groupStageDetails.goalsAgainst += teamBScore;
      
      teamB.goalsScored += teamBScore;
      teamB.goalsAccepted += teamAScore;
      teamB.groupStageDetails.goalsFor += teamBScore;
      teamB.groupStageDetails.goalsAgainst += teamAScore;
      
      // Determine match result and update stats
      if (teamAScore > teamBScore) {
        // Team A wins
        teamA.wins += 1;
        teamA.groupStageDetails.wins += 1;
        teamA.groupStageDetails.points += 3;
        
        teamB.losses += 1;
        teamB.groupStageDetails.losses += 1;
      } else if (teamAScore < teamBScore) {
        // Team B wins
        teamB.wins += 1;
        teamB.groupStageDetails.wins += 1;
        teamB.groupStageDetails.points += 3;
        
        teamA.losses += 1;
        teamA.groupStageDetails.losses += 1;
      } else {
        // Draw
        teamA.draws += 1;
        teamA.groupStageDetails.draws += 1;
        teamA.groupStageDetails.points += 1;
        
        teamB.draws += 1;
        teamB.groupStageDetails.draws += 1;
        teamB.groupStageDetails.points += 1;
      }
      
      // Save updated team stats
      await teamA.save();
      await teamB.save();
    }
    
    // Return the updated match with populated team references for the response
    const updatedMatch = await Match.findById(id)
      .populate('teamA', 'name image')
      .populate('teamB', 'name image');
    
    return NextResponse.json({ 
      message: 'Match ended successfully', 
      match: updatedMatch 
    });
  } catch (error: Error | any) {
    console.error('Error ending match:', error);
    return NextResponse.json(
      { message: 'Error ending match', error: error.message },
      { status: 500 }
    );
  }
}