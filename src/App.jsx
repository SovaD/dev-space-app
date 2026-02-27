import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BookmarkProvider } from './context/BookmarkContext';

// Импорт страниц (создадим их позже)
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Bookmarks from './pages/Bookmarks';
import { SourceProvider } from './context/SourceContext'; // Импорт
const queryClient = new QueryClient();

// Создаем темную тему в стиле Dev.to/HackerNews
const theme = createTheme({
  palette: {
    mode: 'dark', // Включаем темный режим MUI
    primary: {
      main: '#ff8c00', // Наш оранжевый
    },
    background: {
      default: '#0b0e14', // Глубокий синий фон
      paper: '#161b22',   // Цвет карточек и панелей
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