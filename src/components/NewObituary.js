import React, { useState, useRef, useEffect } from "react";


export default function NewObituary(props) {
  const [displayParagraph, setDisplayParagraph] = useState(
    props.displayParagraph || false
  );
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);  

  const showDisplay = () => {
    setDisplayParagraph(!displayParagraph);
  };

  const handleAudioChange = () => {
    if (!audioRef.current) return;
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <main className="death-article">
      <img
        src={props.imageUrl}
        alt="person"
        className="dead-person-image"
        onClick={showDisplay}
      />
      <h2 className="dead-person-name">{props.fname}</h2>
      <h3 className="dead-person-dates">
        {props.bornDay} - {props.deathDay}
      </h3>

      {displayParagraph && (
        <>
          <p className="rest-in-peace">
            {props.modelResponses}
          </p>
          <button onClick={handleAudioChange} className="playButton">
          {isPlaying ? <>| |</> : <>&#9658;</>}
          </button>
          <audio
            ref={audioRef}
            src={props.audio}
          />{" "}
        </>
      )}
    </main>
  );
}
