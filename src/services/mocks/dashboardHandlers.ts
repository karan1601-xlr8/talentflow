import { http, HttpResponse } from 'msw';
import { getJobStatistics } from '../db/jobsDb';
import { getCandidateStatistics } from '../db/candidatesDb';
import { getAssessmentStatistics } from '../db/assessmentsDb';
import { getApplicationStatistics } from '../db/candidatesDb';
import { delay } from '../../utils/latency';

export const dashboardHandlers = [
  http.get('/dashboard/statistics', async () => {
    await delay();
    
    const [jobStats, candidateStats, assessmentStats, applicationStats] = await Promise.all([
      getJobStatistics(),
      getCandidateStatistics(),
      getAssessmentStatistics(),
      getApplicationStatistics()
    ]);
    
    const statistics = {
      totalJobs: jobStats.totalJobs,
      activeJobs: jobStats.activeJobs,
      totalCandidates: candidateStats.totalCandidates,
      newCandidates: candidateStats.newCandidates,
      totalAssessments: assessmentStats.totalAssessments,
      completedAssessments: assessmentStats.completedAssessments,
      totalApplications: applicationStats.totalApplications,
      interviewsScheduled: applicationStats.interview,
      offersPending: applicationStats.offer,
      hiredCandidates: applicationStats.hired
    };
    
    return HttpResponse.json(statistics);
  }),
];
