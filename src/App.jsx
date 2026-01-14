import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

// NavBar Component
function NavBar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      <Link to="/about" style={{ color: 'white', marginRight: '1rem' }}>About</Link>
      <Link to="/directors" style={{ color: 'white' }}>Directors</Link>
    </nav>
  )
}

// Home Component
function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to the Movie Directory</h1>
      <p>Browse directors and their amazing films!</p>
    </div>
  )
}

// About Component
function About() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About the Movie Directory</h1>
      <p>This is a comprehensive database of movie directors and their films.</p>
    </div>
  )
}

// DirectorsList Component
function DirectorsList({ directors }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Directors</h1>
      <Link to="/directors/new">Add New Director</Link>
      <div style={{ marginTop: '2rem' }}>
        {directors.map(director => (
          <div key={director.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <Link to={`/directors/${director.id}`}>
              <h2>{director.name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// DirectorCard Component
function DirectorCard({ directors }) {
  const { id } = useParams()
  const director = directors.find(d => d.id === id)

  if (!director) {
    return <div style={{ padding: '2rem' }}>Director not found</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{director.name}</h1>
      <p>{director.bio}</p>
      <Link to={`/directors/${id}/movies/new`}>Add New Movie</Link>
      <h2>Movies</h2>
      <div style={{ marginTop: '1rem' }}>
        {director.movies && director.movies.map(movie => (
          <div key={movie.id} style={{ marginBottom: '1rem' }}>
            <Link to={`/directors/${id}/movies/${movie.id}`}>{movie.title}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// DirectorForm Component
function DirectorForm({ onAddDirector }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newDirector = {
      id: Date.now().toString(),
      name,
      bio,
      movies: []
    }
    onAddDirector(newDirector)
    navigate('/directors')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Director</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Add Director</button>
      </form>
    </div>
  )
}

// MovieCard Component
function MovieCard({ directors }) {
  const { id, movieId } = useParams()
  const director = directors.find(d => d.id === id)
  
  if (!director) {
    return <div style={{ padding: '2rem' }}>Director not found</div>
  }

  const movie = director.movies?.find(m => m.id === movieId)

  if (!movie) {
    return <div style={{ padding: '2rem' }}>Movie not found</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{movie.title}</h1>
      <h2>{movie.title}</h2>
      <p>Duration: {movie.time} minutes</p>
      <p>Genres: {movie.genres.join(', ')}</p>
    </div>
  )
}

// MovieForm Component
function MovieForm({ directors, onAddMovie }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [genres, setGenres] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMovie = {
      id: 'm' + Date.now(),
      title,
      time: parseInt(time),
      genres: genres.split(',').map(g => g.trim())
    }
    onAddMovie(id, newMovie)
    navigate(`/directors/${id}`)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Movie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input 
            type="number" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Genres (comma-separated):</label>
          <input 
            type="text" 
            value={genres} 
            onChange={(e) => setGenres(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  )
}

// Main App Component
function App() {
  const [directors, setDirectors] = useState([])

  useEffect(() => {
    fetch('/directors')
      .then(res => res.json())
      .then(data => setDirectors(data))
      .catch(err => console.error(err))
  }, [])

  const handleAddDirector = (newDirector) => {
    setDirectors([...directors, newDirector])
  }

  const handleAddMovie = (directorId, newMovie) => {
    setDirectors(directors.map(director => {
      if (director.id === directorId) {
        return {
          ...director,
          movies: [...(director.movies || []), newMovie]
        }
      }
      return director
    }))
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/directors" element={<DirectorsList directors={directors} />} />
        <Route path="/directors/new" element={<DirectorForm onAddDirector={handleAddDirector} />} />
        <Route path="/directors/:id" element={<DirectorCard directors={directors} />} />
        <Route path="/directors/:id/movies/new" element={<MovieForm directors={directors} onAddMovie={handleAddMovie} />} />
        <Route path="/directors/:id/movies/:movieId" element={<MovieCard directors={directors} />} />
      </Routes>
    </Router>
  )
}

export default App