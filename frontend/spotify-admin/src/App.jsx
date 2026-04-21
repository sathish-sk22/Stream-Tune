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
      <Route path="/login" element={<Login />} />
      <Route
        path="/add-song"
        element={
          <ProtectedRoute requiredAdmin>
            <AddSong />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list-songs"
        element={
          <ProtectedRoute requiredAdmin>
            <ListSong />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-album"
        element={
          <ProtectedRoute requiredAdmin>
            <AddAlbum />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/list-album"
        element={
          <ProtectedRoute requiredAdmin>
            <ListAlbum />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default App;
