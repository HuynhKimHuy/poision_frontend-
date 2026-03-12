import { BrowserRouter, Routes, Route } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/auth/protectedRoute';
import { useEffect } from 'react';

import { useThemeStore } from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from "./stores/socketStore";

function App() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { isDarkMode, setTheme } = useThemeStore();
  const { connectSocket , disconnectSocket} = useSocketStore()
  useEffect(() => {
    setTheme(isDarkMode);
  }, [isDarkMode]);
  
  useEffect(()=>{
    if(accessToken){
      connectSocket()
    } else{
      disconnectSocket()
    }
    return ()=> disconnectSocket()
  },[accessToken])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
