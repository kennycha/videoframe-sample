import { useEffect, useState } from "react";

export const useCanvas = ({ recordedUrl, playingVideoRef, canvasRef }) => {
  const [frames, setFrames] = useState([]);
  useEffect(() => {
    const video = playingVideoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && recordedUrl) {
      const ctx = canvas.getContext('2d');
      const tempCanvas = document.createElement('canvas');
      tempCanvas.setAttribute('width', 600);
      tempCanvas.setAttribute('height', 400);
      const tempCtx = tempCanvas.getContext('2d');
      const computeFrame = () => {
        if (video.paused || video.ended) {
          return;
        }
        tempCtx.drawImage(video, 0, 0, video.offsetWidth / 2, video.offsetHeight / 3);
        const frame = tempCtx.getImageData(0, 0, video.offsetWidth / 2, video.offsetHeight / 3);
        setFrames([...frames, frame])
        ctx.putImageData(frame, 0, 0);
        setTimeout(computeFrame, 33);
      }

      video.addEventListener('play', computeFrame);
    }
    return () => {
      setFrames([]);
    }
  }, [canvasRef, playingVideoRef, recordedUrl])
  return frames;
};
