import { useEffect, useState } from "react";
import _ from 'lodash';

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

      let currentTime = 0;
      const getFrames = () => {
        if (playingVideo.ended || (currentTime > playingVideo.duration) || (playingVideo.duration - currentTime) < 1 / 30) {
          console.log('innerFrames.length: ', innerFrames.length)
          console.log('innerImages.length: ', innerImages.length)
          setFrames(innerFrames);
          setImages(innerImages);
          currentTime = 0;
          return;
        }
        playingVideo.currentTime = currentTime;
        tempCtx.drawImage(playingVideo, 0, 0, playingVideo.offsetWidth, playingVideo.offsetHeight);
        const frame = tempCtx.getImageData(0, 0, playingVideo.offsetWidth, playingVideo.offsetHeight);
        innerFrames.push(frame);
        const image = tempCanvas.toDataURL('jpg');
        innerImages.push(image);
        console.log('playingVideo.currentTime: ', playingVideo.currentTime);
        console.log('playingVideo.duration: ', playingVideo.duration);
        currentTime += 1 / 30;
        getFrames();
      }
      // playingVideo.play();
      // getFrames();
      playingVideo.addEventListener('loadedmetadata', function () {
        if (playingVideo.duration === Infinity) {
          playingVideo.currentTime = 1e101;
          playingVideo.ontimeupdate = function () {
            this.ontimeupdate = () => {
                return;
            }
            playingVideo.currentTime = 0;
            return;
          }
        }
      });
      playingVideo.addEventListener('play', getFrames);
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
