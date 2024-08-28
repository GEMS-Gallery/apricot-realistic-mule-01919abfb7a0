import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Grid, Card, CardContent, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

interface PostFormInputs {
  title: string;
  body: string;
  author: string;
}

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1641370604373-a81abd6cec2e?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ4NzgxNjV8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<PostFormInputs>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    try {
      setLoading(true);
      await backend.createPost(data.title, data.body, data.author);
      await fetchPosts();
      setModalIsOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Blog
          </Typography>
          <Button color="inherit" onClick={() => setModalIsOpen(true)}>
            New Post
          </Button>
        </Toolbar>
      </AppBar>

      <HeroSection>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            Crypto Blog
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Explore the latest insights and discussions in the world of cryptocurrency and blockchain technology.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="md">
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item key={Number(post.id)} xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.body.substring(0, 100)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="New Post Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input {...register('title', { required: true })} placeholder="Title" style={{ width: '100%', padding: '10px' }} />
            </Grid>
            <Grid item xs={12}>
              <textarea {...register('body', { required: true })} placeholder="Body" style={{ width: '100%', padding: '10px', minHeight: '100px' }} />
            </Grid>
            <Grid item xs={12}>
              <input {...register('author', { required: true })} placeholder="Author" style={{ width: '100%', padding: '10px' }} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </>
  );
};

export default App;
