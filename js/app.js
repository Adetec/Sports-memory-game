/*
 * Create a list that holds all of your cards
 */

// create array that store list of fontAwesome icon classes
let symbols = ['football-ball', 'volleyball-ball', 'quidditch', 'futbol', 'table-tennis', 'hockey-puck', 'baseball-ball', 'basketball-ball'];
// duplicate the list
symbols = symbols.concat(symbols);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Random the icons list
 symbols = shuffle(symbols);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create an ul element
let createCards = document.createElement('ul');

//TODO: Add deck class to the ul elemnt
createCards.setAttribute('class','deck');

// create function that loop through each card and create its HTML
function createList() {
    let listCard = '';
    let symbolId = 1; //Create an Id number to assign it for each id card

    //loop through each card and create its HTML
    for (const symbol of symbols) {
        listCard = `<li id="symbol-${symbolId}" class='card'><i class='fa fa-${symbol}'></i></li>`;
        symbolId++; //Increment symbol id
        createCards.innerHTML += listCard; //Put the child (li) to its parent (ul)
    }
}

// Get the section deck element from index.html
const sectionDeck = $('#section-deck');

// Call createList function to initiate the cards DOM
createList();

// Insert html cards into section deck element
sectionDeck.append(createCards);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Declarer des variables necessaires

const showMe = document.querySelectorAll('.card'); //Get list of cards elements
const countMoves = document.querySelector('#moves'); //Get the Number of moves element
const textMoves = document.querySelector('#text-moves'); //Get the text of moves element

//TODO: Setup moves
let moves = '';
countMoves.textContent = 0;
let count = 0;

// Create function that increment moves counter each time player open a card
function incrementMoves() {
    count++
    countMoves.textContent = count;
    moves = txtPlural(count, 'move'); // If count > 1 move will be moves (plural)
    textMoves.textContent = moves; // insert moves text into its html
    starsRating(); // check stars rating
}

// create liste of classes names
const openCardClasses = ['animated', 'flipInY', 'open','show'];
/*
*I had to change flipInY animation class from [animate.css library file]
* (take a look at line 2005 and 2038)
* The change was invert rotation direction
*/

//Create array to store the opened card Id
let positionId= [];

//call function that loop event when player click on a card
playGame();
//Create function that loop event when player click on a card
function playGame() {
    let numberClicks = 0;
    for (const card of showMe) {
        card.addEventListener('click', function (event) {
            numberClicks++;
            if (!card.classList.contains('open')) {

                card.classList.add(...openCardClasses);
                positionId.push(card.id);
                //start the timer after first opened card 
                if (numberClicks===1) {
                    timer();
                }
                //play flip sound effect
                playSound();
                match.push(card.childNodes);

            }
            //call function to check if two opened cards matchs
            checkMatched();

        });
    }
}

// create sound effects variables
let flipSound = document.getElementById("flip-card"); //get Flip card audio element

//Create function that play the flip card sound effect
function playSound() {
    flipSound.play();
}

//TODO: Check if two opened cards matchs
let match = []; //Array that store two open matched card
let progression = 0; // Initiate number of matched card to 0
let symbolCard = document.querySelectorAll('.open'); //Get opened cards elements

