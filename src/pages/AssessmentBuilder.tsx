import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Job } from "../services/seed/jobsSeed";
import type { Assessment, Question } from "../services/seed/assessmentsSeed";
import toast from "react-hot-toast";

interface AssessmentBuilderProps {}

const AssessmentBuilder: React.FC<AssessmentBuilderProps> = () => {
  const { jobId } = useParams<{ jobId: string }>();
  // console.log("jobId:", jobId);

  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobResponse, assessmentResponse] = await Promise.all([
        axios.get(`/jobs/${jobId}`),
        axios
          .get(`/assessments/${jobId}`)
          .catch(() => ({ data: { data: [] } })),
      ]);

      setJob(jobResponse.data);

      // Load existing assessment or create new one
      const assessments = assessmentResponse.data.data;
      console.log("assessments:", assessments);

      if (assessments) {
        setAssessment(assessments[0]);
      } else {
        // Create new assessment
        const newAssessment: Assessment = {
          id: `assessment-${jobId}`,
          jobId: jobId!,
          title: `Assessment for ${jobResponse.data.title}`,
          description: "",
          sections: [],
          createdAt: new Date(),
        };
        setAssessment(newAssessment);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    if (!assessment) return;

    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${assessment.sections.length + 1}`,
      questions: [],
    };

    setAssessment({
      ...assessment,
      sections: [...assessment.sections, newSection],
    });
    setSelectedSection(newSection.id);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<{ title: string }>
  ) => {
    if (!assessment) return;

    setAssessment({
      ...assessment,
      sections: assessment.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const addQuestion = (sectionId: string, type: Question["type"]) => {
    if (!assessment) return;

    const section = assessment.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newQuestion: Question = {
      id: `q-${sectionId}-${Date.now()}`,
      type,
      question: "",
      required: false,
      options:
        type === "single-choice" || type === "multi-choice"
          ? ["Option 1", "Option 2"]
          : undefined,
      validation:
        type === "short-text" || type === "long-text"
          ? { minLength: 0, maxLength: 1000 }
          : type === "numeric"
          ? { min: 0, max: 100 }
          : undefined,
    };

    setAssessment({
      ...assessment,
      sections: assessment.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    });
    setSelectedQuestion(newQuestion.id);
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    if (!assessment) return;

    setAssessment({
      ...assessment,
      sections: assessment.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : section
      ),
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    if (!assessment) return;

    setAssessment({
      ...assessment,
      sections: assessment.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section
      ),
    });
    setSelectedQuestion(null);
  };

  const deleteSection = (sectionId: string) => {
    if (!assessment) return;

    setAssessment({
      ...assessment,
      sections: assessment.sections.filter((s) => s.id !== sectionId),
    });
    setSelectedSection(null);
  };

  const saveAssessment = async () => {
    if (!assessment) return;

    try {
      // console.log("Saving assessment:", assessment);

      await axios.post("/assessments", assessment);
      toast.success("Assessment saved successfully");
      navigate("/dashboard/assessments");
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateForm = () => {
    if (!assessment) return true;

    for (const section of assessment.sections) {
      for (const question of section.questions) {
        if (question.required && !responses[question.id]) {
          return false;
        }

        if (question.validation) {
          const value = responses[question.id];
          if (value !== undefined && value !== null && value !== "") {
            if (
              question.validation.minLength &&
              value.length < question.validation.minLength
            ) {
              return false;
            }
            if (
              question.validation.maxLength &&
              value.length > question.validation.maxLength
            ) {
              return false;
            }
            if (question.validation.min && value < question.validation.min) {
              return false;
            }
            if (question.validation.max && value > question.validation.max) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const shouldShowQuestion = (question: Question) => {
    if (!question.conditionalOn) return true;

    const conditionalValue = responses[question.conditionalOn.questionId];
    if (Array.isArray(question.conditionalOn.value)) {
      return question.conditionalOn.value.includes(conditionalValue);
    }
    return conditionalValue === question.conditionalOn.value;
  };

  const addConditionalLogic = (
    questionId: string,
    conditionalOn: Question["conditionalOn"]
  ) => {
    if (!assessment || !selectedSection) return;

    updateQuestion(selectedSection, questionId, { conditionalOn });
  };

  const removeConditionalLogic = (questionId: string) => {
    if (!assessment || !selectedSection) return;

    updateQuestion(selectedSection, questionId, { conditionalOn: undefined });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job || !assessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Assessment not found
          </h1>
          <button
            onClick={() => navigate("/dashboard/assessments")}
            className="bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
          <div>
            <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-gray-900 mb-2">
              Assessment Builder
            </h1>
            <p className="sm:text-sm text-xs text-gray-600">
              {job.title} • {job.jobType} • {job.location}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/dashboard/assessments")}
              className="px-4 py-2 cursor-pointer text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span className="md:text-sm text-xs">Cancel</span>
            </button>
            <button
              onClick={saveAssessment}
              className="px-4 py-2 cursor-pointer bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <span className="md:text-sm text-xs">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("builder")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "builder"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="md:text-sm text-xs">Builder</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "preview"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="md:text-sm text-xs">Live Preview</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Builder Panel */}
        {activeTab === "builder" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="sm:text-lg text-base font-medium text-gray-900">
                  Sections
                </h2>
                <button
                  onClick={addSection}
                  className="bg-emerald-600 cursor-pointer text-white px-3 py-1 rounded text-sm hover:bg-emerald-700"
                >
                  <span className="md:text-sm text-xs">Add Section</span>
                </button>
              </div>

              <div className="space-y-4">
                {assessment.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSection === section.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, { title: e.target.value })
                          }
                          className="w-full font-medium text-gray-900 bg-transparent border-none outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <p className="sm:text-sm text-xs text-gray-500 mt-1">
                          {section.questions.length} questions
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-red-600 cursor-pointer hover:text-red-700 ml-2 md:text-sm text-xs"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Builder */}
            {selectedSection && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="sm:text-lg text-base font-medium text-gray-900">
                    Questions
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      onChange={(e) =>
                        addQuestion(
                          selectedSection,
                          e.target.value as Question["type"]
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      defaultValue=""
                    >
                      {/* Fixed: Removed span from option to prevent hydration error */}
                      <option value="" disabled>
                        Add Question
                      </option>
                      <option value="single-choice">Single Choice</option>
                      <option value="multi-choice">Multi Choice</option>
                      <option value="short-text">Short Text</option>
                      <option value="long-text">Long Text</option>
                      <option value="numeric">Numeric</option>
                      <option value="file-upload">File Upload</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {assessment.sections
                    .find((s) => s.id === selectedSection)
                    ?.questions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedQuestion === question.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedQuestion(question.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                  {question.type}
                                </span>
                                {question.required && (
                                  <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="flex items-center text-xs text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) =>
                                      updateQuestion(
                                        selectedSection,
                                        question.id,
                                        { required: e.target.checked }
                                      )
                                    }
                                    className="mr-1"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  Required
                                </label>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(selectedSection, question.id, {
                                  question: e.target.value,
                                })
                              }
                              placeholder="Enter question text..."
                              className="w-full font-medium text-gray-900 bg-transparent border-none outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                            {question.options && (
                              <div className="mt-2 space-y-1">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [
                                          ...question.options!,
                                        ];
                                        newOptions[index] = e.target.value;
                                        updateQuestion(
                                          selectedSection,
                                          question.id,
                                          { options: newOptions }
                                        );
                                      }}
                                      className="flex-1 text-sm text-gray-600 bg-transparent border-none outline-none"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newOptions =
                                          question.options!.filter(
                                            (_, i) => i !== index
                                          );
                                        updateQuestion(
                                          selectedSection,
                                          question.id,
                                          { options: newOptions }
                                        );
                                      }}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newOptions = [
                                      ...question.options!,
                                      "New Option",
                                    ];
                                    updateQuestion(
                                      selectedSection,
                                      question.id,
                                      { options: newOptions }
                                    );
                                  }}
                                  className="text-emerald-600 hover:text-emerald-700 text-sm"
                                >
                                  + Add Option
                                </button>
                              </div>
                            )}

                            {/* Validation Settings */}
                            {(question.type === "short-text" ||
                              question.type === "long-text" ||
                              question.type === "numeric") && (
                              <div className="mt-3 p-3 bg-blue-50 rounded border">
                                <div className="text-sm font-medium text-gray-700 mb-2">
                                  Validation Rules
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {question.type === "short-text" ||
                                  question.type === "long-text" ? (
                                    <>
                                      <div>
                                        <label className="text-xs text-gray-600">
                                          Min Length
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            question.validation?.minLength || ""
                                          }
                                          onChange={(e) =>
                                            updateQuestion(
                                              selectedSection,
                                              question.id,
                                              {
                                                validation: {
                                                  ...question.validation,
                                                  minLength: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                                },
                                              }
                                            )
                                          }
                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600">
                                          Max Length
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            question.validation?.maxLength || ""
                                          }
                                          onChange={(e) =>
                                            updateQuestion(
                                              selectedSection,
                                              question.id,
                                              {
                                                validation: {
                                                  ...question.validation,
                                                  maxLength: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                                },
                                              }
                                            )
                                          }
                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        <label className="text-xs text-gray-600">
                                          Min Value
                                        </label>
                                        <input
                                          type="number"
                                          value={question.validation?.min || ""}
                                          onChange={(e) =>
                                            updateQuestion(
                                              selectedSection,
                                              question.id,
                                              {
                                                validation: {
                                                  ...question.validation,
                                                  min: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                                },
                                              }
                                            )
                                          }
                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600">
                                          Max Value
                                        </label>
                                        <input
                                          type="number"
                                          value={question.validation?.max || ""}
                                          onChange={(e) =>
                                            updateQuestion(
                                              selectedSection,
                                              question.id,
                                              {
                                                validation: {
                                                  ...question.validation,
                                                  max: e.target.value
                                                    ? parseInt(e.target.value)
                                                    : undefined,
                                                },
                                              }
                                            )
                                          }
                                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Conditional Logic Setup */}
                            <div className="mt-3 p-3 bg-gray-50 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Conditional Logic
                                </span>
                                {question.conditionalOn ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeConditionalLogic(question.id);
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Find a previous question to set as condition
                                      const currentSection =
                                        assessment.sections.find(
                                          (s) => s.id === selectedSection
                                        );
                                      const currentQuestionIndex =
                                        currentSection?.questions.findIndex(
                                          (q) => q.id === question.id
                                        );
                                      const previousQuestions =
                                        currentSection?.questions.slice(
                                          0,
                                          currentQuestionIndex
                                        ) || [];

                                      if (previousQuestions.length > 0) {
                                        const firstQuestion =
                                          previousQuestions[0];
                                        if (
                                          firstQuestion.options &&
                                          firstQuestion.options.length > 0
                                        ) {
                                          addConditionalLogic(question.id, {
                                            questionId: firstQuestion.id,
                                            value: firstQuestion.options[0],
                                          });
                                        }
                                      }
                                    }}
                                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                                  >
                                    Add Condition
                                  </button>
                                )}
                              </div>

                              {question.conditionalOn && (
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-600">
                                    Show this question only if:
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <select
                                      value={question.conditionalOn.questionId}
                                      onChange={(e) => {
                                        const currentSection =
                                          assessment.sections.find(
                                            (s) => s.id === selectedSection
                                          );
                                        const selectedQuestion =
                                          currentSection?.questions.find(
                                            (q) => q.id === e.target.value
                                          );
                                        if (
                                          selectedQuestion?.options &&
                                          selectedQuestion.options.length > 0
                                        ) {
                                          addConditionalLogic(question.id, {
                                            questionId: e.target.value,
                                            value: selectedQuestion.options[0],
                                          });
                                        }
                                      }}
                                      className="text-xs border border-gray-300 rounded px-2 py-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {assessment.sections
                                        .find((s) => s.id === selectedSection)
                                        ?.questions.filter(
                                          (q) =>
                                            q.id !== question.id && q.options
                                        )
                                        .map((q) => (
                                          <option key={q.id} value={q.id}>
                                            {q.question.substring(0, 50)}...
                                          </option>
                                        ))}
                                    </select>
                                    <span className="text-xs text-gray-500">
                                      equals
                                    </span>
                                    <select
                                      value={
                                        Array.isArray(
                                          question.conditionalOn.value
                                        )
                                          ? question.conditionalOn.value[0]
                                          : question.conditionalOn.value
                                      }
                                      onChange={(e) => {
                                        const currentSection =
                                          assessment.sections.find(
                                            (s) => s.id === selectedSection
                                          );
                                        const selectedQuestion =
                                          currentSection?.questions.find(
                                            (q) =>
                                              q.id ===
                                              question.conditionalOn!.questionId
                                          );
                                        if (selectedQuestion?.options) {
                                          addConditionalLogic(question.id, {
                                            questionId:
                                              question.conditionalOn!
                                                .questionId,
                                            value: e.target.value,
                                          });
                                        }
                                      }}
                                      className="text-xs border border-gray-300 rounded px-2 py-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {(() => {
                                        const currentSection =
                                          assessment.sections.find(
                                            (s) => s.id === selectedSection
                                          );
                                        const selectedQuestion =
                                          currentSection?.questions.find(
                                            (q) =>
                                              q.id ===
                                              question.conditionalOn!.questionId
                                          );
                                        return (
                                          selectedQuestion?.options?.map(
                                            (option) => (
                                              <option
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </option>
                                            )
                                          ) || []
                                        );
                                      })()}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(selectedSection, question.id);
                            }}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Panel */}
        {activeTab === "preview" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Live Preview
            </h2>

            <div className="space-y-8">
              {assessment.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    {section.title}
                  </h3>

                  {section.questions.map(
                    (question) =>
                      shouldShowQuestion(question) && (
                        <div key={question.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {question.question}
                            {question.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {question.type === "single-choice" &&
                            question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <label
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={option}
                                      checked={
                                        responses[question.id] === option
                                      }
                                      onChange={(e) =>
                                        handleResponseChange(
                                          question.id,
                                          e.target.value
                                        )
                                      }
                                      className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {option}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            )}

                          {question.type === "multi-choice" &&
                            question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <label
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        responses[question.id]?.includes(
                                          option
                                        ) || false
                                      }
                                      onChange={(e) => {
                                        const currentValues =
                                          responses[question.id] || [];
                                        const newValues = e.target.checked
                                          ? [...currentValues, option]
                                          : currentValues.filter(
                                              (v: any) => v !== option
                                            );
                                        handleResponseChange(
                                          question.id,
                                          newValues
                                        );
                                      }}
                                      className="mr-2"
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
                                handleResponseChange(
                                  question.id,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Enter your answer..."
                            />
                          )}

                          {question.type === "long-text" && (
                            <textarea
                              value={responses[question.id] || ""}
                              onChange={(e) =>
                                handleResponseChange(
                                  question.id,
                                  e.target.value
                                )
                              }
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Enter your answer..."
                            />
                          )}

                          {question.type === "numeric" && (
                            <input
                              type="number"
                              value={responses[question.id] || ""}
                              onChange={(e) =>
                                handleResponseChange(
                                  question.id,
                                  e.target.value
                                )
                              }
                              min={question.validation?.min}
                              max={question.validation?.max}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Enter a number..."
                            />
                          )}

                          {question.type === "file-upload" && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                            </div>
                          )}

                          {question.validation && (
                            <div className="text-xs text-gray-500">
                              {question.validation.minLength &&
                                `Min length: ${question.validation.minLength}`}
                              {question.validation.maxLength &&
                                `Max length: ${question.validation.maxLength}`}
                              {question.validation.min &&
                                `Min value: ${question.validation.min}`}
                              {question.validation.max &&
                                `Max value: ${question.validation.max}`}
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Form validation: {validateForm() ? "Valid" : "Invalid"}
                </div>
                <button
                  onClick={() => {
                    // Save responses to localStorage
                    localStorage.setItem(
                      `assessment-responses-${assessment.id}`,
                      JSON.stringify(responses)
                    );
                    toast.success("Responses saved locally!");
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;
