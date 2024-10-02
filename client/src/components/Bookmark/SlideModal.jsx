import React, { useEffect, useState } from "react";
import styles from "../../Styles/SlideModal.module.css";
import { RxCross2 } from "react-icons/rx";
import { TbLocationShare } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { RxBookmarkFilled } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import LoginModal from "../Auth/LoginModal";
import { createLike, createBookmark } from "../../api/slideApi";

function SlideModal({ setShowSlideModal, bookmarks, slideIndex }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0); // To store current slide likes
  const [showLogin, setShowLogin] = useState(false);

  const userId = localStorage.getItem("userId");
  const isLogin = localStorage.getItem("isLogin");

  useEffect(() => {
    const currentSlide = bookmarks[slideIndex];
    setLikes(currentSlide.likes);
    setIsLiked(currentSlide.likedBy.includes(userId));
    setIsBookmarked(currentSlide.bookmarkedBy.includes(userId));
  }, [bookmarks, slideIndex, userId]);

  const handleShare = () => {
    const slide = bookmarks[slideIndex];
 

    navigator.clipboard.writeText(
      `${window.location.origin}/story/${slide.storyId}/${slide.slideIndex}`
    );
    toast.success("Link Copied to Clipboard");
  };

  const handleDownload = async () => {
    if (isLogin) {
      const mediaUrl = bookmarks[slideIndex].mediaUrl;
      try {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = "download from slide_Ashish"; 
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the file:", error);
        toast.error("Failed to download the media.");
      }
    } else {
      setShowLogin(true);
    }
  };

  const handleLike = async () => {
    if (isLogin) {
      const slide = bookmarks[slideIndex];
      try {
        const response = await createLike(slide.storyId, slide._id, userId);
        if (response.status === 200) {
          setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
          setIsLiked((prev) => !prev);
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error updating like status:", error);
        toast.error("Failed to update like status");
      }
    } else {
      setShowLogin(true);
    }
  };

  const handleBookmark = async () => {
    if (isLogin) {
      const slide = bookmarks[slideIndex];
      try {
        const response = await createBookmark(slide.storyId, slide._id);
        if (response.status === 200) {
          setIsBookmarked((prev) => !prev);
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error updating bookmark status:", error);
        toast.error("Failed to update bookmark status");
      }
    } else {
      setShowLogin(true);
    }
  };

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
          <button className={styles.button} onClick={handleShare}>
            <TbLocationShare />
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
        <div className={styles.foot}>
         
          <button className={styles.button} onClick={handleBookmark}>
            <RxBookmarkFilled
              style={{ color: isBookmarked ? "blue" : "white" }}
            />
          </button>
          <button className={styles.button} onClick={handleDownload}>
          <IoMdDownload />
        </button>
          <button className={styles.button} onClick={handleLike}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FaHeart style={{ color: isLiked ? "red" : "white" }} />
              <span>{likes}</span>
            </div>
          </button>
        </div>
      </div>
      {showLogin && <LoginModal setShowLogin={setShowLogin} />}
    </div>
  );
}

export default SlideModal;
