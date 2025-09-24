import { faker } from '@faker-js/faker';

faker.seed(98765);

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  question: string;
  options?: string[];
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: string | string[];
  };
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: {
    id: string;
    title: string;
    questions: Question[];
  }[];
  createdAt: Date;
}

function generateQuestion(sectionIndex: number, questionIndex: number): Question {
  const types: Question['type'][] = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric'];
  const type = faker.helpers.arrayElement(types);
  
  const baseQuestion: Question = {
    id: `q-${sectionIndex}-${questionIndex}`,
    type,
    question: faker.lorem.sentence() + '?',
    required: faker.datatype.boolean(0.7), // 70% required
  };

  if (type === 'single-choice' || type === 'multi-choice') {
    baseQuestion.options = Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, 
      () => faker.lorem.words(2)
    );
  }

  if (type === 'short-text' || 'long-text') {
    baseQuestion.validation = {
      minLength: faker.number.int({ min: 5, max: 20 }),
      maxLength: faker.number.int({ min: 50, max: 500 })
    };
  }

  if (type === 'numeric') {
    baseQuestion.validation = {
      min: faker.number.int({ min: 0, max: 10 }),
      max: faker.number.int({ min: 10, max: 100 })
    };
  }

  return baseQuestion;
}

function generateAssessment(jobId: string): Assessment {
  const sectionsCount = faker.number.int({ min: 2, max: 4 });
  
  return {
    id: `assessment-${jobId}`,
    jobId,
    title: `Assessment for ${jobId}`,
    description: faker.lorem.paragraph(),
    sections: Array.from({ length: sectionsCount }, (_, sectionIndex) => ({
      id: `section-${sectionIndex}`,
      title: faker.lorem.words(3),
      questions: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, 
        (_, questionIndex) => generateQuestion(sectionIndex, questionIndex)
      )
    })),
    createdAt: faker.date.past({ years: 1 })
  };
}

// Generate assessments for first 3 jobs
const jobIds = ['job-1', 'job-2', 'job-3'];
export const assessmentsSeed: Assessment[] = jobIds.map(jobId => generateAssessment(jobId));
