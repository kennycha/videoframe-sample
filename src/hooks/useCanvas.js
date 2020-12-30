import { useEffect, useState } from "react";

export const useCanvas = ({ recordedUrl, playingVideoRef }) => {
  const [frames, setFrames] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const playingVideo = playingVideoRef.current;

    if (playingVideo && recordedUrl) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.setAttribute('width', 600);
      tempCanvas.setAttribute('height', 400);
      const tempCtx = tempCanvas.getContext('2d');
      const innerFrames = [];
      const innerImages = [];
      const computeFrame = () => {
        if (playingVideo.paused || playingVideo.ended) {
          setFrames(innerFrames);
          setImages(innerImages);
          return;
        }
        tempCtx.drawImage(playingVideo, 0, 0, playingVideo.offsetWidth, playingVideo.offsetHeight);
        const frame = tempCtx.getImageData(0, 0, playingVideo.offsetWidth, playingVideo.offsetHeight);
        innerFrames.push(frame);
        const image = tempCanvas.toDataURL('jpg');
        innerImages.push(image);
        setTimeout(computeFrame, 33);
      }
      playingVideo.addEventListener('play', computeFrame);
      // 녹화한 영상 데이터 로드 후 타임라인에 그릴 때까지 걸리는 시간은 loadstart / ended 로 핸들
      // playingVideo.addEventListener('loadstart', () => console.log('loadstart'));
      // playingVideo.addEventListener('ended', () => console.log('loadend'));
    }
    return () => {
      setFrames([]);
      setImages([]);
    }
  }, [playingVideoRef, recordedUrl])
  return {
    frames, images
  };
};
