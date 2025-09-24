import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../common/JobCard";
import { Button } from "../ui/Button";
import axios from "axios";
import { type Job } from "../../services/seed/jobsSeed";
import SimpleJobSkeleton from "../common/JobSkeleton";

const JobExplore: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(5);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch more jobs to ensure we have enough for sorting
        const response = await axios.get("/jobs?status=active&pageSize=20");

        // Sort jobs by createdAt date (newest first) and take the latest 5
        const jobsData = response.data?.data || [];
        const sortedJobs = jobsData
          .sort(
            (a: Job, b: Job) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setJobs(sortedJobs);
      } catch (error) {
        console.error("JobExplore: Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // console.log(jobs);

  const jobTypes = ["All", "Full-time", "Remote", "Part-time", "Contract"];

  const filteredJobs =
    selectedType === "All"
      ? jobs
      : jobs.filter((job) => job.jobType === selectedType);

  const displayedJobs =
    filteredJobs == undefined ? [] : filteredJobs.slice(0, visibleJobs);

  const loadMore = () => {
    setVisibleJobs((prev) => Math.min(prev + 3, filteredJobs.length));
  };

  const handleBrowseAllJobs = () => {
    navigate("/jobs");
  };

  if (loading) {
    return <SimpleJobSkeleton />;
  }

  return (
    <section
      id="jobs"
      className="flex flex-col items-center gap-10 py-16 lg:py-24 bg-white"
    >
      <div className="flex items-center gap-5">
        <span className="md:w-40 sm:w-25 w-12 h-[2px] bg-gradient-to-r from-white to-emerald-600/70 rounded-full"></span>
        <p className="border md:text-base sm:text-sm text-xs md:px-8 sm:px-6 px-4 py-2 rounded-full drop-shadow-md font-bold uppercase border-emerald-600 text-emerald-800">
          Job Opportunities
        </p>
        <span className="md:w-40 sm:w-25 w-12 h-[2px] bg-gradient-to-r from-emerald-600/70 to-white rounded-full"></span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Explore Available Positions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities posted by top companies. Find
            your perfect match today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setVisibleJobs(3);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedType === type
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleJobs < filteredJobs?.length && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={loadMore}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
            >
              Load More Jobs
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs?.length === 0 && (
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
              Try adjusting your filters to see more opportunities.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Job?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career
            match through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
              onClick={handleBrowseAllJobs}
            >
              Browse All Jobs
            </Button>
            <Button variant="outline" size="lg">
              Create Job Alert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobExplore;
