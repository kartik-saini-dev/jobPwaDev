export const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/users/?userId=${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        cache: "no-store",
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  