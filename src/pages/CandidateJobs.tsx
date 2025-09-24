import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Job } from "../services/seed/jobsSeed";
import JobCard from "../components/common/JobCard";
import { Button } from "../components/ui/Button";
import SimpleJobSkeleton from "../components/common/JobSkeleton";

interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  pageSize: number;
}

const CandidateJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize] = useState(12);

  const jobTypes = ["All", "Full-time", "Remote", "Part-time", "Contract"];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<JobsResponse>("/jobs", {
        params: {
          search,
          status: "active",
          page: currentPage,
          pageSize,
        },
      });

      // Sort jobs by createdAt date (newest first)
      const jobsData = response.data?.data || [];
      const sortedJobs = jobsData.sort(
        (a: Job, b: Job) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setJobs(sortedJobs);
      setTotalJobs(response.data.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, currentPage, pageSize]);

  const filteredJobs =
    selectedType === "All"
      ? jobs
      : jobs.filter((job) => job.jobType === selectedType);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleApplyToJob = (jobId: string) => {
    // Navigate to job details page or open application modal
    navigate(`/jobs/${jobId}`);
  };

  const totalPages = Math.ceil(totalJobs / pageSize);

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SimpleJobSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-emerald-600">
                Available Jobs
              </h1>
              <p className="text-emerald-600/90">
                Find your next career opportunity
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:bg-gray-100 hover:text-emerald-600"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs by title or tags..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {totalJobs} jobs
            {search && ` for "${search}"`}
            {selectedType !== "All" && ` in ${selectedType}`}
          </p>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="relative flex flex-col justify-between"
                >
                  <JobCard job={job} />
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApplyToJob(job.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Apply to Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalJobs)} of {totalJobs}{" "}
                    jobs
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 cursor-pointer text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 cursor-pointer text-sm border rounded-md ${
                          currentPage === i + 1
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateJobs;
