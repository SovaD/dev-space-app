import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Container, Card, CardContent, CardMedia, Typography, Box, Skeleton, Chip, IconButton, Dialog, DialogContent, AppBar, Toolbar, Slide } from '@mui/material';
import { Bookmark, X, ExternalLink } from 'lucide-react';
import { BookmarkContext } from '../context/BookmarkContext';
import { SourceContext } from '../context/SourceContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// УМНЫЙ ЗАГРУЗЧИК
const fetchArticles = async (source) => {
  if (source === 'habr') {
    const rssUrl = 'https://habr.com/ru/rss/articles/';
    const { data } = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    const extractImage = (html) => {
      const match = html.match(/<img[^>]+src="([^">]+)"/);
      return match ? match[1] : null;
    };
    return data.items.map(item => ({
      id: item.guid,
      title: item.title,
      cover_image: item.thumbnail || extractImage(item.description) || 'https://placehold.co/600x337/161b22/ff8c00?text=Habr',
      tag_list: item.categories || [],
      user: { name: item.author || 'Хабраюзер' },
      readable_publish_date: new Date(item.pubDate).toLocaleDateString('ru-RU'),
      description: item.description,
      link: item.link
    }));
  } else {
    const { data } = await axios.get('https://dev.to/api/articles?top=20');
    return data.map(article => ({
      id: article.id.toString(),
      title: article.title,
      cover_image: article.cover_image || 'https://placehold.co/600x337/161b22/ff8c00?text=Dev.to',
      tag_list: article.tag_list || [],
      user: { name: article.user.name },
      readable_publish_date: article.readable_publish_date,
      description: article.description || article.title, // Dev.to не отдает весь HTML в этом API
      link: article.url
    }));
  }
};

const Feed = () => {
  const { source } = useContext(SourceContext);
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', source], // Важно: добавляем source в ключ, чтобы данные обновлялись
    queryFn: () => fetchArticles(source),
  });

  const handleOpen = (article) => { setSelectedArticle(article); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelectedArticle(null); };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, letterSpacing: 1, textTransform: 'uppercase' }}>
        ЛЕНТА: {source}
      </Typography>
      
      <Box className="feed-grid">
        {isLoading ? (
          Array.from(new Array(6)).map((_, i) => <Skeleton key={i} variant="rectangular" height={250} sx={{ bgcolor: '#161b22', borderRadius: 2 }} />)
        ) : (
          articles?.map((article) => {
            const isBookmarked = bookmarks.some(b => b.id === article.id);
            return (
              <Box key={article.id} sx={{ display: 'flex' }}>
                <Card className="article-card">
                  <CardMedia component="img" className="card-image" image={article.cover_image} onClick={() => handleOpen(article)} sx={{ cursor: 'pointer' }} />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                      {article.tag_list.slice(0, 2).map(tag => <Chip key={tag} label={`#${tag}`} className="tag-chip" />)}
                    </Box>
                    <Typography variant="h6" className="article-title" onClick={() => handleOpen(article)} sx={{ cursor: 'pointer', '&:hover': { color: '#ff8c00' } }}>
                      {article.title}
                    </Typography>
                    <Box className="card-footer">
                      <Typography variant="caption" sx={{ color: '#8b949e' }}>{article.user.name}</Typography>
                      <IconButton onClick={() => toggleBookmark(article)} sx={{ color: isBookmarked ? '#ff8c00' : '#8b949e' }}>
                        <Bookmark size={22} fill={isBookmarked ? "#ff8c00" : "none"} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })
        )}
      </Box>

      {/* Модалка та же самая */}
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { bgcolor: '#0b0e14', color: '#e6edf3' } }}>
        <AppBar sx={{ position: 'relative', bgcolor: '#161b22', borderBottom: '1px solid #30363d' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}><X /></IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 700 }} variant="h6" noWrap>{selectedArticle?.title}</Typography>
            <IconButton color="inherit" href={selectedArticle?.link} target="_blank"><ExternalLink /></IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
          <Container maxWidth="md">
            <img src={selectedArticle?.cover_image} alt="" style={{ width: '100%', borderRadius: '16px', marginBottom: '32px' }} />
            <div className="modal-content-html" dangerouslySetInnerHTML={{ __html: selectedArticle?.description }} />
          </Container>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Feed;