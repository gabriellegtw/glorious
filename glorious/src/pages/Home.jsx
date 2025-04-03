import React, { useState } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

const Home = () => {
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [transcription, setTranscription] = useState("");

  const handleStopRecording = (blobUrl) => {
    setMediaBlobUrl(blobUrl); // Store the media URL
    // Send the recording to your backend for transcription
    sendAudioForTranscription(blobUrl);
  };

  const sendAudioForTranscription = (audioUrl) => {
    const formData = new FormData();
    formData.append("audio", audioUrl);

    fetch("http://localhost:5000/transcribe", { // Replace with your backend URL
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        setTranscription(data.transcription); // Display the transcription
      })
      .catch((error) => console.error("Error transcribing audio:", error));
  };

  return (
    <div>
      <h2>Audio Recorder</h2>

      <ReactMediaRecorder
        video={false}
        audio={true}
        onStop={handleStopRecording}
        render={(state) => {
          const { status, startRecording, stopRecording, mediaBlobUrl } = state;

          return (
            <div>
              <p>Status: {status}</p>

              {status === "idle" || status === "stopped" ? (
                <button onClick={startRecording}>Start Recording</button>
              ) : (
                <button onClick={stopRecording}>Stop Recording</button>
              )}

              {mediaBlobUrl && (
                <div>
                  <h3>Recording Complete</h3>
                  <audio src={mediaBlobUrl} controls />
                </div>
              )}

              {transcription && (
                <div>
                  <h3>Transcription</h3>
                  <p>{transcription}</p>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Home;