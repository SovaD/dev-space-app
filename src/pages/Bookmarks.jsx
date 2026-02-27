import React, { useContext, useState } from 'react';
import { 
  Container, Typography, Box, Button, Card, CardContent, CardMedia, 
  Chip, IconButton, Dialog, DialogContent, AppBar, Toolbar, Slide 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Bookmark, LayoutGrid, Trash2, X, ExternalLink } from 'lucide-react';
import { BookmarkContext } from '../context/BookmarkContext';

// Анимация для модалки
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Bookmarks = () => {
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  
  // Состояния для управления чтением статьи
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleOpen = (article) => {
    setSelectedArticle(article);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            МОИ <span style={{ color: '#ff8c00' }}>ЗАКЛАДКИ</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b949e' }}>
            Сохранено статей: {bookmarks.length}
          </Typography>
        </Box>
        
        {bookmarks.length > 0 && (
          <Button 
            variant="outlined" 
            startIcon={<LayoutGrid size={18}/>}
            component={Link}
            to="/feed"
            sx={{ color: '#ff8c00', borderColor: '#ff8c00' }}
          >
            В ленту
          </Button>
        )}
      </Box>

      {bookmarks.length > 0 ? (
        <Box className="feed-grid">
          {bookmarks.map((article) => (
            <Box key={article.id} sx={{ display: 'flex', height: '100%' }}>
              <Card className="article-card">
                <CardMedia 
                  component="img" 
                  className="card-image" 
                  image={article.cover_image} 
                  onClick={() => handleOpen(article)}
                  sx={{ cursor: 'pointer' }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                    {(article.tag_list || []).slice(0, 2).map(tag => (
                      <Chip key={tag} label={`#${tag}`} className="tag-chip" />
                    ))}
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    className="article-title"
                    onClick={() => handleOpen(article)}
                    sx={{ cursor: 'pointer', '&:hover': { color: '#ff8c00' } }}
                  >
                    {article.title}
                  </Typography>

                  <Box className="card-footer">
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', fontWeight: 600, display: 'block' }}>
                        {article.user?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#545d68' }}>
                        {article.readable_publish_date}
                      </Typography>
                    </Box>
                    
                    <IconButton 
                      onClick={() => toggleBookmark(article)}
                      size="small"
                      sx={{ color: '#ff8c00' }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 15, bgcolor: '#161b22', borderRadius: 4, border: '2px dashed #30363d' }}>
          <Bookmark size={60} color="#30363d" style={{ marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ color: '#8b949e', mb: 3 }}>
            У вас пока нет сохраненных статей
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/feed"
            sx={{ bgcolor: '#ff8c00', '&:hover': { bgcolor: '#e67e00' }, fontWeight: 800, px: 4 }}
          >
            Найти что-нибудь интересное
          </Button>
        </Box>
      )}

      {/* --- МОДАЛЬНОЕ ОКНО ДЛЯ ЧТЕНИЯ (Copy-Paste из Feed) --- */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{ sx: { bgcolor: '#0b0e14', color: '#e6edf3' } }}
      >
        <AppBar sx={{ position: 'relative', bgcolor: '#161b22', borderBottom: '1px solid #30363d' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <X />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 700 }} variant="h6" noWrap>
              {selectedArticle?.title}
            </Typography>
            <IconButton color="inherit" href={selectedArticle?.link} target="_blank">
              <ExternalLink />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
          <Container maxWidth="md">
            <img 
              src={selectedArticle?.cover_image} 
              alt="" 
              style={{ width: '100%', borderRadius: '16px', marginBottom: '32px' }} 
            />
            <div 
              className="modal-content-html"
              dangerouslySetInnerHTML={{ __html: selectedArticle?.description }} 
            />
          </Container>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Bookmarks;