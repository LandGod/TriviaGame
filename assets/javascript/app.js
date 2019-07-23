function shuffle(arr) {
    // Takes an array and makes random swaps between the locations of various indexes.
    let oldval, shuffi;
    for (let i = 0; i < arr.length; i++) {
        shuffi = Math.round(Math.random() * i);
        oldval = arr[i];
        arr[i] = arr[shuffi];
        arr[shuffi] = oldval;
    };
};

class Card {
    // A card object consists of a question, a single correct answer, and 3 incorrect answers.
    // While the Card class can theoretically handle more than 3 incorrect answers (for a total of 4 answers),
    // the Game class does not current support more than 4 questions
    constructor(question, correctAnswer, answers) {
        this.question = question;
        this.answers = answers;
        this.answers.push(correctAnswer);
        shuffle(answers);
        this.correctAnswer = this.answers.indexOf(correctAnswer);
    }
};


class Deck {
    // Deck objects should be a collection of questions and answers.
    // Difficulty should be a value between 1 and 3 inclusive. 1: easy, 2: med, 3: hard
    // qaArray must be an array of questions and answers in the format: {'question':['answer','answer','answer','answer']}
    // aArray should be a map of qaArray containing the list index of the correct answer for each question indexed by question. Format {'question':1}
    constructor(name, cardArray) {
        this.name = name;
        this.cards = cardArray
        this.length = cardArray.length;

        // The shuffle method calls the shuffle function on the this.cards array.
        this.shuffle = () =>  {shuffle(this.cards);};
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
        this.as = {1 : $('#a1'), 2 : $('#a2'), 3 : $('#a3'), 4 : $('#a4')}; // Answer button elements. Array starts at 1.
        this.feedback = $('#feedback'); // Location to write in 'correct'/'incorrect'
        this.buttonDefault = "col-md-4 text-center col-12 answer rounded m-1" // Default class attribute value for answer buttons

        // Object for easy adding of letters to answers. Array starts at 1 because it wants to match the answer element id numbers.
        this.letterMap = {1: "A) ", 2: "B) ", 3: "C) ", 4: "D) "}

        // Valid button press tracking, ie: has the user already made a guess. If the user has not made a guess yet: true.
        this.turnActive;

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
                    this.turnActive = false;
                    this.fail();
                };
            }, 100);

            this.currentTimer = newTimer;

        };

        // Called when the last question has been asked and answered (or timed out)
        // Deletes everything in the game box except for the title and feedback section
        // Prints game over and the score to the feedback section
        this.gameEnd = function() {
            console.log('Activating Game.gameEnd')
            this.feedback.html(`<h3>Game Over</h3> <p>${this.score} correct answers out of a possible ${this.length}</p>`);
            this.qField.detach();
            this.tField.parent().detach();
            $('.answer').detach();

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
            this.feedback.html("<h3 style='color:rgba(0,0,0,0)'> - </h3>"); 
            //Loop through answer buttons and assign to each a coresponding answer from the deck (using curret question as index to deck)
            this.qField.html(`${this.deck.cards[this.currentQ].question}`);
            for (let i = 1; i < 5; i++) {
                this.as[i].html(`${this.letterMap[i]} ${this.deck.cards[this.currentQ].answers[i-1]}`);
            };
            // Start the timer
            console.log('Starting timer!');
            $('.answer').attr('class', this.buttonDefault);
            this.timerStart();
            this.turnActive = true;

        };

        // Function for failing a question, due to timeout or wrong answer.
        // Prints message to DOM, stops the timer, and then waits 3 seconds befor calling nextQ.
        this.fail = function(click) {
            console.log('Fail actually activated!')
            if (click) {
                this.feedback.html(`<h3>INCORRECT!</h3>`);
                $(`#a${this.deck.cards[this.currentQ].correctAnswer + 1}`).attr('class', this.buttonDefault);
            } else {
                this.feedback.html('<h3>Time is up!</h3>');
                $('.answer').attr('class', $('.answer').attr('class') + ' none-guess')
                $(`#a${this.deck.cards[this.currentQ].correctAnswer + 1}`).attr('class', this.buttonDefault);
            };
            clearInterval(this.currentTimer);
            console.log('Timer cleared');
            setTimeout(() => this.nextQ(), 3000); // Arrow notation to preserve this
        };

        // Function for accepting a correct answer selection by the user.
        // Does almost the same thing as this.fail, but also increments this.score.
        this.pass = function() {
            console.log('User was correct!')
            this.feedback.html('<h3>CORRECT!</h3>');
            clearInterval(this.currentTimer);
            this.score++;
            setTimeout(() => this.nextQ(), 3000);
        };

        // Checks if the button the user pressed coresponds to the right or wrong answer
        // Stops the timer
        // Calls Game.pass or Game.fail accordingly.
        this.guess = function(value) {
            // If the user has already made a guess this turn, do nothing.
            if (!this.turnActive) {return;} else {this.turnActive = false;};

            // The value returned in 'value' will be offset by + 1 compared to the index value of the answer we're taking from deck.key, so we need decrement value by 1
            this.tField.html('--')
            $('.answer').attr('class', value.attr('class') + ' none-guess')
            if (parseInt(value.val()) - 1 == this.deck.cards[this.currentQ].correctAnswer) {
                console.log('if statement goes to pass');
                value.attr('class', this.buttonDefault);
                value.attr('class', value.attr('class') + ' correct-guess');
                this.pass()} 
                else {
                    console.log('if statement goes to fail');
                    value.attr('class', this.buttonDefault);
                    value.attr('class', value.attr('class') + ' wrong-guess');
                    this.fail(true)};

        };

    };
};

