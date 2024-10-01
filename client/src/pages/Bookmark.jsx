import React, { useEffect, useState } from 'react';
import Nav from '../components/Home/Nav';
import { getBookmarks } from '../api/slideApi';
import styles from '../Styles/Bookmark.module.css'; 
import SlideModal from '../components/Bookmark/SlideModal';

function Bookmark() {
    const token = localStorage.getItem("token");
    const [bookmarks, setBookmarks] = useState([]);
    const [showSlideModal, setShowSlideModal] = useState(false);
    const [slideIndex, setSlideIndex] = useState();

    useEffect(() => {
        getBookmarks(token).then((response) => {
            if (response.data) {
                setBookmarks(response.data);
            }
        });
    }, [token]);

    const handelSlide = (index) => {

        setShowSlideModal(true);
        setSlideIndex(index);

    }

    return (
        <div>
            <Nav />
            <div className={styles.bookmarkPage}>
                <h2 style={{textAlign:"center"}} >Your Bookmarks</h2>
                <div className={styles.bookmarkContainer}>
                    {bookmarks.length > 0 ? (
                        bookmarks.map((bookmark, index) => (
                            <div key={index} onClick={()=>handelSlide(index)} className={styles.bookmarkCard}>
                                <div className={styles.media}>
                                    {bookmark.mediaType === 'image' ? (
                                        <img
                                            src={bookmark.mediaUrl}
                                            alt={bookmark.heading}
                                            className={styles.bookmarkImage}
                                        />
                                    ) : bookmark.mediaType === 'video' ? (
                                        <video
                                            src={bookmark.mediaUrl}
                                            controls
                                            className={styles.bookmarkVideo}
                                        />
                                    ) : (
                                        <p>Unsupported media type</p>
                                    )}
                                </div>
                                <div className={styles.bookmarkContent}>
                                    <h3>{bookmark.heading}</h3>
                                    <p>{bookmark.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign:"center",width:"100%"}}>No bookmarks available.</p>
                    )}
                </div>
            </div>
            {showSlideModal && <SlideModal setShowSlideModal={setShowSlideModal} bookmarks={bookmarks} slideIndex={slideIndex} />}
        </div>
        
    );
}

export default Bookmark;
