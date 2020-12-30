import { useEffect, useState } from "react";

export const useCanvas = ({ recordedUrl, playingVideoRef, canvasRef }) => {
  const [frames, setFrames] = useState([]);
  useEffect(() => {
    const playingVideo = playingVideoRef.current;
    const canvas = canvasRef.current;

    if (playingVideo && canvas && recordedUrl) {
      const ctx = canvas.getContext('2d');
      const tempCanvas = document.createElement('canvas');
      tempCanvas.setAttribute('width', 600);
      tempCanvas.setAttribute('height', 400);
      const tempCtx = tempCanvas.getContext('2d');
      const innerFrames = [];
      const computeFrame = () => {
        if (playingVideo.paused || playingVideo.ended) {
          setFrames(innerFrames);
          return;
        }
        tempCtx.drawImage(playingVideo, 0, 0, playingVideo.offsetWidth / 2, playingVideo.offsetHeight / 3);
        const frame = tempCtx.getImageData(0, 0, playingVideo.offsetWidth / 2, playingVideo.offsetHeight / 3);
        innerFrames.push(frame);
        ctx.putImageData(frame, 0, 0);
        setTimeout(computeFrame, 33);
      }
      playingVideo.addEventListener('play', computeFrame);
    }
    return () => {
      setFrames([]);
    }
  }, [canvasRef, playingVideoRef, recordedUrl])
  return frames;
};
