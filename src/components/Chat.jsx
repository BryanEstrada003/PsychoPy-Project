import React, { useState } from 'react';

const Chat = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
  
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };
  
    const handleSubmit = async () => {
      // Aquí invocarás la API de generación de texto
    };
  
    return (
      <div>
        <input type="text" value={input} placeholder="Enter your prompt here..." onChange={handleInputChange} />
        <button onClick={handleSubmit}>Generar</button>
        {output && <p>{output}</p>}
      </div>
    );
  };
  
  export default Chat;