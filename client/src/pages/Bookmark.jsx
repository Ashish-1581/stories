import React, { useEffect, useState } from 'react';
import Nav from '../components/Home/Nav';
import { getBookmarks } from '../api/slideApi';
import styles from './Bookmark.module.css'; // Import custom CSS

function Bookmark() {
    const token = localStorage.getItem("token");
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        getBookmarks(token).then((response) => {
            if (response.data) {
                setBookmarks(response.data);
            }
        });
    }, [token]);

    return (
        <div>
            <Nav />
            <div className={styles.bookmarkPage}>
                <h2>Your Bookmarks</h2>
                <div className={styles.bookmarkContainer}>
                    {bookmarks.length > 0 ? (
                        bookmarks.map((bookmark, index) => (
                            <div key={index} className={styles.bookmarkCard}>
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
                        <p>No bookmarks available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bookmark;
