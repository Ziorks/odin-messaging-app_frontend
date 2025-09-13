import styles from "./ProfilePic.module.css";

function ProfilePic({ src, size }) {
  return (
    <img
      className={styles.image}
      src={src}
      style={{ width: `${size}px`, height: `${size}px` }}
    ></img>
  );
}

export default ProfilePic;
