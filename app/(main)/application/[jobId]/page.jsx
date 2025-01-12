import JobApplicationList from "@/components/applications";
import { fetchApplicationsList } from '@/services/application';
export const dynamic = "force-dynamic";
// Since this is a server component, we don't need async/await in the function signature.
const JobsApplicationListPage = async ({ params: { jobId } }) => {
    
    try {
        // Fetch applications for the given jobId
        const jobsApplications = await fetchApplicationsList(jobId);
        
    

        return (
            <div className="min-h-screen flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                 
                    {/* List of Job Applications */}
                    <JobApplicationList userJobApplications={jobsApplications.data} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>Error. Please try again later.</p>
            </div>
        );
    }
};

export default JobsApplicationListPage;
