import { http, HttpResponse } from 'msw';
import { 
  getAllCandidates, 
  updateCandidate, 
  getCandidateTimeline, 
  createCandidateApplication,
  updateCandidateStatus,
  deleteCandidate,
  getApplicationStatistics,
  candidatesDb 
} from '../db/candidatesDb';
import { delay } from '../../utils/latency';

export const candidatesHandlers = [
  // Existing candidate endpoints
  http.get('/candidates', async ({ request }) => {
    await delay();
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const jobId = url.searchParams.get('jobId') || '';
    
    // For kanban board, we want all candidates without pagination
    // Only use pagination if explicitly requested with both page and pageSize
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');
    
    let result;
    if (page && pageSize) {
      // Use pagination only when both page and pageSize are provided
      result = await getAllCandidates({ 
        search, 
        stage, 
        jobId, 
        page: parseInt(page), 
        pageSize: parseInt(pageSize) 
      });
    } else {
      // Return all candidates without pagination for kanban board
      result = await getAllCandidates({ search, stage, jobId });
    }
    
    return HttpResponse.json(result);
  }),

  http.get('/candidates/:id', async ({ params }) => {
    await delay();
    
    const candidate = await candidatesDb.candidates.get(params.id as string);
    return HttpResponse.json(candidate);
  }),

  http.get('/candidates/:id/timeline', async ({ params }) => {
    await delay();
    
    const timeline = await getCandidateTimeline(params.id as string);
    return HttpResponse.json(timeline);
  }),

  http.patch('/candidates/:id', async ({ params, request }) => {
    await delay();
    
    const updates = await request.json() as any;
    const updatedCandidate = await updateCandidate(params.id as string, updates);
    return HttpResponse.json(updatedCandidate);
  }),

  http.post('/candidates', async ({ request }) => {
    await delay();
    
    const candidateData = await request.json() as any;
    const newCandidate = await candidatesDb.candidates.add({
      ...candidateData,
      id: `candidate-${Date.now()}`,
      appliedAt: new Date(),
      updatedAt: new Date(),
    });
    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  // Merged application endpoints (now using candidates)
  http.get('/applications', async ({ request }) => {
    await delay();
    
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId') || url.searchParams.get('job');
    
    // Use getAllCandidates with jobId filter to get applications
    const result = await getAllCandidates(jobId ? { jobId } : {});
    return HttpResponse.json(result.data);
  }),

  http.get('/applications/statistics', async () => {
    await delay();
    const stats = await getApplicationStatistics();
    return HttpResponse.json(stats);
  }),

  http.post('/applications', async ({ request }) => {
    await delay();
    
    const applicationData = await request.json() as any;
    const newCandidate = await createCandidateApplication(applicationData);
    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  http.patch('/applications/:id/status', async ({ params, request }) => {
    await delay();
    
    const { status } = await request.json() as { status: string };
    const updatedCandidate = await updateCandidateStatus(params.id as string, status as any);
    return HttpResponse.json(updatedCandidate);
  }),

  http.patch('/applications/:id', async ({ params, request }) => {
    await delay();
    
    const updates = await request.json() as any;
    const updatedCandidate = await updateCandidate(params.id as string, updates);
    return HttpResponse.json(updatedCandidate);
  }),

  http.delete('/applications/:id', async ({ params }) => {
    await delay();
    
    await deleteCandidate(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];