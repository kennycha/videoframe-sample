import { useState } from "react";
import _ from 'lodash';

const VIDEO_TYPE = 'webm';

export const useControlWebcam = ({ recorder, recordedUrl, setRecordedUrl }) => {
  const [isRecording, setIsRecording] = useState(false);

  const onStartClick = () => {
    if (!_.isEmpty(recordedUrl)) {
      setRecordedUrl(undefined);
    }
    if (recorder) {
      if (recorder.state === 'paused') {
        recorder.resume();
      } else {
        recorder.start();
      }
      setIsRecording(true);
    }
  };

  const onResetClick = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
    setIsRecording(false);
    setRecordedUrl(undefined);
  };

  const onStopClick = () => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    onStartClick,
    onResetClick,
    onStopClick,
  }
}