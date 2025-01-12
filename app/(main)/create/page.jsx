import dynamic from "next/dynamic";

const CreateJob = dynamic(() => import("@/components/Jobs/CreateJob"), { ssr: false });

export default function CreateJobPage() {
  return <CreateJob />;
}
