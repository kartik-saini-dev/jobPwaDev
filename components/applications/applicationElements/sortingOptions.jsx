"use client";
const SortingOptions = ({ sortKey, setSortKey }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
      <span className="font-semibold text-sm sm:text-base mb-2 sm:mb-0">Sort by:</span>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        className="border p-2 rounded-md text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="title">Job Title</option>
        <option value="salary">Salary</option>
      </select>
    </div>
  );
};

export default SortingOptions;
