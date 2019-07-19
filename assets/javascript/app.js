
class Deck {
    // Deck objects should be a collection of questions and answers.
    // Difficulty should be a value between 1 and 3 inclusive. 1: easy, 2: med, 3: hard
    // qaArray must be an array of questions and answers in the format: {'question':['answer','answer','answer','answer']}
    constructor(name, qaArray, difficulty) {
        this.name = name;
        this.difficulty = difficulty;
        this.questions = Object.keys(qaArray);
        this.answers = qaArray;
        this.length = this.questions.length;

        // The shuffle method shuffles this.questions into a random order
        this.shuffle = function() {
            let oldval, shuffi;
            for (let i = 0; i < this.questions.length; i++) {
                shuffi = Math.round(Math.random() * i);
                oldval = this.questions[i];
                this.questions[i] = this.questions[shuffi];
                this.questions[shuffi] = oldval;
            };
        };
    }
};

class Game {
    // This function creates an object containing everything needed to play a single game of trivia. It requires three inputs: 
    // deck: a deck object containing a list of quesions and associated answers
    // time: the ammount of time in seconds the player has to answer each question
    // length (optional): the ammount of questions the game should run through before ending. If no value is supplied for length it simply defaults to the length of the deck object.

    constructor (deck, time, length) {

        // Initializing internal variables
        this.deck = deck;
        this.time = parseInt(time);
        this.length = length || this.deck.length; 
        if (this.length > this.deck.length) {this.length = this.deck.length};

        this.score = 0;
        this.currentQ = -1; // List index of this.deck.questions we're currently at. Incremented by this.nextQ
        this.currentTimer; // Currently running timer will always be held here

        // jQuery element handles
        this.qField = $('#question'); // Display quesion here
        this.tField = $('#timer'); // Display time here
        this.as = {1:$('#a1'), 2:$('#a2'), 3:$('#a3'), 4:$('#a4')}; // Answer button elements. Array starts at 1.
        this.feedback = $('#feedback'); // Location to write in 'correct'/'incorrect'

        this.timerStart = function() {
            // Creates a new timer for this.time seconds and and then updates this.tField accordingly
            // Because execution of code by timers may be delayed, here we'll update the DOM with the 
            // actual time elapsed since starting the timer, at the time of the current execution.
            // This way even if code executing is delayed and even if an entire timer trigger is skipped,
            // the timer will never lose time (although it may occasionally skip numbers on the display).
            // NOTE: Arrow notation must be used when creating our anonymous function inside setInterval or else 'this' will refer to window instead of the Game object
            let start = Date.now();
            let now = 0;
            let newTimer = setInterval(() => {
                let delta = Date.now() - start; // Milliseconds elapsed since initializing start
                now = Math.floor(delta/1000); // Return time in whole seconds
                this.tField.html(`${this.time - now}`); // Update countdown timer on index.html with current time
                if (now >= this.time) {
                    console.log('Commence fail!');
                    this.fail();
                };
            }, 100);

            this.currentTimer = newTimer;

        };

        this.gameEnd = function() {
            console.log('Activating Game.gameEnd')
            //TODO: Write this

        };

        this.nextQ = function() {
            //Increments this.currentQ, then updates the DOM with that question and associated answers
            // Restarts the timer
            console.log('Commence nextQ');
            this.currentQ++;

            // If we've already completed the last question in the deck
            if (this.currentQ >= this.length) {this.gameEnd(); console.log('Game end condition met!'); return;};

            // Else setup a new turn
            // Blank out feedback div
            this.feedback.html(" "); 
            //Loop through answer buttons and assign to each a coresponding answer from the deck (using curret question as index to deck)
            this.qField.html(`${this.deck.questions[this.currentQ]}`);
            for (let i = 1; i < 5; i++) {
                this.as[i].html(`${this.deck.answers[this.deck.questions[this.currentQ]][i-1]}`);
            };
            // Start the timer
            console.log('Starting timer!');
            this.timerStart();

        };

        // Function for failing a question, due to timeout or wrong answer.
        // Prints message to DOM, stops the timer, and then waits 3 seconds befor calling nextQ.
        this.fail = function(click) {
            console.log('Fail actually activated!')
            if (click) {this.feedback.html('<h3>INCORRECT!</h3>');
            } else {this.feedback.html('<h3>Time is up!</h3>');};
            clearInterval(this.currentTimer);
            console.log('Timer cleared');
            setTimeout(() => this.nextQ(), 3000); // Arrow notation to preserve this
        };

        // Function for accepting a correct answer selection by the user.
        // Does almost the same thing as this.fail, but also increments this.score.
        this.pass = function() {
            this.feedback.html('<h3>CORRECT!</h3>');
            clearInterval(this.currentTimer);
            this.score++;
            setTimeout(this.nextQ, 3000);
        };
    };
};


// Test Game:
testDeck = new Deck('test', {
    'Who is the current vice president of the United States?': ['Jim Gaffigan', 'Mike Pence', 'Harvey Milk', 'Lizzo'],
    'What is 2+2?':['4','5','22', '7'],
    'Arrays start at ___.':['1','-1','2','0']
}, 1);

testGame = new Game(testDeck,3);

$(document).ready(function(){
    console.log('Commencing game.')
    testGame.nextQ();
});