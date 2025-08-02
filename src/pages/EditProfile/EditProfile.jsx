import { useEffect, useState } from "react";
import { useFetchFromAPI, useSendUpdate } from "../../hooks";
// import styles from "./EditProfile.module.css";

function EditProfile() {
  //TODO: do something with isLoading and error

  const [picture, setPicture] = useState({
    file: null,
    previewURL:
      "https://res.cloudinary.com/dwf29bnr3/image/upload/v1754109878/messaging_app_profile_pics/icsll72wpxwcku6gb1by.jpg",
  });
  const [about, setAbout] = useState("");
  const [username, setUsername] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const {
    data,
    isLoading: fetchIsLoading,
    error: fetchError,
    refetch,
  } = useFetchFromAPI("/user/me");

  const {
    sendUpdate,
    isLoading: updateIsLoading,
    error: updateError,
  } = useSendUpdate();

  useEffect(() => {
    if (!data) return;
    const user = data.user;
    setPicture({ file: null, previewURL: user.profile.pictureURL });
    setAbout(user.profile.about || "");
    setUsername(user.username);
  }, [data]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    sendUpdate(
      "/user/me/profile",
      { picture: picture.file, about, username },
      { multipart: true },
    );
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    sendUpdate("/user/me/password", {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    });
  };

  return (
    <>
      {data && (
        <>
          {showPassword ? (
            <>
              <form onSubmit={handlePasswordSubmit}>
                <div>
                  <label htmlFor="oldPassword">Current Password: </label>
                  <input
                    type="password"
                    name="oldPassword"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">New Password: </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPasswordConfirm">
                    Confirm New Password:{" "}
                  </label>
                  <input
                    type="password"
                    name="newPasswordConfirm"
                    id="newPasswordConfirm"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
              <button onClick={() => setShowPassword(false)}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleProfileSubmit}>
                <div>
                  <img
                    src={picture.previewURL}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <label htmlFor="picture">Profile Picture: </label>
                  <input
                    accept="image/*"
                    type="file"
                    name="picture"
                    id="picture"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setPicture({
                        file,
                        previewURL: URL.createObjectURL(file),
                      });
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.target.form.reset();
                      setPicture({
                        file: null,
                        previewURL:
                          "https://res.cloudinary.com/dwf29bnr3/image/upload/v1754109878/messaging_app_profile_pics/icsll72wpxwcku6gb1by.jpg",
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label htmlFor="username">Username: </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="about">About Me: </label>
                  <textarea
                    name="about"
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
                <button type="submit">Save Changes</button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.target.form.reset();
                    refetch();
                  }}
                >
                  Reset
                </button>
              </form>
              <button onClick={() => setShowPassword(true)}>
                Change Password
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default EditProfile;
