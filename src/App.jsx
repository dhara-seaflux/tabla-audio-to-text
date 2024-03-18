import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY
  const [transcriptionText, setTranscriptionText] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  
  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Set loading to true when API call starts

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('model', 'whisper-1'); // append model parameter directly to FormData object
      formData.append('temperature' , 0.0)
  
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${API_KEY}`,
        },
        responseType: 'json', // Set responseType to 'json' to parse response as JSON
      });


      console.log(response.data);
      const { text } = response.data;
      setTranscriptionText(text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    } finally {
      setIsLoading(false); // Set loading to false when API call finishes
    }

  };

  return (
    <div className="app-container">
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingLeft:'7rem', paddingRight:'7rem'}}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Please Select Your Audio</h2>
        <input type="file" accept="audio/*" onChange={handleFileChange} style={{ marginLeft: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </div>
      <button
        style={{
          display: 'block',
          margin: '0 auto 20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
        onClick={handleSubmit}
      >
        Transcribe
      </button>
      {isLoading && <div className="loader"></div>}
        <div>
        <div style={{ marginBottom: '10px' , paddingLeft:'7rem'}}>
          <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px', textAlign: 'left' }}>Transcription:</h3>
        </div>
          <textarea
            defaultValue={transcriptionText || ""}
            rows="10"
            cols="50"
            style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              minWidth:'80%',
              resize: 'none'
            }}
          ></textarea>
        </div>
    </div>
  </div>
  
  
  );
}

export default App;

      // const reader = response.data.getReader();
      // let transcription = '';

      // Read data until done
      // eslint-disable-next-line no-constant-condition
      // while (true) {
      //   const { done, value } = await reader.read();

      //   // Append each chunk of data to the transcription
      //   transcription += new TextDecoder('utf-8').decode(value);

      //   if (done) break; // Break loop when all data is read
      // }