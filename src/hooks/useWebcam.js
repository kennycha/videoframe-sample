import { useEffect } from "react";

const CONSTRAINT_OBJ = {
  audio: false,
  video: {
    facingMode: 'user',
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  },
};

const VIDEO_TYPE = 'webm';

export const useWebcam = ({ setRecordedUrl, setRecorder, recordingVideoRef }) => {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(CONSTRAINT_OBJ)
      .then((mediaStreamObj) => {
        const video = recordingVideoRef.current;

        if (video) {
          if ('srcObject' in video) {
            video.srcObject = mediaStreamObj;
          }
          video.onloadedmetadata = () => {
            video.play();
          };
        }

        const mediaRecorder = new MediaRecorder(mediaStreamObj);
        setRecorder(mediaRecorder);
        
        let chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: `video/${VIDEO_TYPE}` });
          chunks = [];
          const videoURL = window.URL.createObjectURL(blob);
          setRecordedUrl(videoURL);
        };
      })
      .catch((error) => {
        console.log(error.name, error.message);
      });
  }, [recordingVideoRef, setRecordedUrl, setRecorder])
};