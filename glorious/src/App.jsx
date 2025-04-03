import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import './App.css'

function App() {
  // App.jsx file is like the picture frame that holds the 
  // different pages (eg home).
  // The different pages are like pictures in the frame

  return (
    <BrowserRouter>
      <Routes>
        {/* This route with path="/" is the default/home page */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
