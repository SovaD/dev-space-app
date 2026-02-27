import React, { createContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (article) => {
    const isExist = bookmarks.find((b) => b.id === article.id);
    if (isExist) {
      setBookmarks(bookmarks.filter((b) => b.id !== article.id));
      setSnackbar({
        open: true,
        message: "Удалено из закладок",
        severity: "info",
      });
    } else {
      setBookmarks([...bookmarks, article]);
      setSnackbar({
        open: true,
        message: "Добавлено в закладки!",
        severity: "success",
      });
    }
  };

  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BookmarkContext.Provider>
  );
};
