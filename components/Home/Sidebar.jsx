"use client";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context"; // Accessing global state context

const Sidebar = ({ Jobs }) => {
 // filter handling in client side only 

  const { setPageLevelLoader, setFilterData } = useContext(GlobalContext); // Access global functions
  const [filters, setFilters] = useState({
    jobType: [],
    category: [],
    industry: [],
    experienceRange: [],
    salaryRange: [], // New salary range filter
    sortBy: "latest",
  });

  useEffect(() => {
    setPageLevelLoader(false); // Set loader to false when the component mounts
  }, [setPageLevelLoader]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => {
      const prevTypeValues = prevFilters[type] || [];
      const updatedValues = prevTypeValues.includes(value)
        ? prevTypeValues.filter((item) => item !== value) // Remove value
        : [...prevTypeValues, value]; // Add value

      return {
        ...prevFilters,
        [type]: updatedValues, // Update the specific filter type
      };
    });
  };

  // Function to filter jobs
  const filterJobs = () => {
    let filtered = [...Jobs];

    // Apply filters
    if (filters.jobType.length > 0) {
      filtered = filtered.filter((job) => filters.jobType.includes(job.jobType.toLowerCase()));
    }

    if (filters.experienceRange.length > 0) {
      filtered = filtered.filter((job) =>
        filters.experienceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return max ? job.experience >= min && job.experience <= max : job.experience >= min;
        })
      );
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((job) => filters.category.includes(job.category));
    }

    if (filters.industry.length > 0) {
      filtered = filtered.filter((job) => filters.industry.includes(job.industry));
    }

    if (filters.salaryRange.length > 0) {
      filtered = filtered.filter((job) =>
        filters.salaryRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return max ? job.salary >= min && job.salary <= max : job.salary >= min;
        })
      );
    }

    // Sorting logic
    if (filters.sortBy === "latest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "salary") {
      filtered = filtered.sort((a, b) => b.salary - a.salary);
    } else if (filters.sortBy === "experience") {
      filtered = filtered.sort((a, b) => a.experience - b.experience);
    }

    // Update the global state with the filtered jobs
    setFilterData(filtered);
  };

  useEffect(() => {
    filterJobs(); // Call filtering whenever filters or jobs change
  }, [filters, Jobs]);

  return (
<>
      <div className="w-full md:w-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Job Filters</h2>
      </div>

      {/* Sort By */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md sm:text-lg font-semibold mb-1">Sort By</h3>
        <select
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
          value={filters.sortBy}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="latest">Latest</option>
          <option value="salary">Salary</option>
          <option value="experience">Experience Level</option>
        </select>
      </div>

      {/* Job Type */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md sm:text-lg font-semibold mb-1">Job Type</h3>
        {["Remote", "Offline"].map((type) => (
          <label key={type} className="flex items-center">
            <input
              type="checkbox"
              value={type.toLowerCase()}
              onChange={(e) => handleFilterChange("jobType", e.target.value)}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Experience Range */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md font-semibold mb-1">Experience Range</h3>
        {["0-2", "3-5", "6-8", "9+"].map((range) => (
          <label key={range} className="flex items-center">
            <input
              type="checkbox"
              value={range}
              onChange={(e) => handleFilterChange("experienceRange", e.target.value)}
              className="mr-2"
            />
            {range} years
          </label>
        ))}
      </div>

      {/* Salary Range */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md font-semibold mb-1">Salary Range</h3>
        {["0-50000", "50001-100000", "100001-150000", "150000+"].map((range) => (
          <label key={range} className="flex items-center">
            <input
              type="checkbox"
              value={range}
              onChange={(e) => handleFilterChange("salaryRange", e.target.value)}
              className="mr-2"
            />
            {range.replace("-", " - ").replace("150000+", "150,000+")}
          </label>
        ))}
      </div>

      {/* Category */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md font-semibold mb-1">Category</h3>
        {["Technology", "Marketing", "Finance", "Human Resources", "Sales"].map((category) => (
          <label key={category} className="flex items-center">
            <input
              type="checkbox"
              value={category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="mr-2"
            />
            {category}
          </label>
        ))}
      </div>

      {/* Industry */}
      <div className="w-full md:w-auto mb-4">
        <h3 className="text-md font-semibold mb-1">Industry</h3>
        {["Tech", "Manufacturing", "Healthcare", "Finance"].map((industry) => (
          <label key={industry} className="flex items-center">
            <input
              type="checkbox"
              value={industry}
              onChange={(e) => handleFilterChange("industry", e.target.value)}
              className="mr-2"
            />
            {industry}
          </label>
        ))}
      </div>
      </>
  );
};

export default Sidebar;