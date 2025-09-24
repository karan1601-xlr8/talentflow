import Dexie, { type EntityTable } from 'dexie';
import { type Assessment, assessmentsSeed } from '../seed/assessmentsSeed';

class AssessmentsDB extends Dexie {
  assessments!: EntityTable<Assessment, 'id'>;

  constructor() {
    super('AssessmentsDB');
    this.version(1).stores({
      assessments: '&id, jobId'
    });
  }
}

export const assessmentsDb = new AssessmentsDB();

export const initializeAssessments = async () => {
  try {
    const assessmentsCount = await assessmentsDb.assessments.count();
    if(assessmentsCount > 0) {
      return;
    }

    await assessmentsDb.assessments.clear();
    await assessmentsDb.assessments.bulkAdd(assessmentsSeed);
    // console.log(`Seeded ${assessmentsSeed.length} assessments`);
  
  } catch (error) {
    console.error("Error initializing assessments:", error);
    // throw error;
  }
};

export const getAssessmentByJobId = async (jobId: string) => {
  return assessmentsDb.assessments.where('jobId').equals(jobId).first();
};

export const getAllAssessments = async () => {
  const assessments = await assessmentsDb.assessments.toArray();
  // console.log("getAllAssessments - Retrieved from database:", assessments);
  return assessments;
};

export const saveAssessment = async (assessment: Assessment) => {
  // console.log("Saving assessment to database:", assessment);
  await assessmentsDb.assessments.put(assessment);
  
  // Verify it was saved
  // const saved = await assessmentsDb.assessments.get(assessment.id);
  // console.log("Verification - Assessment saved:", saved);
  
  return assessment;
};

export const submitAssessmentResponse = async (jobId: string, responses: Record<string, any>) => {
  // Store responses in localStorage for this demo
  localStorage.setItem(`assessment-response-${jobId}`, JSON.stringify({
    responses,
    submittedAt: new Date()
  }));
  return { success: true };
};

// Dashboard statistics functions
export const getAssessmentStatistics = async () => {
  const allAssessments = await assessmentsDb.assessments.toArray();
  
  // Count completed assessments (those with responses in localStorage)
  let completedCount = 0;
  for (const assessment of allAssessments) {
    const response = localStorage.getItem(`assessment-response-${assessment.jobId}`);
    if (response) {
      completedCount++;
    }
  }
  
  return {
    totalAssessments: allAssessments.length,
    completedAssessments: completedCount,
    pendingAssessments: allAssessments.length - completedCount
  };
};

export const deleteAssessment = async (id: string) => {
  await assessmentsDb.assessments.delete(id);
  return true;
};