//Create function that check if two opened cards matchs
function checkMatched (){
    if (match.length === 2) { //if two cards are opened
        incrementMoves();
        if (match[0][0].classList[1]==match[1][0].classList[1]) { //check if two cards matchs

            for (const id of positionId) { //loop over the matched cards
                let matched = document.querySelector(`#${id}`); //get the id of each card opened card
                setTimeout(() => {
                    matched.classList.add('match'); //Card will be green
                    matched.classList.replace('flipInY', 'rubberBand'); //animate correct guess & keep the matched card open
                }, 1000);
                match =[]; //Empty matched array for the next loop
                positionId =[]; //Empty position id array for the next loop
                progression++; // increment number of matched card

                if (progression === 16) { //If all Cards are matched

                    //save the current score into local storage data
                    storageGame(starsNum, timerGame);
                    //get the last score from local storage
                    let swalStar = data.stars[data.stars.length-1];
                    let swalSeconds = data.seconds[data.seconds.length-1];
                    //After 2 seconds display Success popup message using Sweet alert library
                    setTimeout(() => {
                        swal({
                            title: 'Memory Game',
                            text: `Congratulation! You win, You have ${swalStar} ${txtPlural(swalStar, 'star')} and you've finshed at ${timeFormat(swalSeconds)}`,
                            width: '70%',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Play again?',
                            confirmButtonColor:'#50bbb5', //Set the same color as match card color background style
                          }).then((result) => {
                            if (result.value) {
                                location.reload(); //Reset the game
                            }
                          })
                    }, 2000);

                }
            }

        }
        // But if the 2 cards don't match
        else{
            for (const id of positionId) {
                let notMatched = document.querySelector(`#${id}`);
                match =[];
                positionId =[];
                setTimeout(() => {
                    notMatched.classList.add('not-match') //Card will be red
                    notMatched.classList.replace('flipInY', 'wobble'); //animate wrong guess

                    setTimeout(() => {
                        //turn the card back
                        notMatched.classList.remove('open','show', 'not-match');
                        notMatched.classList.add('flipInY');
                        notMatched.classList.remove('wobble');
                        setTimeout(() => {
                            notMatched.classList.remove('flipInY');// remove flipped animation
                        }, 1000);

                    }, 1500);

                }, 1000);
            }
        }
    }
}

//Function timer
let timerGame = 0; //Initiate timer to 0
let second, minute;
function timer() {
    let interval = setInterval (()=>{
        timerGame++; // increment timer value every 1 second
        // Timer will stop after 5 minutes (300s)
        if (timerGame<=300) {
            $('.timer').text(timeFormat(timerGame)); //set text Timer element in (minutes:seconds)

            if (timerGame === 180) {
                $('.timer').css('color','goldenrod'); //Change color at (03:00)
            }

            if (timerGame === 250) {
                $('.timer').css('color','orange'); //Change color at (04:10)
            }

            if (timerGame === 280) {
                $('.timer').css('color','red');  //Change color at (04:40)
                $('.timer').addClass('animated flash infinite'); //time falshes in red
            }

            if (progression===16) {
                clearInterval(interval); //Stop Timer wen all matched cards are displayed
            }
        }
        // If time is over befor the end of the game
        else {
            clearInterval(interval); //stop timer
            $('.timer').removeClass('animated flash infinite'); // Remove timer animation
            // Display game over popup message using Sweet alert library
            swal({
                title: 'Game Over',
                text: 'Time finished',
                type: 'error',
                confirmButtonText : 'Try again!'
            }).then((result) =>{
                if (result.value) {
                    location.reload(); //reset the game
                }
            });
        }

    },1000);

}

//Function that reset the game board, the timer, and the star rating
function restart() {
    //Display popup message asking player if he want to restart the game, using Sweet alert library
    swal({
        title: 'Restart Memory game',
        text: "Are you sure?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
            location.reload();
        }
      })
}

// Create Star rating function
let starsNum = 3;
function starsRating() {
    // player will loose one star after 50 moves
    if (count === 12) {
        $('.stars li:last').css('color','grey');
        starsNum--; //Decrement number of stars
    }
    // player will loose the second star after 60 moves
    if (count === 18) {
        $('.stars li:odd').css('color','grey');
        starsNum--;
    }
}

// local storage
// create data storage object
let data = {
    "stars" : [],
    "seconds" : [],
    "gameDate" : [] //Array that stores date and time from time system
};
// get data from local storage
getDataStorage();
function getDataStorage() {
    let getStars =JSON.parse(localStorage.getItem('stars', data.stars));
    let getSeconds = JSON.parse(localStorage.getItem('seconds', data.seconds));
    let getDataDate = JSON.parse(localStorage.getItem('date', data.gameDate));
    // Check if locale storage data is empty
    if ((getStars === null) && (getSeconds === null) && (getDataDate === null)) {
        // Store current game score
        data.stars.concat(getStars);
        data.seconds.concat(getSeconds);
        data.gameDate.concat(getDataDate);
    } else { // if there is data assing it into data object
        data.stars = getStars;
        data.seconds = getSeconds;
        data.gameDate = getDataDate;
    }
}

