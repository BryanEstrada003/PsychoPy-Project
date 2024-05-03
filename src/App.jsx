import Chat from './components/Chat.jsx'
import React from 'react';
import './App.css';

import { GoogleGenerativeAI } from '@google/generative-ai';



function App() {
  //const apiKey

  //const genAI
  const apiKey = import.meta.env.VITE_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);


  const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"})

  console.log("apiKey", apiKey)

  return (
    <div className="container">
      <div id="div1">
        <h1>PsychoPy</h1>
        <Chat />
      </div>
      <div id="div2">
        <p>esto sera el chat</p>
      </div>
    </div>
  );
}

export default App;