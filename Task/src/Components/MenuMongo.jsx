import React from "react";
import "./Menu.css";
import { useState, useEffect } from "react";
export default function MenuMongo() {
  const [textInput, setTextInput] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [cards, setCards] = useState([]);

  // READ DATA FROM MONGODB
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Sending a GET request to fetch cards from the backend
        const response = await fetch("http://98.85.166.161:3000/cards");

        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }

        const data = await response.json();
        setCards(data);
        // Save the response data in the state
      } catch (error) {
        setError(error.message); // Set the error if the fetch fails
      }
    };

    fetchCards();
  }, []);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedDay(event.target.value);
  };
  // CREATE AND UPDATE DATA IN MONGODB
  const handleSubmit = async (e) => {
    e.preventDefault();

    let cardUpdated = false;

    // Update the existing card if the day matches
    const updatedCards = cards.map((ca) => {
      if (ca.day === selectedDay) {
        cardUpdated = true;
        return { ...ca, text: textInput }; // Update the card's text
      }
      return ca; // Leave other cards unchanged
    });

    if (cardUpdated) {
      // Update the state with the updated cards
      setCards(updatedCards);

      // Find and send the updated card to the backend
      const updatedCard = updatedCards.find((c) => c.day === selectedDay);
      console.log("Sending updated card:", updatedCard);
      await sendCardsToBackend([updatedCard]);
    } else {
      // Add a new card if no match is found
      const newCard = { text: textInput, day: selectedDay };
      const newCards = [...cards, newCard];
      setCards(newCards);

      console.log("Sending new card:", newCard);
      await sendCardsToBackend([newCard]);
    }

    // Reset the input fields
    setTextInput("");
    setSelectedDay("");
  };

  // Function to send data to the backend
  const sendCardsToBackend = async (data) => {
    try {
      const response = await fetch("http://98.85.166.161:3000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send only the updated or new card(s)
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      const result = await response.json();
      console.log("Data sent successfully:", result);
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  };

  return (
    <>
      
      <div className="title">
        <h1>Dinner Menu</h1>
      </div>
      
      
      <div className="title">
        <p>use MONGODB</p>
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
          Submit
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
              {/* DELETE DATA FROM MONGODB */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `http://98.85.166.161:3000/message/${card.day}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to delete data");
                    }

                    const result = await response.json();
                    console.log("Data deleted successfully:", result);

                    const updatedCards = cards.filter(
                      (c) => c.day !== card.day
                    );
                    // Update state
                    setCards(updatedCards);
                  } catch (error) {
                    console.error("Error deleting data:", error.message);
                  }
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
