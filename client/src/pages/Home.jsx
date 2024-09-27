import React, { useEffect, useState } from "react";
import Nav from "../components/Home/Nav";
import { get_Stories } from "../api/storyApi";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import {get_UserStories} from "../api/storyApi";

function Home() {
  const [stories, setStories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [visibleStories, setVisibleStories] = useState({});
  const isLogin=localStorage.getItem("isLogin");
  console.log(isLogin);

  const[userStories,setUserStories]=useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, [selectedCategories]);

  const fetchStories = () => {
    const categoriesToSend = selectedCategories.includes("All") ? "" : selectedCategories.join(","); // Send empty string if "All" is selected
    get_Stories(categoriesToSend).then((response) => {
      if (response.data) {
        setStories(response.data);
        initializeVisibleStories(response.data);
      }
    });
  };

 

  useEffect(()=>{
    const token=localStorage.getItem("token");
    
    get_UserStories(token).then((response)=>{
      if(response.data){
        
        setUserStories(response.data);
      }
    })
  },[isLogin])

  // Limit the initial number of stories shown per category
  const STORY_LIMIT = 4;

  // Function to initialize visible stories with default limit
  const initializeVisibleStories = (stories) => {
    const grouped = groupStoriesByCategory(stories);
    const visible = {};
    Object.keys(grouped).forEach((category) => {
      visible[category] = STORY_LIMIT;
    });
    setVisibleStories(visible);
  };

  // Function to group stories by category
  const groupStoriesByCategory = (stories) => {
    const groupedStories = categories.reduce((acc, category) => {
      acc[category] = stories.filter((story) => story.category === category);
      return acc;
    }, {});
    return groupedStories;
  };

  // Function to show more stories in a category
  const showMoreStories = (category) => {
    setVisibleStories((prevVisible) => ({
      ...prevVisible,
      [category]: groupStoriesByCategory(stories)[category].length, // Show all stories for that category
    }));
  };

  const categories = [
    "All",  // Include "All" as an option to show all categories
    "Food",
    "Health & Fitness",
    "Travel",
    "Education",
    "Movies",
  ];

  // Handle category selection
  const toggleCategorySelection = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]); // Reset selection to "All"
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(category)) {
          // Deselect the category
          const updatedSelection = prevSelected.filter((cat) => cat !== category);
          return updatedSelection.length === 0 ? ["All"] : updatedSelection;
        } else {
          // Select the category
          return prevSelected.includes("All")
            ? [category] // If "All" was selected, reset selection
            : [...prevSelected, category];
        }
      });
    }
  };

  // Group stories
  const groupedStories = groupStoriesByCategory(stories);

  return (
    <>
      <Nav />
      <div>
        {/* Category Filter Buttons */}
        <div className={Styles.categories}>
          {categories.map((category) => (
            <div
              className={`${Styles.category} ${selectedCategories.includes(category) ? Styles.activeCategory : ""}`}
              key={category}
              onClick={() => toggleCategorySelection(category)}
            >
              <div>{category}</div>
            </div>
          ))}
        </div>

        {/* User Stories */}
        {isLogin=="true" && (

          <div>
            <h2 className={Styles.heading}>Your Stories</h2>

            {userStories.length>0? userStories.map((story) => (

              <div key={story._id} className={Styles.story}>

                <div onClick={() => navigate(`/story/${story._id}`)}>
                  <h1>{story.slides[0].heading}</h1>
                  <p>{story.slides[0].description}</p>
                  {story.slides[0].mediaType === "image" ? (
                    <img src={story.slides[0].mediaUrl} alt="image" />
                  ) : story.slides[0].mediaType === "video" ? (
                    <video src={story.slides[0].mediaUrl} alt="video" />
                  ) : (
                    <p>Loading media...</p>
                  )}
                  
                </div>
                <button onClick={()=>navigate(`/update/${story._id}`)}>edit</button>
              </div>
            )):<p>No stories available</p>}
          </div>
        )
        }

        {/* Dynamic heading */}
        <h2 className={Styles.heading}>
          {selectedCategories.includes("All")
            ? "Top Stories"
            : `Top Stories from ${selectedCategories.join(", ")}`}
        </h2>

        {/* Render Stories According to Selected Categories */}
        <div>
          {selectedCategories.includes("All") ? (
            // Show all stories grouped by category
            categories.slice(1).map((category) => (
              <div key={category}>
                <h3>{`Top Stories from ${category}`}</h3>
                {groupedStories[category] && groupedStories[category].length > 0 ? (
                  <>
                    {groupedStories[category]
                      .slice(0, visibleStories[category]) // Show limited number of stories
                      .map((story) => (
                        <div key={story._id} className={Styles.story}>
                          <div onClick={() => navigate(`/story/${story._id}`)}>
                            <h1>{story.slides[0].heading}</h1>
                            <p>{story.slides[0].description}</p>
                            {story.slides[0].mediaType === "image" ? (
                              <img src={story.slides[0].mediaUrl} alt="image" />
                            ) : story.slides[0].mediaType === "video" ? (
                              <video src={story.slides[0].mediaUrl} alt="video" />
                            ) : (
                              <p>Loading media...</p>
                            )}
                          </div>
                        </div>
                      ))}
                    
                    {/* Show More button if there are more than STORY_LIMIT stories */}
                    {groupedStories[category].length > STORY_LIMIT && visibleStories[category] < groupedStories[category].length && (
                      <button onClick={() => showMoreStories(category)}>
                        Show More
                      </button>
                    )}
                  </>
                ) : (
                  <p>No stories available in this category.</p>
                )}
              </div>
            ))
          ) : (
            // Show stories for selected categories
            selectedCategories.map((category) => (
              <div key={category}>
                <h3>{`Top Stories from ${category}`}</h3>
                {groupedStories[category] && groupedStories[category].length > 0 ? (
                  <>
                    {groupedStories[category]
                      .slice(0, visibleStories[category]) // Show limited number of stories
                      .map((story) => (
                        <div key={story._id} className={Styles.story}>
                          <div onClick={() => navigate(`/story/${story._id}`)}>
                            <h1>{story.slides[0].heading}</h1>
                            <p>{story.slides[0].description}</p>
                            {story.slides[0].mediaType === "image" ? (
                              <img src={story.slides[0].mediaUrl} alt="image" />
                            ) : story.slides[0].mediaType === "video" ? (
                              <video src={story.slides[0].mediaUrl} alt="video" />
                            ) : (
                              <p>Loading media...</p>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* Show More button if there are more than STORY_LIMIT stories */}
                    {groupedStories[category].length > STORY_LIMIT && visibleStories[category] < groupedStories[category].length && (
                      <button onClick={() => showMoreStories(category)}>
                        Show More
                      </button>
                    )}
                  </>
                ) : (
                  <p>No stories available in this category.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Home;