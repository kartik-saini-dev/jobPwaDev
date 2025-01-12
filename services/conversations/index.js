export const getConversation = async (convId,userId) => {
  try {
    const res = await fetch(`/api/messages/getConversation?convId=${convId}&userId=${userId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error fetching conversation: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getConversation:", error);
    return { success: false, message: "Failed to fetch conversation" };
  }
};


  export const createConversation = async ({groupName,applicants,admin,groupPic} ) => {
 
    try {
      const res = await fetch(`/api/messages/createConversation`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName, applicants ,admin,groupPic}),
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return { success: false, message: "Failed to create conversation." };
    }
  };
  