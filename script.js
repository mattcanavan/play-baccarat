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
  // INITALIZE new deck
  if (
    !deck || // if deck is empty or less than a random number between 26-100
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
  new Promise(function (resolve) {
    // Deal the cards: one at a time
    const playerHand = [];
    const bankerHand = [];
    drawCard(playerHand)
    drawCard(bankerHand)
    drawCard(playerHand)
    drawCard(bankerHand)

    // Append cards to DOM
    displayCard({player: playerHand})
    displayCard({banker: bankerHand})

    // Resolve promise
    resolve({ playerHand, bankerHand });
  }).then(handsObj => {
    // First Review
    // hands
    const { playerHand, bankerHand } = handsObj;

    // hand score
    let playerCount = sumHand(player);
    let bankerCount = sumHand(banker);

    // Step through hands http://www.casinocity.com/rule/baccarat.htm
    switch (true) {
      case playerCount === 8 && bankerCount === 8:
      case playerCount === 9 && bankerCount === 9:
        textArea.innerText = "Draw";
        throw "Draw"
      case playerCount === 9:
        textArea.innerText = "Player Wins";
        throw "Player Wins"
      case bankerCount === 9:
        textArea.innerText = "Banker Wins";
        throw "Banker Wins"
    }


  }).then(handsObj => {
    // // Player and Banker Review

    // hands
    const { playerHand, bankerHand } = handsObj;

    // player hand score
    let playerCount = sumHand(player);
    let bankerCount = sumHand(banker);

    switch (true) {
      case playerCount <= 5:
        drawCard(player)
        displayCard({player: playerHand})
    }

    // banker hand score
    switch (true) {
      case bankerCount >= 7: // do nothing
      // case bankerCount 3-6 do nothing
      case bankerCount <= 2:
        drawCard(banker)
        displayCard({banker: bankerHand})
    }

    return new Promise(resolve(handsObj))

  }).then(handsObj => {
    // // Banker's 3rd depends on player's 3rd 

    // hands
    const { playerHand, bankerHand } = handsObj;

    // hand score
    let bankerCount = sumHand(bankerHand);

    switch (true) {
      case playerHand.thirdCardValue < 3 && bankerCount >= 6: // do nothing
      case playerHand.thirdCardValue < 3 && bankerCount <= 5:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 0 || playerHand.thirdCardValue === 1 && bankerCount <= 3:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 2 || playerHand.thirdCardValue === 3 && bankerCount <= 4:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 4 || playerHand.thirdCardValue === 5 && bankerCount <= 5:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 6 || playerHand.thirdCardValue === 7 && bankerCount <= 6:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 8 && bankerCount <= 2:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;

      case playerHand.thirdCardValue === 9 && bankerCount <= 3:
        drawCard(banker)
        displayCard({banker: bankerHand})
        break;
    }

    return new Promise(resolve(handsObj))
  }).catch(results => {
    //     // if game over, return
    //     if (gameOver) {
    //       // end game
    //       return;
    //     }
  
    //     // else
    //     // FINAL hand score
    //     const playerFinalCount = sumHand(player);
    //     const bankerFinalCount = sumHand(banker);
    //     console.log("final scores", playerFinalCount, bankerFinalCount);
  
    //     // FINAL comparison
    //     if (playerFinalCount === bankerFinalCount) {
    //       gameOver = true;
    //       return (textArea.innerText = "Draw");
    //     } else {
    //       gameOver = true;
    //       return playerFinalCount < bankerFinalCount
    //         ? (textArea.innerText = "Banker Wins")
    //         : (textArea.innerText = "Player Wins");
    //     }
    //   });
    // }

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

  function drawCard(handAry){
    return handAry.push(deck.draw())
  }

  function displayCard(obj){
    switch(true){
      case obj['player']:
        const { player } = obj;
        if(player.numberOfCards === 2){
          playerSlotOne.appendChild(player[0].getHTML())
          playerSlotTwo.appendChild(player[1].getHTML())
          return // returns out of switch and func
        } else{
          bankerSlotThree.appendChild(banker[2].getHTML())
          return
        }
      case obj['banker']:
        const { banker } = obj;
        if(banker.numberOfCards === 2){
          bankerSlotOne.appendChild(banker[0].getHTML())
          bankerSlotTwo.appendChild(banker[1].getHTML())
          return // returns out of switch and func
        } else{
          bankerSlotThree.appendChild(banker[2].getHTML())
          return
        }
        debugger
    }

    // if(obj['player']){
    //   console.log(player)
    // }

    // const results = Array.isArray(hand) ? hand : [hand]

    // return results.forEach(card => {
    //   return 
    // })
  }

  // // REDUCERS
  // Given hand returns value (number)
  function sumHand(obj) {
    return obj.reduce((acc, item) => {
      const val = CARD_VALUE_MAP[item.value];
      return (acc + val) % 10;
    }, 0);
  }
