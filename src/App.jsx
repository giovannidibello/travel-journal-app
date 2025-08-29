// App.jsx

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Timeline from './components/Timeline';
import PostModal from './components/PostModal';
import AddPost from './components/AddPost';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stati modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Recupero post da Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          moods(*),
          post_tags(tags(*))
        `)
      // .order('created_at', { ascending: false });

      console.log(data);


      if (error) {
        console.error('Errore nel recupero dei post:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Funzioni gestione modal
  const openModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
  };

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  // Aggiorna lista post dopo aggiunta
  const handlePostAdded = (newPost) => {
    setPosts([newPost, ...posts]);
    closeAddModal();
  };

  // Elimina post
  const handleDeletePost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      console.error("Errore nell'eliminazione del post:", error);
    } else {
      setPosts(posts.filter((p) => p.id !== postId));
      closeModal();
    }
  };

  // Modifica post
  const handleUpdatePost = async (updatedPost) => {
    const { error } = await supabase
      .from('posts')
      .update(updatedPost)
      .eq('id', updatedPost.id);

    if (error) {
      console.error("Errore nell'aggiornamento del post:", error);
    } else {
      setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
      closeModal();
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;

  return (
    <div className="container">
      <div className="text-center my-4">
        <img className="img_title" src="diario-title.png" alt="Diario di viaggio" />
      </div>

      <Timeline
        posts={posts}
        onPostClick={openModal}
        onAddPostClick={openAddModal}
        onPostAdded={handlePostAdded}
      />

      {/* Modale dettaglio post */}
      {modalOpen && (
        <PostModal
          post={selectedPost}
          onClose={closeModal}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost}
        />
      )}

      {/* Modale aggiunta post */}
      {addModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuovo Post</h5>
                <button type="button" className="btn-close" onClick={closeAddModal}></button>
              </div>
              <div className="modal-body">
                <AddPost onPostAdded={handlePostAdded} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
