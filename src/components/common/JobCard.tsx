import React from "react";
import type { Job } from "../../services/seed/jobsSeed";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-emerald-100 text-emerald-800";
      case "Remote":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-yellow-100 text-yellow-800";
      case "Contract":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleJobCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border hover:border-emerald-200 cursor-pointer group">
      <div onClick={handleJobCardClick} className="flex items-start space-x-4">
        {/* Job Type Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">
            {job.jobType?.charAt(0) || "J"}
          </span>
        </div>

        {/* Job Details */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 md:text-lg sm:text-base text-sm group-hover:text-emerald-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 md:text-sm text-xs">
                {job.jobType || "Job"}
              </p>
            </div>
            <div className="md:text-right text-nowrap">
              <p className="md:text-sm text-xs font-semibold text-gray-900">
                {job.salary}
              </p>
              <p className="text-gray-500 text-xs">
                {formatDate(job.createdAt.toString())}
              </p>
            </div>
          </div>

          <p className="text-gray-600 sm:text-sm text-xs mb-3 line-clamp-2">
            {job.description}
          </p>

          <div className="flex md:flex-row flex-col gap-3 md:items-center items-start justify-between">
            <div className="flex md:items-center items-start space-x-2 text-sm text-gray-500">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="md:text-sm text-xs">{job.location}</span>
            </div>

            <div className="flex md:items-center items-start space-x-2">
              {job.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
