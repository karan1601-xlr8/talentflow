import Dexie, { type EntityTable } from 'dexie';
import { type Job, jobsSeed } from '../seed/jobsSeed';

class JobsDB extends Dexie {
  jobs!: EntityTable<Job, 'id'>;

  constructor() {
    super('JobsDB');
    this.version(3).stores({
      jobs: '&id, slug, status, order, title, jobType, createdAt'
    });

    // ✅ Auto-seed database on first creation
    this.on('populate', async () => {
      try {
        console.log("JobsDB: Populating with seed data...");
        await this.jobs.bulkAdd(jobsSeed);
      } catch (err) {
        console.error("JobsDB populate error:", err);
      }
    });
  }
}

export const jobsDb = new JobsDB();

// ✅ Keep initializeJobs in case you want to force refresh manually
export const initializeJobs = async () => {
  try {
    const jobsCount = await jobsDb.jobs.count();
    if (jobsCount > 0) {
      return;
    }

    await jobsDb.jobs.clear();
    await jobsDb.jobs.bulkAdd(jobsSeed);

  } catch (error) {
    console.error("initializeJobs: Error initializing jobs:", error);
  }
};

export const getAllJobs = async (params?: {
  search?: string;
  status?: string;
  jobType?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    let query = jobsDb.jobs.orderBy('createdAt');

    if (params?.status) {
      query = query.filter(job => job.status === params.status);
    }

    if (params?.jobType && params.jobType !== 'All') {
      query = query.filter(job => job.jobType === params.jobType);
    }

    if (params?.search) {
      query = query.filter(job =>
        job.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(params.search!.toLowerCase()))
      );
    }

    const jobs = await query.toArray();

    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      return {
        data: jobs.slice(start, end),
        total: jobs.length,
        page: params.page,
        pageSize: params.pageSize
      };
    }

    return { data: jobs, total: jobs.length };
  } catch (error) {
    console.error("getAllJobs: Error fetching jobs:", error);
    return { data: [], total: 0 };
  }
};

export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'slug' | 'order'>) => {
  const count = await jobsDb.jobs.count();
  const slug = jobData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 4);

  const newJob: Job = {
    ...jobData,
    id: `job-${Date.now()}`,
    slug,
    order: count,
    createdAt: new Date()
  };
  await jobsDb.jobs.add(newJob);
  return newJob;
};

export const updateJob = async (id: string, updates: Partial<Job>) => {
  await jobsDb.jobs.update(id, updates);
  return jobsDb.jobs.get(id);
};

export const reorderJob = async (id: string, data: { fromOrder: number; toOrder: number }) => {
  await jobsDb.jobs.update(id, { order: data.toOrder });
  return jobsDb.jobs.get(id);
};

export const deleteJob = async (id: string) => {
  await jobsDb.jobs.delete(id);
  return true;
};

// Dashboard statistics functions
export const getJobStatistics = async () => {
  const allJobs = await jobsDb.jobs.toArray();
  const activeJobs = allJobs.filter(job => job.status === 'active');

  return {
    totalJobs: allJobs.length,
    activeJobs: activeJobs.length,
    archivedJobs: allJobs.length - activeJobs.length
  };
};
