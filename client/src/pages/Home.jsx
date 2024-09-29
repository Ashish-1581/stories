import React, { useEffect, useState } from "react";
import Nav from "../components/Home/Nav";
import { get_Stories, get_UserStories } from "../api/storyApi";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import UpdateStoryModal from "../components/Home/UpdateStoryModal";
import { FaRegEdit } from "react-icons/fa";

function Home() {
  const [stories, setStories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [visibleStories, setVisibleStories] = useState({});
  const isLogin = localStorage.getItem("isLogin");
  const [storyId, setStoryId] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  const [userStories, setUserStories] = useState([]);
  const [visibleUserStories, setVisibleUserStories] = useState(4); // Initial limit for user stories

  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, [selectedCategories]);

  const fetchStories = () => {
    const categoriesToSend = selectedCategories.includes("All")
      ? ""
      : selectedCategories.join(","); 
    get_Stories(categoriesToSend).then((response) => {
      if (response.data) {
        setStories(response.data);
        initializeVisibleStories(response.data);
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    get_UserStories(token).then((response) => {
      if (response.data) {
        setUserStories(response.data);
      }
    });
  }, [isLogin]);

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
      acc[category.name] = stories.filter(
        (story) => story.category === category.name
      );
      return acc;
    }, {});
    return groupedStories;
  };

  // Function to show more stories in a category
  const showMoreStories = (category) => {
    setVisibleStories((prevVisible) => ({
      ...prevVisible,
      [category]: groupStoriesByCategory(stories)[category].length, // Show all stories for the category
    }));
  };

  // Show more user stories
  const showMoreUserStories = () => {
    setVisibleUserStories(userStories.length); // Show all user stories
  };

  // Array of categories with background image URLs
  const categories = [
    {
      name: "All",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJIhZ8w4VcyRga8Et37o4BnenyFTx1zGTZDA&s",
    },
    {
      name: "Food",
      imageUrl:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      name: "Health & Fitness",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/701/articles/2017/01/how-much-joining-gym-helps-health-2-jpg-1488906648.jpeg?resize=640:*",
    },
    {
      name: "Travel",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc3Ehc4gYyNOwGsY25gbuI9PYjFNWCnpz3ew&s",
    },
    {
      name: "Education",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3PB3jxmNb5E7fjdz7ArTYp7FeJVbYd6MVQ&s",
    },
    {
      name: "Movies",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ39P1RPrz86ROjRyJo5rtpnlEkX1KxYLzGeg&s",
    },
  ];

  // Handle category selection
  const toggleCategorySelection = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]); // Reset selection to "All"
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(category)) {
          // Deselect the category
          const updatedSelection = prevSelected.filter(
            (cat) => cat !== category
          );
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
      <div style={{ padding: "20px" }}>
        <div className={Styles.categories}>
          {categories.map((category) => (
            <div
              className={`${Styles.category} ${
                selectedCategories.includes(category.name)
                  ? Styles.activeCategory
                  : ""
              }`}
              key={category.name}
              onClick={() => toggleCategorySelection(category.name)}
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",

                fontSize: "1.2rem",
              }}
            >
              <div style={{ color: "white" }}>{category.name}</div>
            </div>
          ))}
        </div>

        {isLogin === "true" && (
          <div>
            <h2 className={Styles.heading}>Your Stories</h2>

            {userStories.length > 0 ? (
              <>
                <div className={Styles.storyContainer}>
                  {userStories.slice(0, visibleUserStories).map((story) => (
                    <div key={story._id} className={Styles.story}>
                      <div onClick={() => navigate(`/story/${story._id}`)}>
                        <div className={Styles.media}>
                          {story.slides[0].mediaType === "image" ? (
                            <img src={story.slides[0].mediaUrl} alt="image" />
                          ) : story.slides[0].mediaType === "video" ? (
                            <video src={story.slides[0].mediaUrl} alt="video" />
                          ) : (
                            <p>Loading media...</p>
                          )}
                        </div>
                        <div className={Styles.content}>
                          <h1>{story.slides[0].heading}</h1>
                          <p>{story.slides[0].description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setStoryId(story._id);
                          setShowUpdate(true);
                        }}
                        className={Styles.editButton}
                      >
                        <FaRegEdit /> Edit
                      </button>
                    </div>
                  ))}

                  {/* Show More button if there are more than visibleUserStories */}
                  {userStories.length > visibleUserStories && (
                    <div className={Styles.showMoreContainer}>
                      <button onClick={showMoreUserStories}>Show More</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p style={{textAlign:"center"}}>No stories available</p>
            )}
          </div>
        )}

        {/* Render Stories According to Selected Categories */}
        <div>
          {selectedCategories.includes("All")
            ? // Show all stories grouped by category
              categories.slice(1).map((category) => (
                <div key={category.name}>
                  <h2
                    style={{ textAlign: "center", margin: "40px" }}
                  >{`Top Stories from ${category.name}`}</h2>
                  {groupedStories[category.name] &&
                  groupedStories[category.name].length > 0 ? (
                    <>
                      <div className={Styles.storyContainer}>
                        {groupedStories[category.name]
                          .slice(0, visibleStories[category.name]) // Show limited number of stories
                          .map((story) => (
                            <div key={story._id} className={Styles.story}>
                              <div
                                onClick={() => navigate(`/story/${story._id}`)}
                                className={Styles.media}
                              >
                                {story.slides[0].mediaType === "image" ? (
                                  <img
                                    src={story.slides[0].mediaUrl}
                                    alt="image"
                                  />
                                ) : story.slides[0].mediaType === "video" ? (
                                  <video
                                    src={story.slides[0].mediaUrl}
                                    alt="video"
                                  />
                                ) : (
                                  <p>Loading media...</p>
                                )}
                              </div>
                              <div className={Styles.content}>
                                <h1>{story.slides[0].heading}</h1>
                                <p>{story.slides[0].description}</p>
                              </div>
                            </div>
                          ))}

                        {/* Show More button if there are more than STORY_LIMIT stories */}
                        {groupedStories[category.name].length >
                          visibleStories[category.name] && (
                          <div className={Styles.showMoreContainer}>
                            <button
                              onClick={() => showMoreStories(category.name)}
                            >
                              Show More
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      No stories available in this category.
                    </p>
                  )}
                </div>
              ))
            : // Show stories for selected categories
              selectedCategories.map((category) => (
                <div key={category}>
                  <h2
                    style={{ textAlign: "center", margin: "40px" }}
                  >{`Top Stories from ${category}`}</h2>
                  {groupedStories[category] &&
                  groupedStories[category].length > 0 ? (
                    <div className={Styles.storyContainer}>
                      {groupedStories[category]
                        .slice(0, visibleStories[category]) // Show limited number of stories
                        .map((story) => (
                          <div key={story._id} className={Styles.story}>
                            <div
                              onClick={() => navigate(`/story/${story._id}`)}
                            >
                              {story.slides[0].mediaType === "image" ? (
                                <img
                                  src={story.slides[0].mediaUrl}
                                  alt="image"
                                />
                              ) : story.slides[0].mediaType === "video" ? (
                                <video
                                  src={story.slides[0].mediaUrl}
                                  alt="video"
                                />
                              ) : (
                                <p>Loading media...</p>
                              )}
                            </div>
                            <div className={Styles.content}>
                              <h1>{story.slides[0].heading}</h1>
                              <p>{story.slides[0].description}</p>
                            </div>
                          </div>
                        ))}

                      {/* Show More button if there are more than STORY_LIMIT stories */}
                      {groupedStories[category].length >
                        visibleStories[category] && (
                        <div className={Styles.showMoreContainer}>
                          <button onClick={() => showMoreStories(category)}>
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      No stories available in this category.
                    </p>
                  )}
                </div>
              ))}
        </div>

        {/* Update Story Modal */}
        {showUpdate && (
          <UpdateStoryModal
            storyId={storyId}
            setShowUpdate={() => setShowUpdate(false)}
          />
        )}
      </div>
    </>
  );
}

export default Home;
