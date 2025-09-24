import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Job } from "../services/seed/jobsSeed";
import type { Assessment } from "../services/seed/assessmentsSeed";

interface AssessmentResultsProps {}

const AssessmentResults: React.FC<AssessmentResultsProps> = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
    loadResponses();
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobResponse, assessmentResponse] = await Promise.all([
        axios.get(`/jobs/${jobId}`),
        axios.get(`/assessments?jobId=${jobId}`),
      ]);

      setJob(jobResponse.data);

      const assessments = assessmentResponse.data.data;
      if (assessments.length > 0) {
        setAssessment(assessments[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = () => {
    if (assessment) {
      const savedResponses = localStorage.getItem(
        `assessment-responses-${assessment.id}`
      );
      if (savedResponses) {
        setResponses(JSON.parse(savedResponses));
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!job || !assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Assessment not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Results
          </h1>
          <button
            onClick={() => navigate("/dashboard/assessments")}
            className="px-4 py-2 text-gray-900 border cursor-pointer  border-gray-300 rounded-lg hover:bg-gray-50 hover:text-emerald-500 "
          >
            Back
          </button>
        </div>

        <p className="text-gray-600">
          {job.title} • {job.jobType} • {job.location}
        </p>
        {assessment.description && (
          <p className="text-gray-500 mt-2">{assessment.description}</p>
        )}
      </div>

      <div className="space-y-8">
        {assessment.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              {sectionIndex + 1}. {section.title}
            </h2>

            <div className="space-y-6">
              {section.questions.map((question, questionIndex) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {questionIndex + 1}. {question.question}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  <div className="bg-gray-50 p-3 rounded border">
                    {question.type === "single-choice" && (
                      <p className="text-sm text-gray-900">
                        {responses[question.id] || "No response"}
                      </p>
                    )}

                    {question.type === "multi-choice" && (
                      <div className="text-sm text-gray-900">
                        {responses[question.id] &&
                        Array.isArray(responses[question.id]) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {responses[question.id].map(
                              (option: string, index: number) => (
                                <li key={index}>{option}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          "No response"
                        )}
                      </div>
                    )}

                    {(question.type === "short-text" ||
                      question.type === "long-text") && (
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {responses[question.id] || "No response"}
                      </p>
                    )}

                    {question.type === "numeric" && (
                      <p className="text-sm text-gray-900">
                        {responses[question.id] || "No response"}
                      </p>
                    )}

                    {question.type === "file-upload" && (
                      <p className="text-sm text-gray-900">
                        {responses[question.id] || "No file uploaded"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Assessment completed on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
