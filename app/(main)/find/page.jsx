import Sidebar from '@/components/Home/Sidebar';
import Feed from '@/components/Home/Feed';
import News from '@/components/Home/News';
import { fetchJobs } from '@/services/fetchJob';

export default async function Home() {
  try {
    const jobs = await fetchJobs();

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col gap-4 md:flex-wrap md:grid md:grid-cols-12 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="flex md:col-span-12 md:w-full lg:col-span-2 bg-white shadow-md p-4 md:flex-row">
        <div className="w-full md:flex md:flex-row md:flex-wrap lg:flex-col bg-white p-4 shadow-md gap-4">
          <Sidebar Jobs={jobs} />
          </div>
        </div>
    
        {/* Feed and News */}
        <div className="md:col-span-12 lg:col-span-10 md:flex md:flex-wrap gap-4">
          {/* Feed */}
          <div className="md:flex-1 lg:col-span-7 bg-white shadow-md p-4">
            <Feed Jobs={jobs} />
          </div>
    
          {/* News */}
          <div className="md:w-1/4 lg:col-span-3 bg-white shadow-md p-4">
            <News />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error loading jobs. Please try again later.</p>
      </div>
    );
  }
}
