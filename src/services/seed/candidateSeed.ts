import { faker } from '@faker-js/faker';

faker.seed(54321);

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  phone: string;
  resume: string;
  notes: string[];
  appliedAt: Date;
  updatedAt: Date;
  // Application-specific fields
  coverLetter?: string;
  experience?: string;
  skills?: string[];
  education?: string;
}

const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

function generateCandidate(index: number, jobIds: string[]): Candidate {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  // Generate additional application-specific fields
  const techSkills = [
    'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java',
    'TypeScript', 'JavaScript', 'AWS', 'Docker', 'Kubernetes',
    'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API',
    'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Machine Learning', 'Data Science', 'DevOps', 'Frontend', 'Backend'
  ];

  const skills = faker.helpers.arrayElements(techSkills, { min: 2, max: 6 });
  const experience = `Experienced developer with ${faker.number.int({ min: 1, max: 8 })} years of experience in software development. Proficient in ${skills.slice(0, 3).join(', ')}. Strong background in building scalable applications and working in agile environments.`;
  
  const coverLetter = `Dear Hiring Manager,

I am writing to express my interest in the position. With my background in ${skills.slice(0, 2).join(' and ')}, I am confident that I would be a valuable addition to your team.

${faker.lorem.paragraph()}

I am excited about the opportunity to contribute to your organization and would welcome the chance to discuss my qualifications further.

Best regards,
${firstName} ${lastName}`;

  return {
    id: `candidate-${index + 1}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    stage: faker.helpers.arrayElement(stages),
    jobId: faker.helpers.arrayElement(jobIds),
    phone: faker.phone.number(),
    resume: faker.internet.url(),
    notes: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, 
      () => faker.lorem.sentence()
    ),
    appliedAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
    // Application-specific fields
    coverLetter,
    experience,
    skills,
    education: faker.helpers.arrayElement([
      'Bachelor\'s in Computer Science',
      'Master\'s in Software Engineering', 
      'Bachelor\'s in Information Technology',
      'Associate\'s in Computer Programming',
      'Bachelor\'s in Engineering',
      'Master\'s in Computer Science',
      'Bachelor\'s in Mathematics',
      'PhD in Computer Science'
    ])
  };
}

// Generate job IDs for reference
const jobIds = Array.from({ length: 25 }, (_, i) => `job-${i + 1}`);

export const candidatesSeed: Candidate[] = Array.from({ length: 1000 }, 
  (_, i) => generateCandidate(i, jobIds)
);
