export const fetchJobsList = async (id) => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/jobs/getJobs/getJobList?recruiterId=${id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          // Authorization: `Bearer ${Cookies.get("token")}`,
        },
        cache: "no-store",
      });
  
      const data = await response.json();
          
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const fetchJobs = async (id) => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/jobs/getJobs`, {
        method: "GET",
        cache: "no-store",
      });
  
      const data = await response.json();
          
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  
  export const fetchJob = async (id) => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/jobs/getJobs/singleJob?jobId=${id}`, {
        method: "GET",
        cache: "no-store",
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };

