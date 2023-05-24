import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewObituary from "./components/NewObituary";
import { v4 as uuidv4 } from "uuid";
import CustomFileUploadButton from "./components/CustomFileUploadButton";
import Empty from "./Empty";

export default function Layout() {
  const [writingPopup, setWritingPopup] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fNameMessage, setMessage] = useState("");
  const [bornDay, setBornDay] = useState("");
  const [deathDay, setDeathDay] = useState("");
  const [obituaries, setObituaries] = useState([]);
  const [audioLink, setAudioLink] = useState("");
  const [chatGPTtext, setChatGPTtext] = useState("");
  const [isNewObituaryAdded, setIsNewObituaryAdded] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  let get_obituaries_url = 'YOUR_GET_OBITUARIES_URL';
  let post_obituary_url = 'YOUR_POST_OBITUARY_URL';

  useEffect(() => {
    get_obituaries();
    console.log("useEffect")
    console.log(obituaries)
  }, []);

  const get_obituaries = async() => {
    fetch(get_obituaries_url)
      .then(response => response.json())
      .then(data => setObituaries(data))
      .catch(error => console.error("Error fetching: " + error));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageUrl(file);
  };

  const handleImageFileChange = (event) => {
    handleImageChange(event);

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    setFile(file);
  };

  const handleNameChange = (event) => {
    setMessage(event.target.value);
  };

  const handleBornDayChange = (event) => {
    setBornDay(event.target.value);
  };

  const handleDeathDayChange = (event) => {
    setDeathDay(event.target.value);
  };

  const handleSubmit = async (event) => {
    setButtonDisabled(true);
    event.preventDefault();
    if (fNameMessage.trim() === "") {
      return;
    }

    console.log("Posting obituary" + imageUrl);
    const formData = new FormData();

    formData.append('uuid', uuidv4());
    formData.append('audio', audioLink);
    formData.append('image', imageUrl);
    formData.append('name', fNameMessage);
    formData.append('born', bornDay);
    formData.append('death', deathDay);
    formData.append('time', Math.round(new Date().getTime() / 1000));
    formData.append('text', chatGPTtext);
  
    const res = await fetch(post_obituary_url, {
      method: 'POST',
      body: formData,
    });

    setButtonDisabled(false);

    setAudioLink("");
    setChatGPTtext("");
    setBornDay("");
    setDeathDay("");
    setMessage("");
    setFile(null);
    setImageUrl(null);

    setIsNewObituaryAdded(true);
    get_obituaries();
    setWritingPopup(false);
    event.target.reset();
  };

  const cancelOut = () => {
    setAudioLink("");
    setChatGPTtext("");
    setBornDay("");
    setDeathDay("");
    setMessage("");
    setFile(null);
    setImageUrl(null);
    setWritingPopup(false);
  };

  return (
    <div id="container">
      <header>
        <div id="app-header">
          <h1>
            <Link to="/">
              &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;The Last Show
            </Link>
          </h1>
        </div>
        <button id="new-note-button" onClick={() => setWritingPopup(true)}>
          + &nbsp; New Obituary{" "}
        </button>{" "}
      </header>
      <div id="main-container">
        <div id="write-box">
          {writingPopup && (
            <div id="new-death">
              <div id="new-death-inner">
                <button
                  id="cancel-out-of-generation"
                  onClick={() => cancelOut()}
                >
                  <img
                    src="/cancelOut.png"
                    width="20px"
                    height="20px"
                    alt="cancel out of generation"
                  />
                </button>
                <main className="popup-window">
                  <h1> Create a New Obituary </h1>
                  <div>
                    <img
                      id="generator-divider"
                      src="/divider.jpg"
                      width="20%"
                      alt="divider"
                    />
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div>
                      <CustomFileUploadButton
                        onChange={handleImageFileChange}
                      />
                      {file && (
                        <span id="highlighted-file-upload">
                          ({file.name})
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        id="fname"
                        placeholder="Name of the deceased"
                        name="fname"
                        onChange={handleNameChange}
                        required
                        value={fNameMessage}
                      />
                    </div>

                    <div id="generating-dates">
                      <label htmlFor="bornDay">
                        <i>Born: &nbsp; </i>
                      </label>
                      <input
                        onChange={handleBornDayChange}
                        type="date"
                        id="bornDay"
                        name="bornDay"
                        required
                      />

                      <label htmlFor="deathDay">
                        <i> &nbsp; &nbsp; Died: &nbsp; </i>
                      </label>
                      <input
                        onChange={handleDeathDayChange}
                        type="date"
                        id="deathDay"
                        name="deathDay"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="submit"
                        className={
                          buttonDisabled
                            ? "generate-obituary-button-disabled"
                            : "generate-obituary-button"
                        }
                        value={
                          buttonDisabled
                            ? "Please wait. It's not like they're going to be late or something..."
                            : "Write Obituary"
                        }
                        disabled={buttonDisabled}
                      />
                    </div>
                  </form>
                </main>
              </div>
            </div>
          )}

          <div className="all-obituaries">
            {obituaries.length === 0 && <Empty></Empty>}
            {obituaries.map((obituary, index) => (
              <NewObituary
                className="death-article"
                key={index}
                fname={obituary.name}
                bornDay={obituary.born}
                deathDay={obituary.death}
                imageUrl={obituary.image}
                modelResponses={obituary.text}
                audio={obituary.audio}
                displayParagraph={isNewObituaryAdded || false}
              ></NewObituary>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
