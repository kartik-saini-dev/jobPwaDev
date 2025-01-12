export const applyJob = async (applicationDetail) => {
    try {
      const response = await fetch("/api/createApplication", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(applicationDetail),
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const appliedJobsUser = async ({userId,jobId}) => {
    try {
      const response = await fetch(`/api/jobs/appliedJobs?userId=${userId}&jobId=${jobId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
    
  export const fetchApplicationsList = async (jobId) => {
    try {

      const response = await fetch(`${process.env.BASE_URL}/api/jobApplications?jobId=${jobId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
       cache : "no-store"
      });
  
      const data = await response.json();
   
      return data;
    } catch (error) {
      console.log("Error fetching applications:", error); // Log error
    }
  };
  
  export const updateStatusApplication = async (applicationInfo) => {
    try {
      const response = await fetch(`/api/applicationStatus`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(applicationInfo),
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };