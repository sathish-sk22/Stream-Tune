import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AddAlbum from './pages/AddAlbum';
import AddSong from './pages/AddSong';
import ListAlbum from './pages/ListAlbum';
import ListSong from './pages/ListSong';
import Login from './pages/Login';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/add-song"
        element={
          <ProtectedRoute>
            <AddSong />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list-songs"
        element={
          <ProtectedRoute>
            <ListSong />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-album"
        element={
          <ProtectedRoute>
            <AddAlbum />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list-album"
        element={
          <ProtectedRoute>
            <ListAlbum />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
