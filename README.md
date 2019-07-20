# Overwatch Trivia
Created by Daniel Gold
Note that the Overwatch name and all associated characters are the property Activition-Blizzard are used in this game without permission. 


##### Overview
This trivia game quizes the use about the lore of the popular game Overwatch. Users have 10 seconds to answer each question. If the user chooses an answer, or runs out of time, they will be informed whether or not they were correct and then move on to the next question. If the user answers incorrectly the correct answer will be highlighted in light blue. At the end of the game the user is told how many questions they answered correctly out of the total number of questions. The user can play again by refreshing the page.

##### Modularity
This program was written in such a way that different 'decks' of quesion and answer sets can easily be added to the game without having to alter any of the code that actually parses those decks. Decks are objects which are handled by a Game object. Any properly formated Deck object should work with a Game object. Note, however, that at this time only decks with exactly four answers per question are supported.

Similarly, the time allowed for the user to answer each question is passed as an argument during construction of a Game object, making it very easy to change. 

###### Adding Your Own Trivia
If you would like to put your own trivia in the game, simply add your own deck object to the app.js file, then change the two lines of code under the comment 'Choose deck here.' By replacing the two references to 'owDeck' with the variable name pointing to your deck, you should be ready to run your own trivia game (provided that your deck is properly formatted).