import Deck from "./deck.js";

// GLOBAL variables
let deck;
const CARD_VALUE_MAP = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 0,
  J: 0,
  Q: 0,
  K: 0,
};

// QUERY Selectors
const textArea = document.querySelector(".text");
const bankerSlotOne = document.querySelector(".banker-card-slot-one");
const bankerSlotTwo = document.querySelector(".banker-card-slot-two");
const bankerSlotThree = document.querySelector(".banker-card-slot-three");
const playerSlotOne = document.querySelector(".player-card-slot-one");
const playerSlotTwo = document.querySelector(".player-card-slot-two");
const playerSlotThree = document.querySelector(".player-card-slot-three");

// EVENT Listener
document.addEventListener("click", runGame);

// RUN GAME
function runGame() {
  // INITALIZE new deck
  deck = new Deck();
  deck.shuffle();

  cleanGameBoard();
  dealCards()
    .then((obj) => {
      //   initial vals
      const { player, banker } = obj;

      // Count hand totals with reducer, where 0 is the initial value
      const playerCount = player.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value];
        return (acc + val) % 10;
      }, 0);
      const bankerCount = banker.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value];
        return (acc + val) % 10;
      }, 0);

      // Step through hands https://www.onlinecasinoselite.org/getting-started/gambling-rules/baccarat
      if (
        playerCount === 8 ||
        playerCount === 9 ||
        bankerCount === 8 ||
        bankerCount === 9
      ) {
        if (playerCount === bankerCount) {
          return textArea.innerText = "Draw"
        } else {
          return playerCount < bankerCount ? textArea.innerText = "Banker Wins" : textArea.innerText = "Player Wins"
        }
      }

      // PLAYER
      if (playerCount <= 5) {
        player.push(deck.draw());
        playerSlotThree.appendChild(player[2].getHTML())
      } else{
        // stand
      }

      // BANKER
      if (bankerCount <= 7) {
        if (bankerCount === 0 || bankerCount === 1 || bankerCount === 2) {
          // must draw
          banker.push(deck.draw());
          bankerSlotThree.appendChild(banker[2].getHTML())
        } else if (
          bankerCount === 3 ||
          bankerCount === 4 ||
          bankerCount === 5 ||
          bankerCount === 6
        ) {
          // depends on player's 3rd card
          if (!player.length) {
            banker.push(deck.draw());
            bankerSlotThree.appendChild(banker[2].getHTML())
          } else{
            // stand
          }
        }
      }

      // FINAL count
      const playerFinalCount = player.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value];
        return (acc + val) % 10;
      }, 0);
      const bankerFinalCount = banker.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value];
        return (acc + val) % 10;
      }, 0);
      debugger

      // FINAL comparison
      if (playerFinalCount === bankerFinalCount){
        return textArea.innerText = "Draw"
      } else{
        return playerFinalCount < bankerFinalCount ? textArea.innerText = "Banker Wins" : textArea.innerText = "Player Wins"
      }
    })
}

// HELPER FUNCTIONS
function cleanGameBoard() {
  // sets all slots to empty string
  textArea.innerText = "";

  bankerSlotOne.innerHTML = "";
  bankerSlotTwo.innerHTML = "";
  bankerSlotThree.innerHTML = "";

  playerSlotOne.innerHTML = "";
  playerSlotTwo.innerHTML = "";
  playerSlotThree.innerHTML = "";
}

// Deal the cards
function dealCards() {
  return new Promise(function (resolve) {
    // Deal the cards: two from top of deck to player first.
    // (rather than 1 from top to each player, twice)
    const playerCards = [];
    playerCards.push(deck.draw(), deck.draw());
    const bankerCards = [];
    bankerCards.push(deck.draw(), deck.draw());

    // Append cards to DOM
    bankerSlotOne.appendChild(bankerCards[0].getHTML());
    playerSlotOne.appendChild(playerCards[0].getHTML());
    playerSlotTwo.appendChild(playerCards[1].getHTML());
    bankerSlotTwo.appendChild(bankerCards[1].getHTML());

    // resolve cards
    resolve({ player: playerCards, banker: bankerCards });
  })};

