import React, { useEffect, useRef } from "react";
import { config } from "../../../util/const";

function NotifSound({ play = false }) {
  const audioPlayer = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      audioPlayer.current.load();
      audioPlayer.current.play();
      audioPlayer.current.loop = true;
    };

    if (play && config === "prod") playAudio();
    else audioPlayer.current.pause();
  }, [play]);

  return (
    <audio
      ref={audioPlayer}
      src={"/sound/oppo-message.mp3"}
      style={{ display: "none" }}
    />
  );
}

export default NotifSound;
