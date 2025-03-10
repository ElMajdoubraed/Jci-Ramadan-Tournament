import mongoose, { Schema, Document, Model, model } from 'mongoose';
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

// Safer model export pattern for Next.js environments
const MatchModel = (mongoose.models?.Match as Model<IMatch>) || 
  mongoose.model<IMatch>('Match', MatchSchema);

export default MatchModel;