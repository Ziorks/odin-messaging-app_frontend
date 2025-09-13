import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { format } from "date-fns";
import { useFetchFromAPI, useSendMessage, useSendUpdate } from "../../hooks";
import { GlobalContext } from "../../contexts";
import ProfilePic from "../../components/ProfilePic";
import styles from "./Conversation.module.css";

function Conversation() {
  //TODO: show edits to message in list while editing
  //TODO: participants at top should be links to profiles
  //TODO: delete message button?
  //TODO: move edit button to dropdown?

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
    <div className={styles.pageContainer}>
      {data && (
        <div className={styles.conversationContainer}>
          <ul className={styles.participantsList}>
            {thread.participants.map((participant) => (
              <li key={participant.id} className={styles.participant}>
                <ProfilePic src={participant.profile.pictureURL} size={40} />
                {participant.username}
              </li>
            ))}
          </ul>
          {threadIsLoading && <p>Loading conversation...</p>}
          {threadError && <p>{threadError}</p>}
          <ol className={styles.messagesList}>
            {thread.messages.map((message) => {
              const { id, senderId, body, isEdited, createdAt } = message;
              const sender = getUserById(senderId);
              return (
                <li key={id} className={styles.message}>
                  <ProfilePic src={sender.profile.pictureURL} size={25} />
                  <p>
                    <span className={styles.username}>{sender.username}</span>{" "}
                    <span className={styles.subtext}>
                      {format(createdAt, "M/d/yy, h:mmaaa")}
                    </span>
                  </p>
                  <p className={styles.messageBody}>
                    {body}
                    {isEdited && (
                      <span className={styles.subtext}> - edited</span>
                    )}
                  </p>
                  {!isEditing && senderId === user.id ? (
                    <button onClick={() => setEdit({ messageId: id, body })}>
                      Edit
                    </button>
                  ) : (
                    <button style={{ visibility: "hidden" }}>
                      this is just for spacing
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className={styles.actionsContainer}>
            <button
              onClick={refetch}
              disabled={threadIsLoading}
              className={styles.refreshBtn}
            >
              <FiRefreshCw />
            </button>
            {isEditing ? (
              <>
                <form
                  onSubmit={handleEditFormSubmit}
                  className={styles.messageForm}
                >
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
                <form
                  onSubmit={handleMessageFormSubmit}
                  className={styles.messageForm}
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Type a message..."
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Conversation;
