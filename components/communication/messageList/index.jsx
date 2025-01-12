"use client"
import Message from "../message"; // Import the Message component

const MessageList = ({ userMessages, participants,room,handleUpdateMessage, handleDeleteMessage}) => {
  return (
    <div className="space-y-4 ">
      {userMessages && userMessages.length > 0 ? (
        userMessages.map((message, index) => (
          <Message
            key={message._id}
             participants={participants}
            userId={message.from}
            text={message.text}
            type={message.type}
            createdAt={message.created_at}
            handleUpdate={(updatedText) => handleUpdateMessage(message._id, updatedText)}
            handleDelete={() => handleDeleteMessage(message._id,message.type,message.text)}
            seenBy={message.seenByUsers}
            room={room}
            isLastMessage={index === userMessages.length - 1}
            isSystemMessage={message.type === "System"}
          />
        ))
      ) : (
        <h1>It's all Start with Hello :)</h1>
      )}
    </div>
  );
};

export default MessageList;
