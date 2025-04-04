import { useState, useRef } from 'react'
import micLogo from '/mic.svg'
import axios from 'axios';
import './App.css'

function App() {
  // useRef helps to store reference to something (persists data across re-renders)
  const recognitionRef = useRef();
  // text was used for testing purposes
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  // This checks if there is a transcript (before being processed by chatgpt)
  const [output, setOutput] = useState("");
  // This is the text that will be displayed on the editable text box
  const [editableOutput, setEditableOutput] = useState("");

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

        // The below is to call on the chatgpt api to extract the relevant information from the transcript
        try {
          const response = await axios.post('http://localhost:3001/transcribe', {
            prompt: "Return relevant information for a caregiver (i.e vitals and mediacation taken). Respond only in the format of:" +
            + "Blood Pressure:.. \n Temperature:..., \n Pulse:.. \n Medication: ... and do not add additonal words" +
            "If there is no information given on something, do NOT add your own. Replace it with N/A" + "Try to infer the units and include it too for the below transcript: " + transcript,
          });
      
          console.log('Transcription:', response.data.message);
          setOutput(response.data.message);
          setEditableOutput(response.data.message);
        } catch (error) {
          console.error('Error with Axios:', error.message); // Handle error
        }
      
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

      {output && 
      <div className="w-full bg-white p-4 rounded-md shadow-md">
        <p 
          contentEditable={true}
          className="text-left text-gray-600 whitespace-pre-wrap"
          onInput={(e) => setEditableOutput(e.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {editableOutput}
        </p>
      </div>
      }
      
    </>
  )
}

export default App
