import React from "react";
import styles from "../../Styles/SlideModal.module.css";
import { RxCross2 } from "react-icons/rx";

function SlideModal({ setShowSlideModal, bookmarks, slideIndex }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
      <div className={styles.head}>
      <button
      className={styles.button}
      onClick={() => setShowSlideModal(false)}
    >
      <RxCross2 />
    </button>
    </div>
        <div className={styles.media}>
          {bookmarks[slideIndex].mediaType === "image" ? (
            <img
              src={bookmarks[slideIndex].mediaUrl}
              alt={bookmarks[slideIndex].heading}
              className={styles.bookmarkImage}
            />
          ) : bookmarks[slideIndex].mediaType === "video" ? (
            <video
              src={bookmarks[slideIndex].mediaUrl}
              controls
              className={styles.bookmarkVideo}
            />
          ) : (
            <p>Unsupported media type</p>
          )}
        </div>
        <div className={styles.content}>
          <h1>{bookmarks[slideIndex].heading}</h1>
          <p>{bookmarks[slideIndex].description}</p>
        </div>
      </div>
    </div>
  );
}

export default SlideModal;
