import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchFromAPI, useSendMessage } from "../../hooks";
// import styles from "./Conversation.module.css";

function Conversation() {
  //TODO: do something with isLoading and error
  //TODO: display if a message was edited
  //TODO: denote start of conversation history
  //TODO: message if no messages
  //TODO: load more messages on scroll up?
  //TODO: group messages sent around the same time?

  const [message, setMessage] = useState("");
  const { conversationId } = useParams();

  const {
    data,
    isLoading: threadIsLoading,
    error: threadError,
    refetch,
  } = useFetchFromAPI(`/thread/${conversationId}`);

  const {
    sendMessage,
    isLoading: messageIsLoading,
    error: messageError,
  } = useSendMessage(+conversationId, refetch);

  const thread = data?.thread;

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const getUserById = (userId) => {
    return thread.participants.find((participant) => participant.id === userId);
  };

  return (
    <>
      <h1>Conversation</h1>
      <br />
      {data && (
        <>
          <h2>Participants:</h2>
          <ul>
            {thread.participants.map((participant) => (
              <li key={participant.id}>{participant.username}</li>
            ))}
          </ul>
          <br />
          <h2>Messages:</h2>
          <ol>
            {thread.messages.map((message) => {
              const sender = getUserById(message.senderId);
              return (
                <li key={message.id}>
                  <div>
                    {sender.username} - {message.body} - {message.createdAt}
                  </div>
                </li>
              );
            })}
          </ol>
          <form onSubmit={handleMessageFormSubmit}>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="New message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" disabled={messageIsLoading}>
              Send
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default Conversation;
