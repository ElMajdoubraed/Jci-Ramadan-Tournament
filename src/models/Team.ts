import mongoose, { Schema, Document, model, Model } from 'mongoose';

// Define enum for team groups
export enum TeamGroup {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

// Define interface for GroupStageDetails
export interface IGroupStageDetails {
  points: number;
  playedMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number; // GF (Goals For)
  goalsAgainst: number; // GA (Goals Against)
}

// Define interface for Team document
export interface ITeam extends Document {
  name: string;
  image: string;
  group: TeamGroup;
  goalsScored: number;
  goalsAccepted: number;
  captainName: string;
  wins: number;
  draws: number;
  losses: number;
  groupStageDetails: IGroupStageDetails;
}

// Define schema for GroupStageDetails
const GroupStageDetailsSchema = new Schema<IGroupStageDetails>({
  points: { type: Number, default: 0 },
  playedMatches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 }
});

// Define schema for Team
const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  group: { 
    type: String, 
    enum: Object.values(TeamGroup), 
    required: true 
  },
  goalsScored: { type: Number, default: 0 },
  goalsAccepted: { type: Number, default: 0 },
  captainName: { type: String, required: true },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  groupStageDetails: { 
    type: GroupStageDetailsSchema, 
    default: () => ({}) 
  }
}, {
  timestamps: true
});

const TeamModel = (mongoose.models?.Team as Model<ITeam>) || 
  mongoose.model<ITeam>('Team', TeamSchema);

// Use this safer export pattern
export default TeamModel;