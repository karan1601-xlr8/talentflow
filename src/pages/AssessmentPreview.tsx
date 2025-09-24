import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Job } from "../services/seed/jobsSeed";
import type { Assessment, Question } from "../services/seed/assessmentsSeed";
import { toast } from "react-hot-toast";

interface AssessmentPreviewProps {}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error for this question
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateQuestion = (question: Question): string | null => {
    const value = responses[question.id];

    if (
      question.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return "This question is required";
    }

    if (
      question.validation &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      if (
        question.validation.minLength &&
        value.length < question.validation.minLength
      ) {
        return `Minimum length is ${question.validation.minLength} characters`;
      }
      if (
        question.validation.maxLength &&
        value.length > question.validation.maxLength
      ) {
        return `Maximum length is ${question.validation.maxLength} characters`;
      }
      if (question.validation.min && value < question.validation.min) {
        return `Minimum value is ${question.validation.min}`;
      }
      if (question.validation.max && value > question.validation.max) {
        return `Maximum value is ${question.validation.max}`;
      }
    }

    return null;
  };

  const validateForm = () => {
    if (!assessment) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const section of assessment.sections) {
      for (const question of section.questions) {
        if (shouldShowQuestion(question)) {
          const error = validateQuestion(question);
          if (error) {
            newErrors[question.id] = error;
            isValid = false;
          }
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const shouldShowQuestion = (question: Question) => {
    if (!question.conditionalOn) return true;

    const conditionalValue = responses[question.conditionalOn.questionId];
    if (Array.isArray(question.conditionalOn.value)) {
      return question.conditionalOn.value.includes(conditionalValue);
    }
    return conditionalValue === question.conditionalOn.value;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save responses to localStorage
      if (assessment) {
        localStorage.setItem(
          `assessment-responses-${assessment.id}`,
          JSON.stringify(responses)
        );
        localStorage.setItem(`assessment-submitted-${assessment.id}`, "true");
      }
      setSubmitted(true);
      // Redirect to results after a short delay
      setTimeout(() => {
        navigate(`/assessments/results/${jobId}`);
      }, 2000);
    }
  };

  const saveDraft = () => {
    if (assessment) {
      localStorage.setItem(
        `assessment-responses-${assessment.id}`,
        JSON.stringify(responses)
      );
      toast.success("Draft saved successfully!");
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
          <button
            onClick={() => navigate("/jobs")}
            className="bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Assessment Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment for {job.title}. We will
            review your responses and get back to you soon.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-gray-900 mb-2">
                {assessment.title}
              </h1>
              <button
                onClick={() => navigate("/dashboard/assessments")}
                className="px-4 sm:py-2 py-1 text-gray-900 border cursor-pointer  border-gray-300 rounded-lg hover:bg-gray-50 hover:text-emerald-500 "
              >
                Back
              </button>
            </div>
            <p className="sm:text-sm text-xs text-gray-600">
              {job.title} • {job.jobType} • {job.location}
            </p>
            {assessment.description && (
              <p className="text-black mt-2 sm:text-base text-sm">
                Description: {assessment.description}
              </p>
            )}
          </div>
        </div>
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
              {section.questions.map(
                (question, questionIndex) =>
                  shouldShowQuestion(question) && (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {questionIndex + 1}. {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {question.type === "single-choice" &&
                        question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, index) => (
                              <label key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  checked={responses[question.id] === option}
                                  onChange={(e) =>
                                    handleResponseChange(
                                      question.id,
                                      e.target.value
                                    )
                                  }
                                  className="mr-3"
                                />
                                <span className="text-sm text-gray-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                      {question.type === "multi-choice" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  responses[question.id]?.includes(option) ||
                                  false
                                }
                                onChange={(e) => {
                                  const currentValues =
                                    responses[question.id] || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(
                                        (v: any) => v !== option
                                      );
                                  handleResponseChange(question.id, newValues);
                                }}
                                className="mr-3"
                              />
                              <span className="text-sm text-gray-700">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "short-text" && (
                        <input
                          type="text"
                          value={responses[question.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors[question.id]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your answer..."
                        />
                      )}

                      {question.type === "long-text" && (
                        <textarea
                          value={responses[question.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors[question.id]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your answer..."
                        />
                      )}

                      {question.type === "numeric" && (
                        <input
                          type="number"
                          value={responses[question.id] || ""}
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                          min={question.validation?.min}
                          max={question.validation?.max}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors[question.id]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter a number..."
                        />
                      )}

                      {question.type === "file-upload" && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            id={`file-${question.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleResponseChange(question.id, file.name);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-${question.id}`}
                            className="mt-2 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                          >
                            Choose File
                          </label>
                          {responses[question.id] && (
                            <p className="mt-2 text-sm text-gray-600">
                              Selected: {responses[question.id]}
                            </p>
                          )}
                        </div>
                      )}

                      {question.validation && (
                        <div className="text-xs text-gray-500">
                          {question.validation.minLength &&
                            `Min Length: ${question.validation.minLength} `}
                          {question.validation.maxLength &&
                            `Max Length: ${question.validation.maxLength} `}
                          {question.validation.min &&
                            `Min Value: ${question.validation.min} `}
                          {question.validation.max &&
                            `Max Value: ${question.validation.max}`}
                        </div>
                      )}

                      {errors[question.id] && (
                        <p className="text-sm text-red-600">
                          {errors[question.id]}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex sm:flex-row flex-col gap-5 justify-between items-center">
          <div className="text-sm text-gray-500">
            All required questions must be answered before submission
          </div>
          <div className="flex space-x-3 text-nowrap">
            <button
              onClick={saveDraft}
              className="px-4 py-2 cursor-pointer text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 w-full cursor-pointer bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPreview;
