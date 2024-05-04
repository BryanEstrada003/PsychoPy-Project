import Chat from './components/Chat.jsx'
import React, { useState } from 'react';
import './App.css';
import nightModeIcon from './assets/night-mode.png';
import { GoogleGenerativeAI } from '@google/generative-ai';



function App() {
  // light dark mode
  const [darkMode, setDarkMode] = useState(false);
  //const apiKey

  //const genAI
  const apiKey = import.meta.env.VITE_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);


  const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})

  console.log("apiKey", apiKey)

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div id="input">
        <h1>PsychoPy</h1>
        <Chat />
        <button onClick={() => setDarkMode(!darkMode)}>
          <img src={nightModeIcon} alt="Night mode" />
        </button>
      </div>
      <div id="current-chat">
        <p>esto sera el chat</p>
      </div>
    </div>
  );
}

export default App;