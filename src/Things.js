import React from "react";

export default function Things() {

    return(
        <div className="all-obituaries">
        {obituariesList.map((obituary, index) => (
          <NewObituary
            className="death-article"
            key={index}
            fname={obituary.fname}
            bornDay={obituary.bornDay}
            deathDay={obituary.deathDay}
            imageUrl={obituary.imageUrl}
            // modelResponses={obituary.modelResponses}
            // audio={obituary.audio}
          ></NewObituary>
        ))}
      </div>
  
    );
  

};