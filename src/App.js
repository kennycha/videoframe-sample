import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import _ from 'lodash';
import { useWebcam } from "./hooks/useWebcam";
import { useControlWebcam } from "./hooks/useControlWebcam";
import { useCanvas } from "./hooks/useCanvas";

const Video = styled.video`
  width: 600px;
  height: 400px;
`

const ButtonContainer = styled.div`
  width: 100%;
  height: 50px;
`

const Button = styled.button`
  width: 100px;
  height: 50px;
`

const ImgBoxContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  overflow-x: scroll;
`

const ImgBox = styled.img`
  width: 30px;
  height: 100%;
  object-fit: fill;
  cursor: pointer;
`

const PreviewBox = styled.img`
  width: 900px;
  height: 600px;
`


function App() {
  const [recordedUrl, setRecordedUrl] = useState(undefined);
  const [recorder, setRecorder] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const recordingVideoRef = useRef();
  const playingVideoRef = useRef();

  useWebcam({ setRecordedUrl, setRecorder, recordingVideoRef });

  const { 
    isRecording,
    handleStartClick,
    handleResetClick,
    handleStopClick, 
  } = useControlWebcam({ recorder, recordedUrl, setRecordedUrl });

  const {
    frames, images
  } = useCanvas({ recordedUrl, playingVideoRef });

  const handleSelectImage = (event) => {
    setPreviewImage(event.target.src);
  };

  useEffect(() => {
    console.log('frames: ', frames);
    console.log('images: ', images);
  }, [frames, images])

  const handleExportFrames = useCallback(() => {
    const blob = new Blob([JSON.stringify(frames)], { type: 'text/json' });
    const objURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'frames.json';
    a.href = objURL;
    a.click();
  }, [frames]);

  return (
    <>
      <Video ref={recordingVideoRef} height="100%" />
      {recordedUrl && <Video ref={playingVideoRef} src={recordedUrl} autoPlay controls />}
      <ButtonContainer>
        <Button onClick={isRecording ? undefined : handleStartClick}>Start</Button>
        <Button onClick={!recordedUrl ? undefined : handleResetClick}>Reset</Button>
        <Button onClick={!isRecording ? undefined : handleStopClick}>Stop</Button>
        <Button onClick={!recordedUrl ? undefined : handleExportFrames}>Export</Button>
      </ButtonContainer>
      {!_.isEmpty(images) && (
        <PreviewBox src={previewImage ?? images[0]} />
      )}
      {!_.isEmpty(images) && (
        <ImgBoxContainer>
          {_.map(images, (image, idx) => <ImgBox src={image} key={idx} alt="frame" draggable={false} onClick={handleSelectImage} />)}
        </ImgBoxContainer>
      )}
    </>
  );
}

export default App;
