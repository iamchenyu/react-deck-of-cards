import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Card from "./src/Card";
import "./Cards.css";

const BASE_URL = "https://deckofcardsapi.com/api/deck";
let deck_id = null;

const CardsAuto = () => {
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const createNewDeck = async () => {
      const { data } = await axios.get(`${BASE_URL}/new/shuffle`);
      deck_id = data.deck_id;
      setRemaining(data.remaining);
    };
    createNewDeck();
    return clearInterval(intervalId);
  }, []);

  const drawCardHandler = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      setIntervalId(
        setInterval(async () => {
          const { data } = await axios.get(`${BASE_URL}/${deck_id}/draw`);

          const randNum = Math.ceil(Math.random() * 180);
          const direction = Math.random() < 0.5 ? 1 : -1;
          const randDeg = randNum * direction;

          setCards((cards) => [
            ...cards,
            { ...data.cards[0], angel: randDeg, id: uuid() },
          ]);

          setRemaining(data.remaining);
        }, 1000)
      );
    }
  };

  if (cards.length === 52) {
    clearInterval(intervalId);
    setIntervalId(null);
    setCards((cards) => []);
  }

  const restartHandler = async () => {
    const { data } = await axios.get(`${BASE_URL}/${deck_id}/shuffle`);
    setRemaining(data.remaining);
  };

  const renderCards =
    cards.length !== 0
      ? cards.map((card) => (
          <Card
            key={card.id}
            img={card.image}
            alt={"image of " + card.suit + " " + card.value}
            angel={card.angel}
          />
        ))
      : "Loading...";

  return (
    <div className="Cards">
      <p className="Cards-remain">
        There are {remaining} card remaining in the current deck.
      </p>

      {remaining === 0 ? (
        <button onClick={restartHandler} className="Cards-button">
          Restart
        </button>
      ) : (
        <button onClick={drawCardHandler} className="Cards-button">
          {intervalId ? "Stop" : "Draw"}
        </button>
      )}

      <div className="Cards-show">{renderCards}</div>
    </div>
  );
};

export default CardsAuto;
