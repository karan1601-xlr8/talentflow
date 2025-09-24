import React from "react";
import { FEATURES } from "../../utils/constants";
import Card from "../ui/Card";

const Features: React.FC = () => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case "briefcase":
        return (
          <svg
            className="w-8 h-8"
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
        );
      case "users":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case "message-circle":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        );
      case "clipboard-check":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="features"
      className="flex flex-col gap-10 items-center py-16 lg:py-24 bg-gray-50"
    >
      <div className="flex items-center gap-5">
        <span className="md:w-40 sm:w-25 w-12 h-[2px] bg-gradient-to-r from-white to-emerald-600/70 rounded-full"></span>
        <p className="border md:text-base sm:text-sm text-xs md:px-8 sm:px-6 px-4 py-2 rounded-full drop-shadow-md font-bold uppercase border-emerald-600 text-emerald-800">
          Features
        </p>
        <span className="md:w-40 sm:w-25 w-12 h-[2px] bg-gradient-to-r from-emerald-600/70 to-white rounded-full"></span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Streamline Your Hiring Workflow From Start To Finish
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to make every step of your recruitment
            process more efficient and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.id}
              className="text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-emerald-600 text-white">
                {getFeatureIcon(feature.icon)}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Preview Card */}
              {index === 0 && (
                <div className="mt-6 bg-emerald-600 rounded-xl p-6 text-white">
                  <div className="bg-white rounded-lg p-4 text-left">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                        Microsoft
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Senior Product Manager
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Lead the design and process, from discovery, ideation,
                      prototyping, and final UI & development.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        5+ Positions
                      </span>
                      <span className="md:text-sm text-xs font-semibold text-gray-900">
                        $8,000/Month
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {index === 1 && (
                <div className="mt-6 bg-emerald-100 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold">MA</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="md:text-sm text-xs font-medium text-gray-900">
                          Maria Angelica M
                        </p>
                        <p className="text-xs text-gray-600">
                          Product Designer
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-xs text-gray-600">78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="mt-6 bg-gray-100 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="md:text-sm text-xs font-semibold text-gray-900">
                          Technical Assessment
                        </h4>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          In Progress
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">JavaScript</span>
                          <span className="text-emerald-600 font-medium">
                            85%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">React</span>
                          <span className="text-emerald-600 font-medium">
                            92%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
