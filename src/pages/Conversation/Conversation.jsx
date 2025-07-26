import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const host = import.meta.env.VITE_API_HOST;
// import styles from "./Conversation.module.css";

function Conversation() {
  //TODO: do something with isLoading and error
  //TODO: display if a message was edited
  //TODO: denote start of conversation history
  //TODO: message if no messages
  //TODO: load more messages on scroll up?
  //TODO: group messages sent around the same time?

  const [thread, setThread] = useState({
    id: 0,
    messages: [],
    participants: [],
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    axios
      .get(`${host}/thread/${conversationId}`, {
        withCredentials: true,
      })
      .then((resp) => {
        if (!ignore) {
          setThread(resp.data.thread);
        }
      })
      .catch((err) => {
        console.log(err);

        if (err.response) {
          if (err.response.status === 401) {
            navigate("/login");
          } else {
            setError(err.response.data.error);
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => (ignore = true);
  }, [conversationId, navigate]);

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const payload = {
      body: message,
      threadId: +conversationId,
    };

    axios
      .post(`${host}/message`, payload, {
        withCredentials: true,
      })
      .then(() => {
        //TODO: show success message and reload maybe?
      })
      .catch((err) => {
        console.log(err);

        if (err.response) {
          if (err.response.status === 401) {
            navigate("/login");
          } else {
            setError(err.response.data.error);
          }
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getUserById = (userId) => {
    return thread.participants.find((participant) => participant.id === userId);
  };

  return (
    <>
      <h1>Conversation</h1>
      <br />
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
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </>
  );
}

export default Conversation;
