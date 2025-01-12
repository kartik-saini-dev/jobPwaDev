import UserActivityTabs from "@/components/User/userActivityTabs";
import {fetchUserInfo } from "@/services/user"

export default async function UserActivityPage({params:{userId}}) {



  const userInfo = await fetchUserInfo(userId);
       

 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <UserActivityTabs  userInfo = {userInfo.data} />

    </div>
  );
}
