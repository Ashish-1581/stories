import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./AddStoryModal.module.css";
import { create_Story } from "../../api/storyApi";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateStoryModal = ({ setShowAddStory }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const storyId=useParams('storyId')

  const categories = ["Food", "Health & Fitness", "Travel", "Education", "Movies"];

  const [category, setCategory] = useState("");
  const [slides, setSlides] = useState([
    { heading: "", description: "", mediaUrl: "", mediaType: "" }, // Added mediaType property
    { heading: "", description: "", mediaUrl: "", mediaType: "" },
    { heading: "", description: "", mediaUrl: "", mediaType: "" },
  ]);

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [validationMessages, setValidationMessages] = useState({
    heading: "",
    description: "",
    mediaUrl: "",
    category: "",
  });

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

  const createStory = async () => {
    const newValidationMessages = {
      heading: "",
      description: "",
      mediaUrl: "",
      category: "",
    };

    const allFieldsFilled = slides.every(
      (slide) =>
        slide.heading.trim() !== "" &&
        slide.description.trim() !== "" &&
        slide.mediaUrl.trim() !== ""
    );

    if (!allFieldsFilled) {
      newValidationMessages.heading =
        "Please fill in the heading, description, and media URL for every slide.";
    }

    if (!category) {
      newValidationMessages.category = "Please select a category.";
    }

    setValidationMessages(newValidationMessages);

    if (allFieldsFilled && category) {
      const validationPromises = slides.map(async (slide, index) => {
        if (slide.mediaUrl.trim()) {
          try {
            const response = await axios.head(slide.mediaUrl);
            const contentType = response.headers["content-type"];

            if (contentType.startsWith("video/")) {
              slides[index].mediaType = "video"; // Set mediaType
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
              slides[index].mediaType = "image"; // Set mediaType
            } else {
              throw new Error("Unsupported media type. Only images and videos are allowed.");
            }
          } catch (error) {
            throw error; // Pass the error to be handled later
          }
        }
        return Promise.resolve(); 
      });

      try {
        await Promise.all(validationPromises);
        // All validations are successful
        console.log(slides, category);
        const response = await create_Story(slides, category, token);

        if (response.status === 200) {
          toast.success("Story created successfully!");
          // Optionally navigate or close modal
        }
      } catch (error) {
        toast.error(error.message); // Show error message using toast
      }
    } else {
      if (newValidationMessages.heading) {
        toast.error(newValidationMessages.heading);
      }
      if (newValidationMessages.category) {
        toast.error(newValidationMessages.category);
      }
    }
  };

  const selectedSlide = slides[selectedSlideIndex];

  return (
    <>
      <div className={styles.overlay}>
        <div
          style={{
            background: "white",
            padding: "50px",
            height: "500px",
            width: "600px",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <div>
            <div className="slides-container">
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div className="slides-list">
                  {slides.map((slide, index) => (
                    <div className="slide" key={index}>
                      <button
                        onClick={() => handleSlideClick(index)}
                        className={`slide-button ${
                          index === selectedSlideIndex ? "selected" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                      {slides.length > 3 && index >= 3 && ( 
                        <button
                          onClick={() => deleteSlide(index)}
                          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {slides.length < 6 && (
                  <button onClick={addNewSlide} className="add-slide-button">
                    +
                  </button>
                )}
              </div>
              <div style={{ color: "#9f9f9f", fontSize: "1rem" }}>
                Min 3 slides | Max 6 slides
              </div>
            </div>

            {selectedSlide && (
              <div>
                <div>
                  <input
                    type="text"
                    value={selectedSlide.heading}
                    onChange={(e) =>
                      handleInputChange(selectedSlideIndex, "heading", e.target.value)
                    }
                    placeholder="Heading"
                    className="heading-input"
                  />
                </div>

                <div>
                  <textarea
                    value={selectedSlide.description}
                    onChange={(e) =>
                      handleInputChange(selectedSlideIndex, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="description-input"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={selectedSlide.mediaUrl}
                    onChange={(e) =>
                      handleInputChange(selectedSlideIndex, "mediaUrl", e.target.value)
                    }
                    placeholder="Image/Video URL (15 sec)"
                    className="mediaUrl-input"
                  />
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div className="category">
              <h3>Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lower-button">
            <button
              className="button"
              onClick={() => setShowAddStory(false)}
            >
              Cancel
            </button>
            <button
              className="button"
              style={{ color: "white", background: "#60B84B" }}
              onClick={createStory}
            >
              Create Story
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStoryModal;
