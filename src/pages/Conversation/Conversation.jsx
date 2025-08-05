import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchFromAPI, useSendMessage, useSendUpdate } from "../../hooks";
import { GlobalContext } from "../../contexts";
// import styles from "./Conversation.module.css";

function Conversation() {
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState({ messageId: null, body: null });
  const isEditing = edit.messageId !== null;
  const { user } = useContext(GlobalContext);
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
    errors: messageErrors,
  } = useSendMessage(+conversationId, refetch);

  const {
    sendUpdate,
    isLoading: editIsLoading,
    errors: editErrors,
  } = useSendUpdate(refetch);

  const thread = data?.thread;

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    sendUpdate(`/message/${edit.messageId}`, { body: edit.body });
    setEdit({ messageId: null, body: null });
  };

  const getUserById = (userId) => {
    return thread.participants.find((participant) => participant.id === userId);
  };

  return (
    <>
      <h1>Conversation</h1>
      <br />
      {threadIsLoading && <p>Loading conversation...</p>}
      {threadError && <p>{threadError}</p>}
      {data && (
        <>
          <h2>Participants:</h2>
          <ul>
            {thread.participants.map((participant) => (
              <li key={participant.id}>{participant.username}</li>
            ))}
          </ul>
          <br />
          <button onClick={refetch} disabled={threadIsLoading}>
            Refresh
          </button>
          <h2>Messages:</h2>
          <ol>
            {thread.messages.map((message) => {
              const { id, senderId, body, isEdited, createdAt } = message;
              const sender = getUserById(senderId);
              return (
                <li key={id}>
                  <div>
                    {sender.username} - {body}
                    {isEdited && " - edited"} - {createdAt}
                    {!isEditing && senderId === user.id && (
                      <button onClick={() => setEdit({ messageId: id, body })}>
                        Edit
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {isEditing ? (
            <>
              <form onSubmit={handleEditFormSubmit}>
                <input
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Edit message..."
                  autoComplete="off"
                  value={edit.body}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, body: e.target.value }))
                  }
                />
                <button type="submit" disabled={!edit.body || editIsLoading}>
                  Save
                </button>
                <button
                  onClick={() => setEdit({ messageId: null, body: null })}
                >
                  Cancel
                </button>
              </form>
              {editIsLoading && <p>Saving changes...</p>}
              {editErrors && (
                <ul>
                  {editErrors.map((error) => (
                    <li>{error.msg}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <form onSubmit={handleMessageFormSubmit}>
                <input
                  type="text"
                  name="message"
                  id="message"
                  placeholder="New message..."
                  autoComplete="off"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={!message || messageIsLoading}>
                  Send
                </button>
              </form>
              {messageIsLoading && <p>Sending message...</p>}
              {messageErrors && (
                <ul>
                  {messageErrors.map((error) => (
                    <li>{error.msg}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Conversation;
