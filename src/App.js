import { useRef, useState } from "react";
import styled from "styled-components";
import { useWebcam } from "./hooks/useWebcam";
import { useControlWebcam } from "./hooks/useControlWebcam";
import { useCanvas } from "./hooks/useCanvas";

const Video = styled.video`
  width: 600px;
  height: 400px;
`

const Canvas = styled.canvas`
  width: 600px;
  height: 400px;
`

const ButtonContainer = styled.div`
  width: 100%;
  height: 100px;
`

const Button = styled.button`
  height: 50px;
  width: 100px;
`

const ImgBoxContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  overflow-x: scroll;
`

const ImgBox = styled.div`
  width: 10px;
  height: 100%;
`

function App() {
  const [recordedUrl, setRecordedUrl] = useState(undefined);
  const [recorder, setRecorder] = useState(undefined);
  const recordingVideoRef = useRef();
  const playingVideoRef = useRef();
  const canvasRef = useRef();

  useWebcam({ setRecordedUrl, setRecorder, recordingVideoRef });

  const { 
    isRecording,
    onStartClick,
    onResetClick,
    onStopClick, 
  } = useControlWebcam({ recorder, recordedUrl, setRecordedUrl })

  const frames = useCanvas({ recordedUrl, playingVideoRef, canvasRef })

  const handleExportFrames = () => {
    // console.log(frames);
    const blob = new Blob([JSON.stringify(frames[0])], { type: 'text/json' });
    const objURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'frames.json';
    a.href = objURL;
    a.click();
  }

  return (
    <>
      <Video ref={recordingVideoRef} height="100%" />
      {recordedUrl && <Video ref={playingVideoRef} src={recordedUrl} autoPlay controls />}
      {recordedUrl && <Canvas ref={canvasRef} />}
      <ButtonContainer>
        <Button onClick={isRecording ? undefined : onStartClick}>Start</Button>
        <Button onClick={!recordedUrl ? undefined : onResetClick}>Reset</Button>
        <Button onClick={!isRecording ? undefined : onStopClick}>Stop</Button>
        <Button onClick={!recordedUrl ? undefined : handleExportFrames}>Export</Button>
      </ButtonContainer>
      <ImgBoxContainer>
        <ImgBox />
        <ImgBox />
      </ImgBoxContainer>
    </>
  );
}

export default App;
