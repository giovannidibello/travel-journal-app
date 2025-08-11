import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Timeline from './components/Timeline'
import PostModal from './components/PostModal'
import './App.css'

function App() {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // chiamata al database di supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Errore nel recupero dei post:', error)
      } else {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  // gestisco apertura e chiusura modale al click
  const openModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
  };

  if (loading) return <p>Caricamento in corso...</p>

  return (
    <div className="container">
      <h1 className="text-center my-4">Diario di viaggio</h1>
      {posts.length === 0 ? (
        <p>Nessun post disponibile</p>
      ) : (
        <Timeline posts={posts} onPostClick={openModal} />
      )}
      {modalOpen && (
        <PostModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  )
}

export default App