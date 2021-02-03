// GLOBAL Variables
const SUITS = ["♥", "♦", "♠", "♣"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

// CLASS for entire Deck
export default class Deck {
    constructor(cards = freshDeck()){
        this.cards = cards
    }
    
    get numberOfCards() {
        return this.cards.length
    }

    draw() {
        return this.cards.shift()

    }

    shuffle() {
        for (let i = this.numberOfCards -1; i > 0; i-- ){
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]

            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

// CLASS for single card
class Card {
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
    }

    get color() {
        // based on current card, returns color
        return this.suit === "♠" || this.suit === "♣" ? "black" : "red";
    }

    getHTML(){
        const cardDiv = document.createElement("div");
        cardDiv.innerText = this.suit;
        cardDiv.classList.add("card", this.color);
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

// HELPER Function to assemble a standard 52 card deck
function freshDeck(){
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit,value)
        })
    })
}