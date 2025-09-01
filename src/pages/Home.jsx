import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import { StarBackground } from "../components/StarBackground";
import { ThemeToggle } from "../components/ThemeToggle";
import localforage from "localforage";
import jokesJson from "../../jokes.json";

export const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(null);
  const [jokes, setJokes] = useState([]);

  //Seed database on first load or if empty
  async function seedJokes() {
    const existing = await localforage.getItem("jokes");

    if (!existing) {
        const jokesWithIds = jokesJson.map((joke, index) => ({ id: index + 1, ...joke }));
        await localforage.setItem("jokes", jokesWithIds);
        setJokes(jokesWithIds);
    }
    else {
        setJokes(existing);
    }
  }

  // Pick a random joke
  function getRandomJoke() {
    if (jokes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * jokes.length);
    return jokes[randomIndex];
  }

  // Handle card flip
  function handleClick() {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false); 
      setCurrentJoke(getRandomJoke());
    }
  }

// Fetch a joke on component mount
useEffect(() => {
    seedJokes();
}, []);

useEffect(() => {
    if (jokes.length > 0 && !currentJoke) {
        setCurrentJoke(getRandomJoke());
    }}, [jokes]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Theme toggle */}
      <ThemeToggle />

      {/* Background Effects */}
      <StarBackground />

      {/* Joke Card */}
      <div className="app-container">
        <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
          {/* Front of card - Setup */}
          <div className="card" onClick={handleClick}>
            {currentJoke ? (
              <div>
                <p className="joke-text">{currentJoke.setup}</p>
                <p className="type-text">{currentJoke.type}</p>
                <p className="id-text">{currentJoke.id}</p>
              </div>
            ) : (
              <p>Loading Joke...</p>
            )}
          </div>

          {/* Back of card - Punchline */}
          <div className="card card-back" onClick={handleClick}>
            {currentJoke ? (
              <div>
                <p className="joke-text">{currentJoke.punchline}</p>
                <p className="id-text">{currentJoke.id}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </ReactCardFlip>
      </div>
    </div>
  );
};
