import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BookmarkProvider } from './context/BookmarkContext';
import { SourceProvider } from './context/SourceContext'; 

import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Bookmarks from './pages/Bookmarks';
const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#ff8c00',
    },
    background: {
      default: '#0b0e14', 
      paper: '#161b22',   
    },
    text: {
      primary: '#e6edf3',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SourceProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/feed" />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </BrowserRouter>
        </BookmarkProvider>
        </SourceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;