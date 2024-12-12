import React from "react";
import "./Menu.css";
import { useState, useEffect } from "react";
import { useLocalStorage } from "./UseLocalStorage.js";
export default function Menu() {
  const [textInput, setTextInput] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [cards, setCards] = useState([]);
  const [local, setLocal] = useLocalStorage("cards", []);
  // READ DATA FROM LOCAL STORAGE
  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cards"));
    setCards(storedCards);
  }, []);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedDay(event.target.value);
  };
  // CREATE AND UPDATE DATA IN LOCALSTORAGE
  const handleSubmit = (event) => {
    event.preventDefault();
    let cardUpdated = false;

    for (let ca of cards) {
      if (ca.day === selectedDay) {
        ca.text = textInput; // Update the existing card's text
        cardUpdated = true;
        setLocal([...cards]);
        break; // Exit the loop
      }
    }

    if (!cardUpdated) {
      // Add new card if no match is found
      setCards([...cards, { text: textInput, day: selectedDay }]);
      setLocal([...cards, { text: textInput, day: selectedDay }]);
    }

    // Reset the input fields
    setTextInput("");
    setSelectedDay("");
  };
  return (
    <>
      
      <div className="title">
        <h1>Lunch Menu</h1>
      </div>
      <div className="title">
        <p>use Local Storage</p>
      </div>

      <form className="Form" onSubmit={handleSubmit}>
        <label className="Form_items" htmlFor="textInput">
          Food Item:
        </label>
        <input
          className="Form_items"
          type="text"
          id="textInput"
          value={textInput}
          onChange={handleInputChange}
          placeholder="Tandori Chicken..."
          required
        />

        <label className="Form_items" htmlFor="daySelect">
          Select Day:
        </label>
        <select
          className="Form_items"
          id="daySelect"
          value={selectedDay}
          onChange={handleSelectChange}
          required
        >
          <option value="" disabled>
            Choose a day
          </option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>

        <button className="Form_items" type="submit">
          Create
        </button>
      </form>

      <div className="table">
        <div><h4>Day</h4></div>
        <div><h4>Food Items</h4></div>
        <div><h4>Action</h4></div>
      </div>

      <div>
        {cards.map((card) => (
          <div key={card.day} className="table">
            <p style={{ width: "100px" }}>{card.day}</p>
            <p> {card.text}</p>
            <p>
              <button
                onClick={() => {
                  setTextInput(card.text);
                  setSelectedDay(card.day);
                }}
              >
                Update
              </button>
              {/* DELETE DATA FROM LOCAL STORAGE */}
              <button
                onClick={() => {
                  // Filter out the card to be deleted
                  const updatedCards = cards.filter((c) => c.day !== card.day);
                  // Update state
                  setCards(updatedCards);

                  setLocal(updatedCards);
                }}
              >
                Delete
              </button>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
