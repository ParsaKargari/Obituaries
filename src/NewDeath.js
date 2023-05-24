import React, { useState, useEffect } from "react";
import CustomFileUploadButton from "./components/CustomFileUploadButton";
import { v4 as uuidv4 } from 'uuid';

export const obituariesList = [];

export default function NewDeath(props) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fNameMessage, setMessage] = useState("");
  const [bornDay, setBornDay] = useState("");
  const [deathDay, setDeathDay] = useState("");
  const [obituaries, setObituaries] = useState([]);
  const [audioLink, setAudioLink] = useState("");
  const [chatGPTtext, setChatGPTtext] = useState("");

  let get_obituaries_url = 'YOUR_GET_OBITUARIES_URL';
  let post_obituary_url = 'YOUR_POST_OBITUARY_URL';

  useEffect(() => {
    get_obituaries();
  }, []);

  const get_obituaries = async () => {
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
  }

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
    event.preventDefault();
    if (fNameMessage.trim() === "") {
      return;
    }

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

    get_obituaries();
    props.setTrigger(false);
    event.target.reset();
  };

  return props.trigger ? (
    <div id="new-death">
      <div id="new-death-inner">
        <button
          id="cancel-out-of-generation"
          onClick={() => props.setTrigger(false)}
        >
          <img src='/cancelOut.png' width='20px' height='20px' alt='cancel out of generation'/>
        </button>
        <main className="popup-window">
          <h1> Create a New Obituary </h1>
          <div>
            <img id="generator-divider" src="/divider.jpg" width="20%" alt="divider" />
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <CustomFileUploadButton onChange={handleImageFileChange} />
              {file && <span id="highlighted-file-upload">({file.name})</span>}
              {/* {imageUrl} <- this is the link */}
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
              <input onChange={handleBornDayChange} type="date" id="bornDay" name="bornDay" />

              <label htmlFor="deathDay">
                <i> &nbsp; &nbsp; Died: &nbsp; </i>
              </label>
              <input onChange={handleDeathDayChange} type="date" id="deathDay" name="deathDay" />
            </div>

            <div>
              <input
                type="submit"
                className="generate-obituary-button"
                value="Write Obituary"
              />{" "}
            </div>

          </form>

          {/* must check that death date is after birth date
          must check that birth date is not in the future */}
        </main>
      </div>

      {props.children}
    </div>
  ) : null;
}
