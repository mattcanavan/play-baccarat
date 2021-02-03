import Deck from "./deck.js";

// GLOBAL variables
let readyForNewGame = true;
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

// EVENT Listeners

// window.onload = (event) => {
//     // assemble deck when page loads
//     assembleShoe()
// }

document.addEventListener("click", runGame);

// RUN GAME
function runGame() {
  // INITALIZE new deck
  deck = new Deck();
  deck.shuffle();

  cleanGameBoard();
  dealCards().then((obj) => {
    //   initial vals
    const playerThirdCard = [];
    const bankerThirdCard = [];

    // Count hand totals with reducer, where 0 is the initial value
    const playerCount = obj.player.reduce((acc, value) => {
      const val = CARD_VALUE_MAP[value.value] % 10;
      return acc + val;
    }, 0);
    const bankerCount = obj.banker.reduce((acc, value) => {
      const val = CARD_VALUE_MAP[value.value] % 10;
      return acc + val;
    }, 0);

    // Step through hands https://www.onlinecasinoselite.org/getting-started/gambling-rules/baccarat

    // if(playerCount === 8)

    if (playerCount < 6){
        playerThirdCard.push(deck.draw())
    }

    if (bankerCount < 7) {
        if(bankerCount === 0 || bankerCount === 1 || bankerCount === 2){
            bankerThirdCard.push(deck.draw())
        } else if (bankerCount === 3 || bankerCount === 6){
            
            // if play doesnt have third card
            if (!playerThirdCard.length) {
            bankerThirdCard.push(deck.draw())
        }
    }

    // if play doesnt have third card
    if (!playerThirdCard.length) {
        bankerThirdCard.push(deck.draw())
    } else {
        
    }





    console.log(obj)
  });
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

    // Count hand totals with reducer
    const playerCount = playerCards.reduce((acc, value) => {
      const val = CARD_VALUE_MAP[value.value] % 10;
      return acc + val;
    }, 0); //where 0 is the initial value

    const bankerCount = bankerCards.reduce((acc, value) => {
      const val = CARD_VALUE_MAP[value.value] % 10;
      return acc + val;
    }, 0); //where 0 is the initial value

    // resolve counts
    resolve({ player: playerCards, banker: bankerCards });
  })};

// // GAME Functions

// // STEP 5: All those hand conditions
// function handConitions(playerIn, bankerIn) {
//     // inital vals
//     let playerScoreDone = false;
//     let bankerScoreDone = false;

//     let pScore = 0;
//     let bScore = 0;

//     console.log(playIn)

//     while (!playerScoreDone && !bankerScoreDone ) {
//         // the hands play off each other

//         // one
//         if (playerIn > 6){
//             return pScore = playerIn;
//         } else {
//             // less-than equal to five

//         }

//         // two
//         if (bankerIn>){

//         }

//     }
//     const bankerFinal = 0;

//     console.log(playerIn)
//     // If either the player or banker is dealt a total of eight or nine, both the player and banker stand.
//     if (playerIn = 9){

//     }

// source: https://www.caesars.com/casino-gaming-blog/latest-posts/table-games/baccarat/how-to-play-baccarat
// (1) When the cards dealt are greater than nine, you have to add the two together and drop the one (or two) to get the value.
// done

// If the player’s total is five or less, then the player will receive another card. Otherwise, the player will stand.
// If the player stands, then the banker hits on a total of 5 or less.
// The final betting option, a tie, pays out 8-to-1. Conveniently, there are also sheets at the table for you to keep track of your score.

// Look for pairs?
// }