// Function that sets data to local storage
function storageGame(st, sec) {
    // add new values to the data object
    data.stars.push(st);
    data.seconds.push(sec);
    data.gameDate.push(dateStorage());

    // add new values from data storage object to local storage
    localStorage.setItem('stars', JSON.stringify(data.stars));
    localStorage.setItem('seconds', JSON.stringify(data.seconds));
    localStorage.setItem('date', JSON.stringify(data.gameDate));
}

// Create timeFormat function that converts seconds to minutes and seconds format (00 : 00)
function timeFormat(gameSecond) {
    let minutes = `0${parseInt(gameSecond / 60)}`;
    let seconds = gameSecond % 60;
    (seconds < 10)? seconds = `0${seconds}`: seconds;
    return minutes + ":" + seconds;
}

// Create timeFormat function that adds s at the end of plural value string
function txtPlural(num , txt) {
    let txtPlural = (num > 1)? `${txt}s` : txt;
    return txtPlural;
}

//create date function to get date and time system, then return to a specefic format
function dateStorage() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();
    return `${year}/${month}/${day} - ${hour}:${minute}`; // returns string like (2018/4/26 - 11:57)
}

//Toggle ON/OFF sound effect when audio button is clicked
let audioButton = document.getElementById('audio');
audioButton.addEventListener('click', audio => {
    toggleAudioOnOff();
});

// create function that set audio On or Off
function toggleAudioOnOff() {
    let vol = (flipSound.volume === 1)? flipSound.volume = 0 : flipSound.volume = 1;
    let audioIcon = document.getElementById('volume');
    if (vol === 1) {
        audioIcon.classList.replace('fa-volume-off', 'fa-volume-up');
    }
    else {
        audioIcon.classList.replace('fa-volume-up', 'fa-volume-off');
    }
}

//Score board
let scoreBoard = $('#score-board'); //Get score-board html element
// Create score object that stores data object elements values
const score = {
    stars : data.stars,
    seconds : data.seconds,
    gameDate :data.gameDate
}

// Function that loops over score object values and create HTML element wich be appended into score bord HTML element
scoreData();
function scoreData() {

    let scoreContent = '';
    for (let i = 0; i < score.stars.length; i++) {
        let scoreBody = document.createElement('div');
        scoreBody.setAttribute('class','score-body');
        let scoreUl = document.createElement('ul');
        //Create text content for each data
        scoreContent = `<li>Date: ${score.gameDate[i]}</li><li>Time: ${timeFormat(score.seconds[i])}</li><li>Score: ${score.stars[i]} ${txtPlural(score.stars[i], 'star')}</li>`;
        //Instert data to its HTml elements
        scoreUl.innerHTML =scoreContent;
        scoreBody.append(scoreUl);
        scoreBoard.append(scoreBody);
    }

}

//create keyboard shortcuts event
document.addEventListener('keyup', event => {
    let k = event.which;
    // If R key is pressed, restart game
    if (k == 82) {
        restart();
    }
    // If S key is pressed, display score game board
    if (k == 83) {
        displayScoreBoard();
    }
    // If V key is pressed, toggle Audio volume to ON/OFF
    if (k == 86) {
        toggleAudioOnOff();
    }
});

// Display score board When player click on stars panel
const displayScore = document.querySelector('.stars');
displayScore.addEventListener('click', event => {
    displayScoreBoard();
})

function displayScoreBoard() {
    if (score.stars.length > 0) { // If there is data in local storage
        scoreBoard.toggle(); //Display score board popup message
    }
    else {  // If there is no data in local storage
        swal({ // Display info popup using sweat alert framework
            title: 'Sport Game Memory',
            text: 'You have to win at least one time to see your score log!',
            type: 'info',
            confirmButtonColor: '#50bbb5'
        });
    }

}

// create a close button that allows player to close score board popup
const close = document.querySelector('#close');
close.addEventListener('click', event => {
    closePanel(scoreBoard);
})

// create function that close window popup
function closePanel(popup) {
    return popup.css('display', 'none');
}