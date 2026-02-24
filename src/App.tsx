import { BrowserRouter, Routes, Route } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/auth/protectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUpPage />} />
        <Route path="/Signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
