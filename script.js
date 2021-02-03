import Deck from './deck.js'

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
const textArea = document.querySelector('.text')
const bankerSlotOne = document.querySelector('.banker-card-slot-one')
const bankerSlotTwo = document.querySelector('.banker-card-slot-two')
const bankerSlotThree = document.querySelector('.banker-card-slot-three')
const playerSlotOne = document.querySelector('.player-card-slot-one')
const playerSlotTwo = document.querySelector('.player-card-slot-two')
const playerSlotThree = document.querySelector('.player-card-slot-three')

// EVENT Listeners

window.onload = (event) => {
    // assemble deck when page loads
    assembleShoe()
}

document.addEventListener('click', () => {

    console.log('size of the shoe:', deck.cards.length)

    if(!deck || (deck.cards.length < 26 && readyForNewGame === true)){
        assembleShoe()
        return textArea.innerText = 'The shoe has been replaced'
    }

    if(readyForNewGame){
        dealCards()
    } else{
        cleanBeforeRound()
    }
})


// GAME Functions

// STEP 1: Assemble the shoe
async function assembleShoe() {
    // INITALIZE new deck
    deck = await Promise.resolve(new Deck())

    // SHUFFLE new deck
    await Promise.resolve(deck.shuffle())
}

// STEP 2: Clean the game board
function cleanBeforeRound() {
    readyForNewGame = true;

    // sets all slots to empty string
    textArea.innerText = ''

    bankerSlotOne.innerHTML = ''
    bankerSlotTwo.innerHTML = ''
    bankerSlotThree.innerHTML = ''

    playerSlotOne.innerHTML = ''
    playerSlotTwo.innerHTML = ''
    playerSlotThree.innerHTML = ''
}

// STEP 3: Deal the cards
function dealCards(){
    readyForNewGame = false;

    // Deal the cards: two from top of deck to player first.
    // (rather than 1 from top to each player, twice)
    const playerCards = [];
    playerCards.push(deck.draw(), deck.draw())
    const bankerCards = [];
    bankerCards.push(deck.draw(), deck.draw())

    // Append cards to DOM
    bankerSlotOne.appendChild(bankerCards[0].getHTML())
    playerSlotOne.appendChild(playerCards[0].getHTML())
    playerSlotTwo.appendChild(playerCards[1].getHTML())
    bankerSlotTwo.appendChild(bankerCards[1].getHTML())

    // Count hand totals with reducer
    const playerCount = playerCards.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value] % 10;
        return acc + val;
    }, 0 ); //where 0 is the initial value

    const bankerCount = bankerCards.reduce((acc, value) => {
        const val = CARD_VALUE_MAP[value.value] % 10;
        return acc + val;
    }, 0 ); //where 0 is the initial value

    // Pass to next function for next .draw()
    handConitions(playerCount, bankerCount)

}

// STEP 5: All those hand conditions
function handConitions(playerIn, bankerIn) {
    // inital vals
    let playerScoreDone = false;
    let bankerScoreDone = false;

    let pScore = 0;
    let bScore = 0;

    console.log(playIn)


    while (!playerScoreDone && !bankerScoreDone ) {
        // the hands play off each other

        // one
        if (playerIn > 6){
            return pScore = playerIn;
        } else {
            // less-than equal to five
            

        }

        // two
        if (bankerIn>){

        }
        
    }
    const bankerFinal = 0;

    console.log(playerIn)
    // If either the player or banker is dealt a total of eight or nine, both the player and banker stand.
    if (playerIn = 9){

    }
    
    // source: https://www.caesars.com/casino-gaming-blog/latest-posts/table-games/baccarat/how-to-play-baccarat
    // (1) When the cards dealt are greater than nine, you have to add the two together and drop the one (or two) to get the value.
    // done




    // If the player’s total is five or less, then the player will receive another card. Otherwise, the player will stand.
    // If the player stands, then the banker hits on a total of 5 or less.
    // The final betting option, a tie, pays out 8-to-1. Conveniently, there are also sheets at the table for you to keep track of your score.

    // Look for pairs?
}


