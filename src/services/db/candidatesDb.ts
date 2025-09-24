import Dexie, { type EntityTable } from 'dexie';
import { type Candidate, candidatesSeed } from '../seed/candidateSeed';

class CandidatesDB extends Dexie {
  candidates!: EntityTable<Candidate, 'id'>;

  constructor() {
    super('CandidatesDB');
    this.version(1).stores({
      candidates: '&id, email, stage, jobId, name, appliedAt, updatedAt'
    });
  }
}

export const candidatesDb = new CandidatesDB();

// Add debugging functions to window object in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).clearCandidatesDB = async () => {
    // console.log('Clearing candidates database...');
    await candidatesDb.candidates.clear();
    // console.log('Database cleared');
  };
  
  (window as any).reinitializeCandidates = async () => {
    // console.log('Re-initializing candidates...');
    await candidatesDb.candidates.clear();
    await initializeCandidates();
    // console.log('Re-initialization complete');
  };
}

export const initializeCandidates = async () => {
  try {
    const candidatesCount = await candidatesDb.candidates.count();
    if(candidatesCount > 0) {
      return;
    }

    // console.log('Initializing candidates database...');
    
    // Clear existing database to ensure fresh start with new schema
    await candidatesDb.candidates.clear();
    // console.log('Database cleared for fresh start');
    
    // Seed candidates
    // console.log('Seeding candidates...');
    await candidatesDb.candidates.bulkAdd(candidatesSeed);
    // console.log(`Seeded ${candidatesSeed.length} candidates`);
    
    // Verify seeding
    // const count = await candidatesDb.candidates.count();
    // console.log('Final candidate count:', count);
  } catch (error) {
    // console.error('Error initializing candidates:', error);
    throw error;
  }
};

export const getAllCandidates = async (params?: {
  search?: string;
  stage?: string;
  page?: number;
  pageSize?: number;
  jobId?: string;
}) => {
  try {
    let query = candidatesDb.candidates.orderBy('appliedAt').reverse();
    
    if (params?.stage) {
      query = query.filter(candidate => candidate.stage === params.stage);
    }
    
    if (params?.jobId) {
      query = query.filter(candidate => candidate.jobId === params.jobId);
    }
    
    if (params?.search) {
      query = query.filter(candidate => 
        candidate.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        candidate.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const candidates = await query.toArray();
    
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      return {
        data: candidates.slice(start, end),
        total: candidates.length,
        page: params.page,
        pageSize: params.pageSize
      };
    }
    
    return { data: candidates, total: candidates.length };
  } catch (error) {
    console.error('Error in getAllCandidates:', error);
    // Return empty result instead of throwing
    return { data: [], total: 0 };
  }
};

export const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
  await candidatesDb.candidates.update(id, { ...updates, updatedAt: new Date() });
  return candidatesDb.candidates.get(id);
};

export const getCandidateTimeline = async (id: string) => {
  const candidate = await candidatesDb.candidates.get(id);
  if (!candidate) return null;
  
  // Mock timeline data - in real app, you'd store stage change history
  return [
    { stage: 'applied', date: candidate.appliedAt, note: 'Application submitted' },
    { stage: candidate.stage, date: candidate.updatedAt, note: `Moved to ${candidate.stage}` }
  ];
};

// Dashboard statistics functions
export const getCandidateStatistics = async () => {
  const allCandidates = await candidatesDb.candidates.toArray();
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const newCandidates = allCandidates.filter(candidate => 
    new Date(candidate.appliedAt) >= oneWeekAgo
  );
  
  const stageCounts = allCandidates.reduce((acc, candidate) => {
    acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCandidates: allCandidates.length,
    newCandidates: newCandidates.length,
    stageCounts
  };
};

// Application-specific functions (merged from applicationsDb)
export const createCandidateApplication = async (applicationData: Omit<Candidate, 'id' | 'appliedAt' | 'updatedAt' | 'notes'>) => {
  const newCandidate: Candidate = {
    ...applicationData,
    id: `candidate-new-${Date.now()}`,
    appliedAt: new Date(),
    updatedAt: new Date(),
    notes: [],
    stage: 'applied'
  };
  
  // console.log('createCandidateApplication: Creating new candidate application:', newCandidate);
  await candidatesDb.candidates.add(newCandidate);
  
  // Verify the candidate was added
  // const count = await candidatesDb.candidates.count();
  // console.log(`createCandidateApplication: Total candidates after creation: ${count}`);
  
  return newCandidate;
};

export const getCandidatesByStatus = async (status: Candidate['stage']) => {
  return await candidatesDb.candidates
    .where('stage')
    .equals(status)
    .reverse()
    .sortBy('appliedAt');
};

export const updateCandidateStatus = async (candidateId: string, status: Candidate['stage']) => {
  await candidatesDb.candidates.update(candidateId, { stage: status, updatedAt: new Date() });
  return candidatesDb.candidates.get(candidateId);
};

export const deleteCandidate = async (candidateId: string) => {
  await candidatesDb.candidates.delete(candidateId);
  return true;
};

export const getApplicationStatistics = async () => {
  const allCandidates = await candidatesDb.candidates.toArray();
  // console.log(`getApplicationStatistics: Found ${allCandidates.length} total candidates`);
  
  const stats = {
    totalApplications: allCandidates.length,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    hired: 0
  };
  
  allCandidates.forEach(candidate => {
    stats[candidate.stage]++;
  });
  
  // console.log('getApplicationStatistics: Stats:', stats);
  return stats;
};