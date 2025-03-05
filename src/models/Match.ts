import mongoose, { Schema, Document } from 'mongoose';
import { ITeam } from './Team';

// Define enums for match status and phase
export enum MatchStatus {
  FINISHED = 'finished',
  LIVE = 'live',
  COMING = 'coming'
}

export enum MatchPhase {
  GROUP = 'group',
  ROUND_OF_16 = '1/8',
  QUARTER = 'quarter',
  SEMI = 'semi',
  FINAL = 'final'
}

// Define interface for Match document
export interface IMatch extends Document {
  date: Date;
  time: string;
  teamA: mongoose.Types.ObjectId | ITeam;
  teamB: mongoose.Types.ObjectId | ITeam;
  teamAScore: number;
  teamBScore: number;
  teamAPlayerGoals: string[];
  teamBPlayerGoals: string[];
  status: MatchStatus;
  phase: MatchPhase;
}

// Define schema for Match
const MatchSchema = new Schema<IMatch>({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  teamA: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team',
    required: true 
  },
  teamB: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team',
    required: true 
  },
  teamAScore: { type: Number, default: 0 },
  teamBScore: { type: Number, default: 0 },
  teamAPlayerGoals: [{ type: String }],
  teamBPlayerGoals: [{ type: String }],
  status: { 
    type: String, 
    enum: Object.values(MatchStatus), 
    default: MatchStatus.COMING,
    required: true 
  },
  phase: { 
    type: String, 
    enum: Object.values(MatchPhase), 
    required: true 
  }
}, {
  timestamps: true
});

// Check if model already exists (useful for Next.js hot reloading)
export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);