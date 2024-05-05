import Chat from './components/Chat.jsx'
import React, { useState } from 'react';
import './App.css';
import iconPage from './assets/icon-page.png';
import iconPageDark from './assets/icon-page - dark.png'; // Asegúrate de reemplazar './assets/icon-page-dark.png' con la ruta a tu archivo de imagen de icono oscuro
import nightModeIcon from './assets/night-mode.png';
import menuLight from './assets/menu-icon-light.png';
import menuDark from './assets/menu-icon-dark.png';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css';

function App() {
  // light dark mode
  const [darkMode, setDarkMode] = useState(false);

  //const apiKey
  //const genAI
  const apiKey = import.meta.env.VITE_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" })

  //console.log("apiKey", apiKey) //imprime el tezto del apikey en la consola // solo es para verificar

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div id="input" className={`${darkMode ? 'dark' : ''}`}>
        <div className="header">
        <img src={darkMode ? iconPageDark : iconPage} alt="PsychoPy icon" style={{width: '50px', height: '50px' }} />
          <h1>PsychoPy</h1>
          <div className="navbar">
            <div className="dropdown">
              <button className="dropbtn">
                <img src={darkMode ? menuDark : menuLight} />
              </button>
              <div className="dropdown-content">
                <button className={`button-${darkMode ? 'dark' : 'light'}`} onClick={() => setDarkMode(!darkMode)}>
                  <img src={nightModeIcon} alt="Night mode" /> Night mode
                </button>
              </div>
            </div>
          </div>
        </div>
        <Chat darkMode={darkMode} />

      </div>
      <div id="current-chat" className={`${darkMode ? 'dark' : ''}`}>
        <p>esto sera el chat</p>
      </div>
    </div>
  );
}

export default App;