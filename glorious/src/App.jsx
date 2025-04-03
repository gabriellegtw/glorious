import { useState, useRef } from 'react'
import micLogo from '/mic.svg'
import './App.css'

function App() {
  // useRef helps to store reference to something (persists data across re-renders)
  const recognitionRef = useRef();
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleOnRecord = async () => {
    // This function is to stop recording using the same botton to start recording
    if (isRecording) {
      console.log(text);
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRecorder.current = new MediaRecorder(stream);

    // Store audio data in chunks
    audioRecorder.current.ondataavailable = event => {
      audioChunks.current.push(event.data);
    };

    // When recording is stopped, send the audio to the backend
    audioRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      await sendAudioToBackend(audioBlob);
      audioChunks.current = [];  // Clear audio chunks for the next recording
    };

    audioRecorder.current.start();
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