// Decks go here:

// Test Deck:
testDeck = new Deck('test trivia deck', [
    new Card('Who was the 42nd POTUS?','Barack Obama',['Bill Clinton','Ricky Boby','Hillary Clinton']),
    new Card('What is 2+2?','4',['1','2','3']),
    new Card('Say my name.','Heisenberg',['Heimler','Greg','Walter']),
]);

// Overwatch Deck
owDeck = new Deck ('Overwatch Trivia',[
    new Card ("What is Widowmaker's real name?","Amélie LaCroix",['Natasha Romanoff', 'Alison Guillard', 'Adalene LaVelle']),
    new Card ("Who is Winston named after?","Dr. Harold Winston",["Winston Hill", "Winston Churchill", "Nobody"]),
    new Card ("Which of these character concepts was explored by Blizzard before eventually being abandoned?","Jetpack Cat",['Super Intelligent Hampster', 'Laser Snake', 'Psychic Badger']),
    new Card ("What is Baptiste's country of origin?","Haiti",['France', 'Quebec', 'Papua New Guinea']),
    new Card ("Widowmaker was originally kidnapped by Talon as part of a plot to kill who?","Her husband",['Her brother', 'The head of Overwatch', 'Captain Ana Amari']),
    new Card ("Which Overwatch hero is the daughter of a founding member of Overwatch who was at one time presumed dead?","Phara", ['Brigitte', 'Sombra', 'Widowmaker']),
    new Card ("What was D.va's career before she became a Mekka pilot?","Pro Gamer",['Racecar Driver', 'Modle', 'Actress']),
    new Card ("Before becoming 'Reaper,' Gabriel Reyes had, at one time, been referred to by what other moniker?","Soldier 24",['Soldier 76', 'Soldier 13', 'The Statueless One']),
    new Card ("The 'Doomfist' featured as a playable hero in Overwatch is the ____ person to carry that title.",'Third',['First', 'Second', 'Fourth']),
    new Card ("Ashe is the leader of the _______ Gang.","Deadlock",['Rough Riders', 'Omnicca', 'Robertson']),
]);


// Choose deck here
owDeck.shuffle(); // Shuffle it
var currentGame = new Game(owDeck,15); // Create game object with chosen deck


// Run Game (no need to eddit this:):
$(document).ready(function(){
    console.log('Commencing game.')
    $('#page-title').html(`${currentGame.deck.name}`)
    // Add click handlers to all answer buttons. Answer button array starts at 1 and has 4 elements in it.
    for (let i = 1; i < 5; i++) {
        currentGame.as[i].on('click', function() {
            currentGame.guess($(this));
        });
    }

    $(document).click(function() {
        currentGame.nextQ();
        $(document).off();
        
    });

});