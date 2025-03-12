import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Match, { MatchStatus, MatchPhase } from '@/models/Match';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    
    // Build the query - only return finished matches
    let query: any = { status: MatchStatus.FINISHED };
    
    // Filter by stage if provided
    if (stage && stage !== 'All Stages') {
        let phase = '';
        switch (stage) {
          case 'Group Stage':
            phase = MatchPhase.GROUP;
            break;
        case 'Round of 16':
            phase = MatchPhase.ROUND_OF_16;
            break;
        case 'Quarter Finals':
            phase = MatchPhase.QUARTER;
            break;
        case 'Semi Finals':
            phase = MatchPhase.SEMI;
            break;
        case 'Final':
            phase = MatchPhase.FINAL;
            break;
        default:
            phase = stage;
        }
        query.phase = phase;
    }
    
    // Find matches with the query
    const matches = await Match.find(query)
      .populate('teamA')
      .populate('teamB')
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .lean();  // Convert to plain JavaScript objects
    
    // Format the response to match the expected structure in the Results component
    const formattedMatches = matches.map(match => {
      const teamA = match.teamA as any;
      const teamB = match.teamB as any;
      
      return {
        id: match._id,
        date: match.date.toISOString(),
        teamA: teamA.name,
        teamB: teamB.name,
        scoreA: match.teamAScore,
        scoreB: match.teamBScore,
        stage: getStageDisplay(match.phase as MatchPhase),
        group: match.phase === MatchPhase.GROUP ? teamA.group : undefined,
        location: "Tournament Venue", // You might want to add this field to your Match model
        isCompleted: true,
        goals: [
          // Add Team A goals
          ...match.teamAPlayerGoals.map(player => ({
            player,
            team: teamA.name,
            minute: 0 // Since we don't store minutes in the model
          })),
          
          // Add Team B goals
          ...match.teamBPlayerGoals.map(player => ({
            player,
            team: teamB.name,
            minute: 0 // Since we don't store minutes in the model
          }))
        ],
        // Add mock stats since your model doesn't include them
        stats: {
          possession: [50, 50],
          shots: [10, 10],
          shotsOnTarget: [5, 5],
          corners: [5, 5],
          fouls: [10, 10]
        }
      };
    });
    
    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { message: 'Error fetching results' },
      { status: 500 }
    );
  }
}

// Helper function to format match phase for display
function getStageDisplay(phase: MatchPhase): string {
  switch (phase) {
    case MatchPhase.GROUP:
      return 'Group Stage';
    case MatchPhase.ROUND_OF_16:
      return 'Round of 16';
    case MatchPhase.QUARTER:
      return 'Quarter Finals';
    case MatchPhase.SEMI:
      return 'Semi Finals';
    case MatchPhase.FINAL:
      return 'Final';
    default:
      return phase;
  }
}