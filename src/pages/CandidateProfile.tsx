import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Candidate } from "../services/seed/candidateSeed";
import type { Job } from "../services/seed/jobsSeed";
import NotesWithMentions from "../components/NotesWithMentions";

interface TimelineEvent {
  stage: string;
  date: Date;
  note: string;
}

interface CandidateProfileProps {}

const CandidateProfile: React.FC<CandidateProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [newNote, setNewNote] = useState("");

  const stages = [
    { id: "applied", name: "Applied", color: "bg-blue-100 text-blue-800" },
    {
      id: "screening",
      name: "Screening",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "interview",
      name: "Interview",
      color: "bg-purple-100 text-purple-800",
    },
    { id: "offer", name: "Offer", color: "bg-green-100 text-green-800" },
    { id: "rejected", name: "Rejected", color: "bg-red-100 text-red-800" },
    { id: "hired", name: "Hired", color: "bg-emerald-100 text-emerald-800" },
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidateResponse, timelineResponse] = await Promise.all([
        axios.get(`/candidates/${id}`),
        axios.get(`/candidates/${id}/timeline`),
      ]);

      setCandidate(candidateResponse.data);
      setTimeline(timelineResponse.data || []);

      // Fetch job details
      if (candidateResponse.data.jobId) {
        const jobResponse = await axios.get(
          `/jobs/${candidateResponse.data.jobId}`
        );
        setJob(jobResponse.data);
      }

      // Load notes from localStorage
      const savedNotes = localStorage.getItem(`candidate-notes-${id}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: string) => {
    if (!candidate) return;

    try {
      await axios.patch(`/candidates/${candidate.id}`, {
        stage: newStage,
        updatedAt: new Date(),
      });

      // Update local state
      setCandidate((prev) =>
        prev ? { ...prev, stage: newStage as Candidate["stage"] } : null
      );

      // Add to timeline
      const newTimelineEvent: TimelineEvent = {
        stage: newStage,
        date: new Date(),
        note: `Moved to ${
          stages.find((s) => s.id === newStage)?.name || newStage
        }`,
      };
      setTimeline((prev) => [newTimelineEvent, ...prev]);

      // Refresh timeline from server
      const timelineResponse = await axios.get(`/candidates/${id}/timeline`);
      setTimeline(timelineResponse.data || []);
    } catch (error) {
      console.error("Error updating candidate stage:", error);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const noteWithTimestamp = `[${new Date().toLocaleString()}] ${newNote}`;
    const updatedNotes = notes
      ? `${notes}\n\n${noteWithTimestamp}`
      : noteWithTimestamp;

    setNotes(updatedNotes);
    setNewNote("");

    // Save to localStorage
    localStorage.setItem(`candidate-notes-${id}`, updatedNotes);
  };

  const getStageInfo = (stageId: string) => {
    return (
      stages.find((s) => s.id === stageId) || {
        name: stageId,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Candidate not found
          </h1>
          <button
            onClick={() => navigate("/dashboard/candidates")}
            className="bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const currentStageInfo = getStageInfo(candidate.stage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {candidate.name}
            </h1>
            <p className="text-gray-600 mb-2">{candidate.email}</p>
            {job && (
              <p className="text-gray-500">
                Applied for: <span className="font-medium">{job.title}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/dashboard/candidates")}
            className="px-4 py-2 text-gray-700 border cursor-pointer  border-gray-300 rounded-lg hover:bg-gray-50 hover:text-emerald-500 "
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Candidate Details */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Current Status
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${currentStageInfo.color}`}
                >
                  {currentStageInfo.name}
                </span>
                <span className="text-sm text-gray-500">
                  Since {new Date(candidate.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <select
                value={candidate.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Application Details
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Applied Date:
                </span>
                <p className="text-sm text-gray-900">
                  {new Date(candidate.appliedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Last Updated:
                </span>
                <p className="text-sm text-gray-900">
                  {new Date(candidate.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {candidate.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Phone:
                  </span>
                  <p className="text-sm text-gray-900">{candidate.phone}</p>
                </div>
              )}
              {candidate.experience && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Experience:
                  </span>
                  <p className="text-sm text-gray-900">
                    {candidate.experience}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4">
              <NotesWithMentions
                value={newNote}
                onChange={setNewNote}
                placeholder="Add a note about this candidate... (use @ to mention team members)"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
              >
                Add Note
              </button>
              {notes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Previous Notes:
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                      {notes}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-4">
            {timeline.length === 0 ? (
              <p className="text-sm text-gray-500">No timeline events yet.</p>
            ) : (
              timeline.map((event, index) => {
                const stageInfo = getStageInfo(event.stage);
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${stageInfo.color
                          .replace("text-", "bg-")
                          .replace("100", "500")}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${stageInfo.color}`}
                        >
                          {stageInfo.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
