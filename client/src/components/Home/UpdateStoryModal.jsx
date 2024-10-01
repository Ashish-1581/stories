import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../Styles/AddStoryModal.module.css";
import axios from "axios";
import { RxCrossCircled } from "react-icons/rx";
import {get_Story,update_Story} from "../../api/storyApi";



const UpdateStoryModal = ({ setShowUpdate ,storyId}) => {


  const [category, setCategory] = useState("");
  const [slides, setSlides] = useState([
  
  ]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await get_Story(storyId);
        if (response.status === 200) {
          console.log(response.data);
          const story = response.data;
          setCategory(story.category);
          setSlides(story.slides);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchStory();
  }, [storyId]);

  const categories = ["Food", "Health & Fitness", "Travel", "Education", "Movies"];



  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const handleInputChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSlideClick = (index) => {
    setSelectedSlideIndex(index);
  };

  const addNewSlide = () => {
    if (slides.length < 6) {
      const newSlide = { heading: "", description: "", mediaUrl: "", mediaType: "" };
      setSlides([...slides, newSlide]);
    } else {
      toast.error("You can only add up to 6 slides.");
    }
  };

  const deleteSlide = (index) => {
    if (slides.length > 3) {
      const newSlides = [...slides];
      newSlides.splice(index, 1);
      setSlides(newSlides);
      if (selectedSlideIndex >= index && selectedSlideIndex > 0) {
        setSelectedSlideIndex(selectedSlideIndex - 1);
      }
    } else {
      toast.error("A minimum of 3 slides is required.");
    }
  };

  const validateMedia = async (slide, index) => {
    try {
      const response = await axios.head(slide.mediaUrl);
      const contentType = response.headers["content-type"];

      if (contentType.startsWith("video/")) {
        slides[index].mediaType = "video";
        const video = document.createElement("video");
        video.src = slide.mediaUrl;

        return new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            if (video.duration > 15) {
              reject(new Error("Video length must be 15 seconds or less."));
            } else {
              resolve();
            }
          };
          video.onerror = () => reject(new Error("Failed to load video."));
        });
      } else if (contentType.startsWith("image/")) {
        slides[index].mediaType = "image";
        return Promise.resolve();
      } else {
        throw new Error("Unsupported media type. Only images and videos are allowed.");
      }
    } catch (error) {
      throw new Error("Unsupported media type. Only images and videos are allowed.");
    }
  };

  const createStory = async () => {
    let allFieldsFilled = true;

    for (const slide of slides) {
      if (!slide.heading.trim() || !slide.description.trim() || !slide.mediaUrl.trim()) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      toast.error("Please fill in the heading, description, and media URL for every slide.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    try {
      for (const [index, slide] of slides.entries()) {
        if (slide.mediaUrl.trim()) {
          await validateMedia(slide, index);
        }
      }

      const response = await update_Story(storyId,slides, category);

      if (response.status === 200) {
        toast.success("Story updated successfully!");
        window.location.reload();
        setShowUpdate(false);
      

      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Next button click
  const handleNext = () => {
    if (selectedSlideIndex < slides.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
    } else {
      toast.error("You are on the last slide.");
    }
  };

  // Handle Previous button click
  const handlePrevious = () => {
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
      toast.error("You are on the first slide.");
    }
  };

  const selectedSlide = slides[selectedSlideIndex];

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
        <button onClick={() => setShowUpdate(false)} className={styles.cancelButton}>
        <RxCrossCircled style={{color:"red",fontSize:"3rem"}} />
            </button>
          <div className={styles.slidesContainer}>
            {slides.map((slide, index) => (
              <div key={index} className={styles.slideButtonContainer}>
                <button
                  onClick={() => handleSlideClick(index)}
                  className={`${styles.slideButton} ${
                    index === selectedSlideIndex ? styles.selected : ""
                  }`}
                >
                  Slide {index + 1}
                </button>
                {slides.length > 3 && index >= 3 && (
                  <button
                    onClick={() => deleteSlide(index)}
                    className={styles.deleteSlideButton}
                  >
                  <RxCrossCircled style={{color:"red",fontSize:"1.2rem"}} />
                  </button>
                )}
              </div>
            ))}
            {slides.length < 6 && (
              <button onClick={addNewSlide} className={styles.addButton}>
                Add +
              </button>
            )}
          </div>

          {selectedSlide && (
            <div className={styles.slideForm}>
              <div className={styles.inputGroup}>
                <label>Heading :</label>
                <input
                  type="text"
                  value={selectedSlide.heading}
                  onChange={(e) =>
                    handleInputChange(selectedSlideIndex, "heading", e.target.value)
                  }
                  placeholder="Your heading"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Description :</label>
                <textarea
                  value={selectedSlide.description}
                  onChange={(e) =>
                    handleInputChange(selectedSlideIndex, "description", e.target.value)
                  }
                  placeholder="Story Description"
                  className={styles.textArea}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Image/Video :</label>
                <input
                  type="text"
                  value={selectedSlide.mediaUrl}
                  onChange={(e) =>
                    handleInputChange(selectedSlideIndex, "mediaUrl", e.target.value)
                  }
                  placeholder="Add Image or video URL"
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Category :</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Select category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
           
          </div>
          <div className={styles.finalButtonGroup}>

          <div className={styles.buttonGroup}>
            <button
              onClick={handlePrevious}
              className={styles.navigationButton}
              disabled={selectedSlideIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className={styles.navigationButton}
              disabled={selectedSlideIndex === slides.length - 1}
              style={{background:"#73ABFF"}}
            >
              Next
            </button>
          </div>

          
            
            <button onClick={createStory} className={styles.postButton}>
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStoryModal;
