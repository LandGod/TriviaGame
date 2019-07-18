
class Deck {
    // Deck objects should be a collection of questions and answers.
    // Difficulty should be a value between 1 and 3 inclusive. 1: easy, 2: med, 3: hard
    // qaArray must be an array of questions and answers in the format: {'question':'answer'}
    constructor(name, qaArray, difficulty) {
        this.name = name;
        this.difficulty = difficulty;
        this.questions = qaArray.keys();
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
        this.score = 0;
        this.currentQ = 0; // List index of this.deck.questions we're currently at. Incremented by this.nextQ
        this.currentTimer; // Currently running timer will always be held here

        // jQuery element handles
        this.qField = $('#question'); // Display quesion here
        this.tField = $('#timer'); // Display time here
        this.as = {1:$('#a1'), 2:$('#a2'), 3:$('#a3'), 4:$('#a4')}; // Answer button elements. Array starts at 1.
        this.feedback = $('#feedback'); // Location to write in 'correct'/'incorrect'

        this.timerStart = function() {
            // Creates a new timer for this.time seconds and and then updates this.tField accordingly
            let start = Date.now();
            let now = 0;
            let that = this;
            let newTimer = setInterval(function() {
                let delta = Date.now() - start; // Milliseconds elapsed since initializing start
                now = Math.floor(delta/100); // Return time in whole seconds
                that.tField.html(`${that.time - now}`); // Update countdown timer on index.html with current time
                if (now >= that.time) {
                    that.fail();
                };
            }, 100);

            this.currentTimer = newTimer;

        };

        this.nextQ = function() {
            //Increments this.currentQ, then updates the DOM with that question and associated answers
            // Restarts the timer

            //TODO: Write this function

        };

        // Function for failing a question, due to timeout or wrong answer.
        // Prints message to DOM, stops the timer, and then waits 3 seconds befor calling nextQ.
        this.fail = function() {
            this.feedback.html('<h3>INCORRECT!</h3>');
            clearInterval(this.currentTimer);
            setTimeout(this.nextQ, 3000);
        };
    };
};