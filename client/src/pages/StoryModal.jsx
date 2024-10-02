import React, { useEffect, useState } from "react";
import styles from "../Styles/StoryModal.module.css";
import { get_Story } from "../api/storyApi";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TbLocationShare } from "react-icons/tb";
import { toast } from "react-toastify";
import { RxBookmarkFilled } from "react-icons/rx";
import { IoMdDownload } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import LoginModal from "../components/Auth/LoginModal";
import { createLike, createBookmark } from "../api/slideApi";
import Spinner from "../components/Spinner/Spinner";

function StoryModal() {
  const [loading, setLoading] = useState(true);
  const { storyId, index } = useParams();
  const [story, setStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(parseInt(index) || 0);
  const [likes, setLikes] = useState([]);
  const [likedSlides, setLikedSlides] = useState([]);
  const [bookmarkedSlides, setBookmarkedSlides] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const isLogin = localStorage.getItem("isLogin");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      const response = await get_Story(storyId);
      if (response.data) {
        setStory(response.data);
        setLikes(response.data.slides.map((slide) => slide.likes));
        const userLikedSlides = response.data.slides.map((slide) =>
          slide.likedBy.includes(userId)
        );

        setLikedSlides(userLikedSlides);

        // Set bookmarked slides for the current user
        const userBookmarkedSlides = response.data.slides.map((slide) =>
          slide.bookmarkedBy.includes(userId)
        );
        setBookmarkedSlides(userBookmarkedSlides); // Set the bookmarked state
      }
      setLoading(false);
    };
    fetchStory();
  }, [storyId]);

  useEffect(() => {
    localStorage.setItem(`story_${storyId}_currentSlide`, currentSlide);
    navigate(`/story/${storyId}/${currentSlide}`, { replace: true });
  }, [currentSlide, storyId, navigate]);

  useEffect(() => {
    const savedSlide = localStorage.getItem(`story_${storyId}_currentSlide`);
    if (savedSlide !== null) {
      setCurrentSlide(parseInt(savedSlide));
    }
  }, [storyId]);

  const handleShare = (storyId) => {
    const path = `${window.location.origin}/story/${storyId}/${currentSlide}`;
    navigator.clipboard.writeText(path);
    toast.success("Link Copied to Clipboard");
  };

  const nextSlide = () => {
    if (currentSlide < story.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (loading || !story || !story.slides) {
    return <Spinner loading={loading} />;
  }

  const current = story.slides[currentSlide];

  const handleDownload = async (url) => {
    if (isLogin) {
      try {
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = "download from stories_Ashish";
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

  const handleLike = async (storyId, slideId, currentSlide) => {
    if (isLogin) {
      try {
        const response = await createLike(storyId, slideId, userId);
        if (response.status === 200) {
          const updatedLikes = [...likes];
          const wasLiked = likedSlides[currentSlide];

          // Update likes and liked status
          updatedLikes[currentSlide] += wasLiked ? -1 : 1; // Increase/decrease the likes
          setLikes(updatedLikes);
          setLikedSlides((prev) => {
            const newLikedSlides = [...prev];
            newLikedSlides[currentSlide] = !wasLiked; // Toggle liked status
            return newLikedSlides;
          });

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

  const handleBookmark = async (storyId, slideId, currentSlide) => {
    if (isLogin) {
      try {
        const response = await createBookmark(storyId, slideId); // Call API to toggle bookmark
        if (response.status === 200) {
          const wasBookmarked = bookmarkedSlides[currentSlide];

          // Update bookmarked status
          setBookmarkedSlides((prev) => {
            const newBookmarkedSlides = [...prev];
            newBookmarkedSlides[currentSlide] = !wasBookmarked;
            return newBookmarkedSlides;
          });

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
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.progressBar}>
            {story.slides.map((slide, index) => (
              <div
                key={index}
                className={`${styles.progressItem} ${
                  index === currentSlide ? styles.active : ""
                }`}
              ></div>
            ))}
          </div>
          <div className={styles.head}>
            <button
              className={styles.button}
              onClick={() => window.history.back()}
            >
              <RxCross2 />
            </button>
            <button
              className={styles.button}
              onClick={() => handleShare(storyId)}
            >
              <TbLocationShare />
            </button>
          </div>

          <div className={styles.media}>
            {current.mediaType === "image" ? (
              <img
                src={current.mediaUrl}
                alt={current.heading}
                className={styles.image}
              />
            ) : current.mediaType === "video" ? (
              <video
                src={current.mediaUrl}
                controls
                autoPlay
                className={styles.video}
              />
            ) : (
              <p>Unsupported media type</p>
            )}
          </div>
          <div className={styles.content}>
            <h1>{current.heading}</h1>
            <p>{current.description}</p>
          </div>

          <div className={styles.controls}>
            <button
              className={`${styles.arrow} ${
                currentSlide === 0 ? styles.disabled : ""
              }`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <IoIosArrowBack />
            </button>
            <button
              className={`${styles.arrow} ${
                currentSlide === story.slides.length - 1 ? styles.disabled : ""
              }`}
              onClick={nextSlide}
              disabled={currentSlide === story.slides.length - 1}
            >
              <IoIosArrowForward />
            </button>
          </div>

          <div className={styles.foot}>
            <button
              className={styles.button}
              onClick={() => handleBookmark(storyId, current._id, currentSlide)}
            >
              <RxBookmarkFilled
                style={{
                  color: bookmarkedSlides[currentSlide] ? "blue" : "white",
                }}
              />
            </button>
            <button
              className={styles.button}
              onClick={() => handleDownload(current.mediaUrl)}
            >
              <IoMdDownload />
            </button>

            <button
              className={styles.button}
              onClick={() => handleLike(storyId, current._id, currentSlide)}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <FaHeart
                  style={{
                    color: likedSlides[currentSlide] ? "red" : "white",
                  }}
                />
                <span style={{ fontSize: "1.8rem" }}>
                  {" "}
                  {likes[currentSlide]}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showLogin && <LoginModal setShowLogin={setShowLogin} />}
    </>
  );
}

export default StoryModal;
