import { useState, useRef } from 'react'
import micLogo from '/mic.svg'
import './App.css'

function App() {
  // useRef helps to store reference to something (persists data across re-renders)
  const recognitionRef = useRef();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  function handleOnRecord() {
    // This function is to stop recording using the same botton to start recording
    if (isRecording) {
      console.log(text);
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
    }

    recognitionRef.current.onresult = async function(event) {
      console.log('event', event);
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    }
    recognitionRef.current.start();
  }

  return (
    <>
      <div>
        <a>
          <img onClick={handleOnRecord} src={micLogo} className="logo" alt="Mic logo" />
        </a>
      </div>
      
      {isRecording && <p> is recording </p>}

      <p className="read-the-docs">
        Spoken Text: {text}
      </p>
    </>
  )
}

export default App
