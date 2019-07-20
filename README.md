# Overwatch Trivia


##### Overview
This trivia game quizes the use about the lore of the popular game Overwatch. Users have 10 seconds to answer each question. If the user chooses an answer, or runs out of time, they will be informed whether or not they were correct and then move on to the next question. If the user answers incorrectly the correct answer will be highlighted in light blue. At the end of the game the user is told how many questions they answered correctly out of the total number of questions. The user can play again by refreshing the page.

##### Modularity
This program was written in such a way that different 'decks' of quesion and answer sets can easily be added to the game without having to alter any of the code that actually parses those decks. Decks are objects which are handled by a Game object. Any properly formated Deck object should work with a Game object. Note that at this time, however, only decks with exactly four answers per question are supported.

Similarly, the time allowed for the user to answer each question is pass as an argument during construction of a Game object, making it very easy to change. 