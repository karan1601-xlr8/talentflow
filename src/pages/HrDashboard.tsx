import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardStatistics {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  newCandidates: number;
  totalAssessments: number;
  completedAssessments: number;
  interviewsScheduled: number;
  offersPending: number;
  hiredCandidates: number;
}

const HrDashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    newCandidates: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    interviewsScheduled: 0,
    offersPending: 0,
    hiredCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/dashboard/statistics");
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconColor,
    bgColor,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    bgColor: string;
  }) => (
    <div className="bg-white border border-emerald-300 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 ${bgColor} rounded-lg`}>
            <div className={`md:w-6 md:h-6 w-4 h-4 ${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-4">
            <h3 className="text-nowrap font-medium text-gray-900">{title}</h3>
            <p className="text-xs font-semibold text-emerald-600/70">
              {" "}
              {subtitle}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="md:text-lg lg:text-xl font-bold text-gray-900">
            {value}
          </div>
          {/* {trend && <div className="text-sm text-emerald-600">{trend}</div>} */}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HR Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to your HR management dashboard
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
        <p className="text-gray-600">Welcome to your HR dashboard</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Jobs"
          value={statistics.totalJobs}
          subtitle={`${statistics.activeJobs} active`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          }
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />

        <StatCard
          title="Candidates"
          value={statistics.totalCandidates}
          subtitle={`${statistics.hiredCandidates} hired`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />

        <StatCard
          title="Assessments"
          value={statistics.totalAssessments}
          subtitle={`${statistics.completedAssessments} completed`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />

        <StatCard
          title="Interviews"
          value={statistics.interviewsScheduled}
          subtitle={`${statistics.offersPending} offers pending`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          }
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/dashboard/candidates")}
            className="bg-white rounded-lg shadow-sm border border-emerald-300 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="md:text-lg text-base font-medium text-gray-900">
                  Candidates
                </h3>
                <p className="md:text-sm text-xs text-gray-500">
                  Manage your candidate pipeline
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/jobs")}
            className="bg-white rounded-lg shadow-sm border border-emerald-300 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="md:text-lg text-base font-medium text-gray-900">
                  Jobs
                </h3>
                <p className="md:text-sm text-xs text-gray-500">
                  Create and manage job postings
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/assessments")}
            className="bg-white rounded-lg shadow-sm border border-emerald-300 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="md:text-lg text-base font-medium text-gray-900">
                  Assessments
                </h3>
                <p className="md:text-sm text-xs text-gray-500">
                  Create candidate assessments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-emerald-300 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="md:text-sm text-xs text-gray-600">
              {statistics.newCandidates} new candidates applied this week
            </span>
            <span className="text-xs text-gray-400 ml-auto">This week</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="md:text-sm text-xs text-gray-600">
              {statistics.completedAssessments} assessments completed
            </span>
            <span className="text-xs text-gray-400 ml-auto">This week</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="md:text-sm text-xs text-gray-600">
              {statistics.activeJobs} active job postings
            </span>
            <span className="text-xs text-gray-400 ml-auto">Current</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="md:text-sm text-xs text-gray-600">
              {statistics.interviewsScheduled} interviews scheduled
            </span>
            <span className="text-xs text-gray-400 ml-auto">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
