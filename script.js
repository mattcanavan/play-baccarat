import Deck from "./deck.js";

// GLOBAL variables
let deck;
let gameOver = false;
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
  let deck = new Deck();
  deck.shuffle();

  // clean board if game over and wait for next mouse click
  if (gameOver) {
    cleanGameBoard();
    gameOver = false;
    return
  }

  // else
  dealCards().then((obj) => {
    // INITIAL hands
    const { player, banker } = obj;

    // INITIAL hand score
    const playerCount = sumHand(player);
    const bankerCount = sumHand(banker);

    // Step through hands https://www.onlinecasinoselite.org/getting-started/gambling-rules/baccarat
    // http://www.casinocity.com/rule/baccarat.htm
    switch (true) {
      
      // First Review
      case playerCount === 8 && bankerCount === 8:
      case playerCount === 9 && bankerCount === 9:
        gameOver = true
        textArea.innerText = "Draw"
        break
      case playerCount === 9:
        gameOver = true
        textArea.innerText = "Player Wins"
        break
      case bankerCount === 9:
        gameOver = true
        textArea.innerText = "Banker Wins"
        break
      
        // Player Review
      case playerCount <= 5:
        player.push(deck.draw());
        playerSlotThree.appendChild(player[2].getHTML())
      
        // Banker Review
      case bankerCount >= 7:
        break // stand
      case bankerCount <= 2:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

        // Banker's 3rd depends on player's 3rd
      case player.length < 3 && bankerCount >= 6:
        break //stand
      case player.length < 3 && bankerCount <= 5:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

      case player[2].value === 0 || player[2].value === 1:
      case bankerCount <= 3:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break
      
      case player[2].value === 2 || player[2].value === 3:
      case bankerCount <= 4:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

      case player[2].value === 4 || player[2].value === 5:
      case bankerCount <= 5:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

      case player[2].value === 6 || player[2].value === 7:
      case bankerCount <= 6:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

      case player[2].value === 8:
      case bankerCount <= 2:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break

      case player[2].value === 9:
      case bankerCount <= 3:
        banker.push(deck.draw())
        bankerSlotThree.appendChild(banker[2].getHTML())
        break
    }

    // if game over, return 
    if (gameOver){
      // end game
      return 
    }

    // else
    // FINAL hand score
    const playerFinalCount = sumHand(player);
    const bankerFinalCount = sumHand(banker);

    // FINAL comparison
    if (playerFinalCount === bankerFinalCount) {
      gameOver = true;
      return (textArea.innerText = "Draw");
    } else {
      gameOver = true;
      return playerFinalCount < bankerFinalCount
        ? (textArea.innerText = "Banker Wins")
        : (textArea.innerText = "Player Wins");
    }
  });
}

// HELPER FUNCTIONS
function cleanGameBoard() {
  // sets all slots to empty string
  textArea.innerText = "Click anywhere on the screen to start a game";

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
  });
}

// // REDUCERS
// Given hand returns value (number)
function sumHand(obj) {
  return obj.reduce((acc, item) => {
    const val = CARD_VALUE_MAP[item.value];
    return (acc + val) % 10;
  }, 0);
}
