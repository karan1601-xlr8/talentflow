import React, { useState } from "react";
import axios from "axios";
import { type Job } from "../../services/seed/jobsSeed";
import { toast } from "react-hot-toast";

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    coverLetter: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidateName.trim()) {
      newErrors.candidateName = "Name is required";
    }

    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = "Please enter a valid email";
    }

    if (!formData.candidatePhone.trim()) {
      newErrors.candidatePhone = "Phone number is required";
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const candidateData = {
        jobId: job.id,
        name: formData.candidateName,
        email: formData.candidateEmail,
        phone: formData.candidatePhone,
        resume: "", // Will be set by the system
        coverLetter: formData.coverLetter,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        stage: "applied" as const,
      };

      await axios.post("/applications", candidateData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-emerald-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Apply for Position
              </h2>
              <p className="text-gray-600">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateName: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.candidateName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.candidateName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.candidateName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.candidateEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateEmail: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.candidateEmail ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.candidateEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.candidateEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.candidatePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, candidatePhone: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.candidatePhone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.candidatePhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.candidatePhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Bachelor's in Computer Science"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Experience
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe your relevant work experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="React, TypeScript, Node.js, Python"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter *
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.coverLetter ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.coverLetter}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 cursor-pointer text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 cursor-pointer bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
