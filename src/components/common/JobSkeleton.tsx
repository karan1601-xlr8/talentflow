const SimpleJobSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Search filters skeleton */}
      <div className="mb-6 space-y-4">
        <div className="h-12 bg-gray-300 rounded-lg"></div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-300 rounded w-24"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-28"></div>
        </div>
      </div>

      {/* Job cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="space-y-3">
              {/* Company */}
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>

              {/* Title */}
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>

              {/* Type and location */}
              <div className="flex gap-2">
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                <div className="h-6 bg-gray-300 rounded-full w-24"></div>
              </div>

              {/* Salary */}
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>

              {/* Tags */}
              <div className="flex gap-2">
                <div className="h-5 bg-gray-300 rounded w-16"></div>
                <div className="h-5 bg-gray-300 rounded w-20"></div>
                <div className="h-5 bg-gray-300 rounded w-12"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              </div>

              {/* Button */}
              <div className="h-10 bg-gray-300 rounded w-28"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleJobSkeleton;
