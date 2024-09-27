import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StoryModal.module.css';
import { get_Story } from '../api/storyApi';
import { useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function StoryModal() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
 

  

  // Fetch the story data using storyId from the URL
  useEffect(() => {
    get_Story(storyId).then((response) => {
      if (response.data) {
        setStory(response.data);
         
        
        
      }
    });
  }, [storyId]);



  // Handle next slide
  const nextSlide = () => {
    if (currentSlide < story.slides.length - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
   
    }
  };

  // Handle previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
    
    }
  };

  // If the story data is not yet loaded
  if (!story || !story.slides) {
    return <div>Loading...</div>;
  }

  const current = story.slides[currentSlide];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{current.heading}</h2>
          <p>{current.description}</p>
        </div>

        {/* Media display based on the URL */}
        <div className={styles.media}>
          {current.mediaType === 'image' ? (
            <img src={current.mediaUrl} alt={current.heading} className={styles.image} />
          ) : current.mediaType === 'video' ? (
            <video src={current.mediaUrl} controls autoPlay className={styles.video} />
          ) : (
            <p>Unsupported media type</p>
          )}
        </div>

        {/* Arrow Controls for Previous and Next */}
        <div className={styles.controls}>
          <button
            className={`${styles.arrow} ${currentSlide === 0 ? styles.disabled : ''}`}
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
          <IoIosArrowBack />
          {/* Left Arrow */}
          </button>
          <button
            className={`${styles.arrow} ${currentSlide === story.slides.length - 1 ? styles.disabled : ''}`}
            onClick={nextSlide}
            disabled={currentSlide === story.slides.length - 1}
          >
          <IoIosArrowForward /> {/* Right Arrow */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryModal;



