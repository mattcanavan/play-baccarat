import Deck from "./deck.js";

// GLOBAL variables
let gameOver = false;
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
  // Initialize new deck if deck is empty or less than a random number between 26-100
  if (
    !deck ||
    deck.numberOfCards < Math.floor(Math.random() * (100 - 26 + 1) + 26)
  ) {
    deck = new Deck();
    deck.shuffle();
  }

  // clean board if game over and wait for next mouse click
  if (gameOver) {
    cleanGameBoard();
    gameOver = false;
    return;
  }

  // else
  return new Promise((resolve) => {
    // Deal the cards: one at a time
    const playerHand = [];
    const bankerHand = [];
    drawCard(playerHand);
    drawCard(bankerHand);
    drawCard(playerHand);
    drawCard(bankerHand);

    // Append cards to DOM
    displayCard({ player: playerHand });
    displayCard({ banker: bankerHand });

    // Resolve promise
    resolve({ playerHand, bankerHand })

  }).then((handsObj) => {
    // First Review
    // hands
    const { playerHand, bankerHand } = handsObj;
    // hand score
    let playerCount = sumHand(playerHand);
    let bankerCount = sumHand(bankerHand);

    // Step through hands http://www.casinocity.com/rule/baccarat.htm
    switch (true) {
      case playerCount === 8 && bankerCount === 8:
      case playerCount === 9 && bankerCount === 9:
        throw "Draw";
      case playerCount === 9:
        throw "Player Wins";
      case bankerCount === 9:
        throw "Banker Wins";
    }

    // Resolve promise
    return Promise.resolve(handsObj)

  })
    .then((handsObj) => {
      // // Player and Banker Review
      // hands
      const { playerHand, bankerHand } = handsObj;
      // hand score
      let playerCount = sumHand(playerHand);
      let bankerCount = sumHand(bankerHand);

      switch (true) {
        case playerCount <= 5:
          drawCard(playerHand);
          displayCard({ player: playerHand });
      }

      // banker hand score
      switch (true) {
        case bankerCount >= 7: // do nothing
        // case bankerCount 3-6 do nothing
        case bankerCount <= 2:
          drawCard(bankerHand);
          displayCard({ banker: bankerHand });
      }

      // Resolve promise
      return Promise.resolve(handsObj)

    })
    .then((handsObj) => {
      // // Banker's 3rd depends on player's 3rd
      // hands
      const { playerHand, bankerHand } = handsObj;
      // hand score
      let bankerCount = sumHand(bankerHand);

      switch (true) {
        case playerHand.thirdCardValue < 3 && bankerCount >= 6: // do nothing
        case playerHand.thirdCardValue < 3 && bankerCount <= 5:
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 0 ||
          (playerHand.thirdCardValue === 1 && bankerCount <= 3):
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 2 ||
          (playerHand.thirdCardValue === 3 && bankerCount <= 4):
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 4 ||
          (playerHand.thirdCardValue === 5 && bankerCount <= 5):
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 6 ||
          (playerHand.thirdCardValue === 7 && bankerCount <= 6):
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 8 && bankerCount <= 2:
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;

        case playerHand.thirdCardValue === 9 && bankerCount <= 3:
          drawCard(banker);
          displayCard({ banker: bankerHand });
          break;
      }

      // Resolve promise
      return Promise.resolve(handsObj)

    })
    .then((handsObj) => {
      // hands
      const { playerHand, bankerHand } = handsObj;

      // FINAL Scoring
      const playerFinalCount = sumHand(playerHand);
      const bankerFinalCount = sumHand(bankerHand);

      if (playerFinalCount === bankerFinalCount) {
        throw "Draw"
      } else {
        throw playerFinalCount < bankerFinalCount ? "Banker Wins" : "Player Wins";
      }
    })
    .catch(result => {
      setTimeout(() => {
        switch (result) {
          case "Draw":
            textArea.innerText = result
          case "Banker Wins":
            textArea.innerText = result
          case "Player Wins":
            textArea.innerText = result
        }
      }, 2000);
      return gameOver = true;
    })
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

function drawCard(handAry) {
  return handAry.push(deck.draw());
}

function displayCard(obj) {
  //was the player hand passed in?
  if (obj.player != undefined) {
    if (obj.player.length === 2) {
      playerSlotOne.appendChild(obj.player[0].getHTML());
      playerSlotTwo.appendChild(obj.player[1].getHTML());
    } else {
      setTimeout(() => {
        playerSlotThree.appendChild(obj.player[2].getHTML());
      }, 1000);
    }
  }
  //was the banker hand passed in?
  else if (obj.banker != undefined) {
    if (obj.banker.length === 2) {
      bankerSlotOne.appendChild(obj.banker[0].getHTML());
      bankerSlotTwo.appendChild(obj.banker[1].getHTML());
    } else {
      setTimeout(() => {
        bankerSlotThree.appendChild(obj.banker[2].getHTML());
      }, 1000)
    }
  }
}

// // REDUCERS
// Given hand returns value (number)
function sumHand(obj) {
  return obj.reduce((acc, item) => {
    const val = CARD_VALUE_MAP[item.value];
    return (acc + val) % 10;
  }, 0);
}
