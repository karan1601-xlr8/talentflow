import { http, HttpResponse } from 'msw';
import { getAssessmentByJobId, saveAssessment, submitAssessmentResponse, getAllAssessments, deleteAssessment } from '../db/assessmentsDb';
import { delay, maybeFail } from '../../utils/latency';

export const assessmentsHandlers = [
  http.get('/assessments', async () => {
    await delay();
    
    // Get all assessments from the database
    const assessments = await getAllAssessments();
    // console.log("GET /assessments - Found assessments:", assessments);
    
    return HttpResponse.json({
      data: assessments,
      total: assessments.length
    });
  }),

  http.post('/assessments', async ({ request }) => {
    await delay();
    maybeFail();
    
    const assessmentData = await request.json() as any;
    // console.log("assessmentData", assessmentData);
    
    const savedAssessment = await saveAssessment(assessmentData);
    // console.log("savedAssessment", savedAssessment);
    
    return HttpResponse.json(savedAssessment);
  }),

  http.get('/assessments/:jobId', async ({ params }) => {
    await delay();
    console.log('getAssessmentByJobId', params.jobId);
    
    const assessment = await getAssessmentByJobId(params.jobId as string);
    return HttpResponse.json(assessment);
  }),

  http.put('/assessments/:jobId', async ({ request }) => {
    await delay();
    maybeFail();
    
    const assessmentData = await request.json() as any;
    const savedAssessment = await saveAssessment(assessmentData);
    return HttpResponse.json(savedAssessment);
  }),

  http.post('/assessments/:jobId/submit', async ({ params, request }) => {
    await delay();
    maybeFail();
    
    const responses = await request.json() as any;
    const result = await submitAssessmentResponse(params.jobId as string, responses);
    return HttpResponse.json(result);
  }),

  http.delete('/assessments/:id', async ({ params }) => {
    await delay();
    maybeFail();
    await deleteAssessment(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
