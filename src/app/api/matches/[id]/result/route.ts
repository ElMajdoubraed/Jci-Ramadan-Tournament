import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Match, { MatchStatus } from '@/models/Match';
import Team from '@/models/Team';
import mongoose from 'mongoose';

export async function PUT(
    request: Request,
) {
  try {
    await connectToDatabase();
    const id = 'request.query.id;'
    const data = await request.json();
    const { teamAScore, teamBScore, teamAPlayerGoals, teamBPlayerGoals, status } = data;
    
    // Update match with new scores and status
    const match = await Match.findById(id);
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }
    
    match.teamAScore = teamAScore;
    match.teamBScore = teamBScore;
    match.teamAPlayerGoals = teamAPlayerGoals;
    match.teamBPlayerGoals = teamBPlayerGoals;
    match.status = status;
    
    if (status === MatchStatus.FINISHED) {
      // Start a MongoDB session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Get the team documents
        const teamA = await Team.findById(match.teamA);
        const teamB = await Team.findById(match.teamB);
        
        if (!teamA || !teamB) {
          await session.abortTransaction();
          session.endSession();
          return NextResponse.json(
            { message: 'One or both teams not found' },
            { status: 404 }
          );
        }
        
        // Update teamA stats
        teamA.goalsScored += teamAScore;
        teamA.goalsAccepted += teamBScore;
        
        // Update teamB stats
        teamB.goalsScored += teamBScore;
        teamB.goalsAccepted += teamAScore;
        
        // Update wins, draws, losses
        if (teamAScore > teamBScore) {
          // Team A wins
          teamA.wins += 1;
          teamB.losses += 1;
          
          // Update group stage details if match is in group phase
          if (match.phase === 'group') {
            teamA.groupStageDetails.wins += 1;
            teamA.groupStageDetails.points += 3;
            teamB.groupStageDetails.losses += 1;
          }
        } else if (teamAScore < teamBScore) {
          // Team B wins
          teamB.wins += 1;
          teamA.losses += 1;
          
          // Update group stage details if match is in group phase
          if (match.phase === 'group') {
            teamB.groupStageDetails.wins += 1;
            teamB.groupStageDetails.points += 3;
            teamA.groupStageDetails.losses += 1;
          }
        } else {
          // Draw
          teamA.draws += 1;
          teamB.draws += 1;
          
          // Update group stage details if match is in group phase
          if (match.phase === 'group') {
            teamA.groupStageDetails.draws += 1;
            teamA.groupStageDetails.points += 1;
            teamB.groupStageDetails.draws += 1;
            teamB.groupStageDetails.points += 1;
          }
        }
        
        // Update group stage played matches and goals
        if (match.phase === 'group') {
          teamA.groupStageDetails.playedMatches += 1;
          teamA.groupStageDetails.goalsFor += teamAScore;
          teamA.groupStageDetails.goalsAgainst += teamBScore;
          
          teamB.groupStageDetails.playedMatches += 1;
          teamB.groupStageDetails.goalsFor += teamBScore;
          teamB.groupStageDetails.goalsAgainst += teamAScore;
        }
        
        // Save updates
        await teamA.save({ session });
        await teamB.save({ session });
        await match.save({ session });
        
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        
        return NextResponse.json(match);
      } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } else {
      // If not finished, just save the match
      await match.save();
      return NextResponse.json(match);
    }
  } catch (error) {
    console.error('Error updating match result:', error);
    return NextResponse.json(
      { message: 'Error updating match result' },
      { status: 500 }
    );
  }
}