import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Timeline from './components/Timeline'
import PostModal from './components/PostModal'
import AddPost from './components/AddPost'
import './App.css'

function App() {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false)

  // chiamata al database di supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
        *,
        moods(*),
        post_tags(
        tags(*)
          )
        `)
        .order('created_at', { ascending: false })

      console.log("Posts caricati:", data);

      if (error) {
        console.error('Errore nel recupero dei post:', error)
      } else {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  // modale dettaglio post
  const openModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
  };

  // modale aggiunta post
  const openAddModal = () => setAddModalOpen(true)
  const closeAddModal = () => setAddModalOpen(false)

  // callback da AddPost per aggiornare la lista
  const handlePostAdded = (newPost) => {
    setPosts([newPost, ...posts])
    closeAddModal() // chiude il form dopo il submit
  }

  if (loading) return <p>Caricamento in corso...</p>

  return (
    <div className="container">
      <h1 className="text-center my-4">Diario di viaggio</h1>

      {/* Bottone per aprire il form */}
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={openAddModal}>
          Aggiungi Post
        </button>
      </div>

      {/* Timeline dei post */}
      {posts.length === 0 ? (
        <p>Nessun post disponibile</p>
      ) : (
        <Timeline posts={posts} onPostClick={openModal} />
      )}

      {/* Modale per il dettaglio del post */}
      {modalOpen && (
        <PostModal post={selectedPost} onClose={closeModal} />
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
  )
}

export default App