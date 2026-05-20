import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css'

import App from './App.jsx'
import AboutPage from "./AboutPage.jsx";
import UserPage from "./UserPage.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route index element={<App />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="user/:userId" element={<UserPage />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
