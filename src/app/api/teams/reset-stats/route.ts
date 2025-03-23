import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Team from '@/models/Team';
import Match from '@/models/Match';
import { MatchPhase, MatchStatus } from '@/models/Match';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  // Create a Mongoose session for transaction support
  const session = await mongoose.startSession();
  
  try {
    await connectToDatabase();
    session.startTransaction();

    // Step 1: Fetch all teams
    const teams = await Team.find({}).session(session);
    
    // Initialize team stats to zero
    const resetResults = [];
    
    // Step 2: Process each team
    for (const team of teams) {
      try {
        // Reset basic stats
        team.wins = 0;
        team.draws = 0;
        team.losses = 0;
        team.goalsScored = 0;
        team.goalsAccepted = 0;
        
        // Reset group stage details
        if (team.groupStageDetails) {
          team.groupStageDetails.points = 0;
          team.groupStageDetails.playedMatches = 0;
          team.groupStageDetails.wins = 0;
          team.groupStageDetails.draws = 0;
          team.groupStageDetails.losses = 0;
          team.groupStageDetails.goalsFor = 0;
          team.groupStageDetails.goalsAgainst = 0;
        }
        
        // Step 3: Find all finished matches where this team participated
        const teamMatches = await Match.find({
          $or: [
            { teamA: team._id },
            { teamB: team._id }
          ],
          status: MatchStatus.FINISHED
        }).session(session);
        
        // Step 4: Process each match and recalculate stats
        for (const match of teamMatches) {
          // Check if this team is team A or team B
          const isTeamA = match.teamA.toString() === (team._id as any).toString();
          const teamGoals = isTeamA ? match.teamAScore : match.teamBScore;
          const opponentGoals = isTeamA ? match.teamBScore : match.teamAScore;
          
          // Update overall stats
          team.goalsScored += teamGoals;
          team.goalsAccepted += opponentGoals;
          
          if (teamGoals > opponentGoals) {
            team.wins += 1;
          } else if (teamGoals < opponentGoals) {
            team.losses += 1;
          } else {
            team.draws += 1;
          }
          
          // Update group stage stats if match is from group phase
          if (match.phase === MatchPhase.GROUP && team.groupStageDetails) {
            team.groupStageDetails.playedMatches += 1;
            team.groupStageDetails.goalsFor += teamGoals;
            team.groupStageDetails.goalsAgainst += opponentGoals;
            
            if (teamGoals > opponentGoals) {
              team.groupStageDetails.wins += 1;
              team.groupStageDetails.points += 3; // 3 points for a win
            } else if (teamGoals < opponentGoals) {
              team.groupStageDetails.losses += 1;
              // No points for a loss
            } else {
              team.groupStageDetails.draws += 1;
              team.groupStageDetails.points += 1; // 1 point for a draw
            }
          }
        }
        
        // Save the updated team
        await team.save({ session });
        resetResults.push({
          teamId: team._id,
          teamName: team.name,
          status: 'success'
        });
      } catch (error) {
        resetResults.push({
          teamId: team._id,
          teamName: team.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // We continue processing other teams despite errors
        console.error(`Error processing team ${team.name}:`, error);
      }
    }
    
    // Commit the transaction
    await session.commitTransaction();
    
    return NextResponse.json({
      success: true,
      message: 'Team stats have been reset and recalculated',
      results: resetResults
    });
  } catch (error) {
    // If any error occurs during the process, abort the transaction
    await session.abortTransaction();
    console.error('Error resetting team stats:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Error resetting team stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    // End the session
    await session.endSession();
  }
}