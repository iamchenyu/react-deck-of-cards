import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Card from "./Card";
import "./Cards.css";

const BASE_URL = "https://deckofcardsapi.com/api/deck";
let deck_id = null;

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const showcase = useRef();

  // Get a brand new deck of card for the 1st render
  useEffect(() => {
    const createNewDeck = async () => {
      const { data } = await axios.get(`${BASE_URL}/new/shuffle`);
      deck_id = data.deck_id;
      setRemaining(data.remaining);
    };
    createNewDeck();
  }, []);

  const drawCardHandler = async () => {
    const { data } = await axios.get(`${BASE_URL}/${deck_id}/draw`);

    const randNum = Math.ceil(Math.random() * 180);
    const direction = Math.random() < 0.5 ? 1 : -1;
    const randDeg = randNum * direction;

    setCards((cards) => [
      ...cards,
      { ...data.cards[0], angel: randDeg, id: uuid() },
    ]);

    setRemaining(data.remaining);
  };

  const restartHandler = async () => {
    // Option 1: update "cards" state
    setCards((cards) => []);

    // Option 2: clear all cards in the DOM
    // showcase.current.innerHTML = "Loading...";

    // make API call to shuffle the card
    const { data } = await axios.get(`${BASE_URL}/${deck_id}/shuffle`);

    // update "remaining" state
    setRemaining(data.remaining);
  };

  const renderCards = cards.map((card) => (
    <Card
      key={card.id}
      img={card.image}
      alt={"image of " + card.suit + " " + card.value}
      angel={card.angel}
    />
  ));

  return (
    <div className="Cards">
      <p className="Cards-remain">
        There are {remaining} card remaining in the current deck.
      </p>
      {/* Option 1 - show "Draw" or "Restart" Button */}
      {/* {showDrawBtn ? (
        <button onClick={drawCardHandler} className="Cards-button">
          Draw
        </button>
      ) : (
        <button
          onClick={restartHandler}
          className="Cards-button"
          style={{ backgroundColor: "yellow" }}
        >
          Restart
        </button>
      )} */}

      {/* Option 2 - show "Draw" or "Restart" Button */}
      {remaining === 0 ? (
        <button
          onClick={restartHandler}
          className="Cards-button"
          style={{ backgroundColor: "gold" }}
        >
          Restart
        </button>
      ) : (
        <button onClick={drawCardHandler} className="Cards-button">
          Draw
        </button>
      )}

      <div className="Cards-show" ref={showcase}>
        {cards.length !== 0 ? renderCards : "Loading..."}
      </div>
    </div>
  );
};

export default Cards;
