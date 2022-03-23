let playIcons = [...document.querySelectorAll('.play-icon')];
let versusIcon = document.querySelector('.vs-icon');
let gamePanel = document.querySelector('.game-panel');
let scorePanel = document.querySelector('.score');


const PLAYS = [
  {
    play: "rock",
    wins: "scissor",
    loosesTo: "paper"
  },
  {
    play: "scissor",
    wins: "paper",
    loosesTo: "rock"
  },
  {
    play: "paper",
    wins: "rock",
    loosesTo: "scissor"
  }
];


let gameState = 'waiting for user play';
let userPlay = '';
let botPlay = '';
let botPlayIcon = '';
let playerScore =  0;
let computerScore =  0;


playIcons.forEach((playIcon) => playIcon.addEventListener(
  'click', gameStateMachine)
);

function gameRestart() {
  gameState = 'none';
  
  userPlay.removeEventListener('animationend', gameStateMachine);
  userPlay.classList.remove('shaking');

  botPlayIcon.classList.add('inactive');
  versusIcon.classList.add('inactive');
  userPlay.classList.add('inactive');
  gamePanel.style.setProperty('--result-font', '0');
  
  botPlayIcon.addEventListener('transitionend', (event) => {
    if(event.propertyName !== 'transform') {
      return;
    }

    playIcons.forEach((playIcon) => {
      playIcon.classList.remove('inactive');
      playIcon.removeEventListener('transitionend', gameStateMachine);
    });
  
    gamePanel.removeChild(botPlayIcon);
    
    [...document.querySelectorAll('[class*="-icon"]')].forEach((node) => {
      node.style.filter = 'none';
    });

    gameState = 'waiting for user play';
  });
}

function gameStateMachine(event=null) {
  // console.log(event);
  // console.log('State Machine in State :', gameState)
  switch(gameState) {
    case 'waiting for user play':
      // console.log(this.id);
      userPlay = this;

      this.classList.add('shaking');
      this.addEventListener('animationend', gameStateMachine);

      gameState = 'waiting for shaking animation';
      break;
    
    case 'waiting for shaking animation':
      this.classList.remove('shaking');

      let firstObject = true;
      playIcons.forEach((playIcon) => {
        if(playIcon.id != userPlay.id) {
          playIcon.classList.add('inactive');
          
          if(firstObject) {
            firstObject = false;
            playIcon.addEventListener('transitionend', gameStateMachine);
          }
        }
      });

      botPlay = computerGeneratePlay();

      botPlayIcon = playIcons[
        playIcons.findIndex((icon => icon.id === botPlay))
      ].cloneNode(true);
      botPlayIcon.id = 'botplay-icon';
      // console.log(botPlayIcon);
      botPlayIcon.classList.add('inactive');
      gamePanel.appendChild(botPlayIcon);
    
      gameState = 'waiting for fading animation';
      break;

    case 'waiting for fading animation':
      if(event.propertyName !== 'height') {
        return;
      }

      window.setTimeout(() => {
        versusIcon.classList.remove('inactive');
        botPlayIcon.classList.remove('inactive');
        botPlayIcon.addEventListener('transitionend', gameStateMachine);
      }, 200)
      
      gameState = 'waiting for bot play icon animation';
      break;

    case 'waiting for bot play icon animation':
      if(event.propertyName !== 'transform' || this.id !== 'botplay-icon') {
        return;
      }

      window.setTimeout(() => {
        [...document.querySelectorAll('[class*="-icon"]')].forEach((node) => {
          // node.classList.add('inactive');
          node.style.filter = 'blur(5px)';
        });
        
        let roundResult = playRound(userPlay.id, botPlay);
        console.log(roundResult);
        
        if(roundResult.includes("Player"))   {
          playerScore++;
          gamePanel.style.setProperty('--result-content', '"YOU WIN"');
        } else if(roundResult.includes("Computer")) {
          computerScore++;
          gamePanel.style.setProperty('--result-content', '"YOU LOOSE"');
        } else {
          gamePanel.style.setProperty('--result-content', '"TIE"');
        }
        gamePanel.style.setProperty('--result-font', '15vw');
        scorePanel.innerHTML = `<pre>Score :   ${playerScore}  vs  ${computerScore}</pre>`;

        window.setTimeout(gameRestart, 1000)
      }, 200);
      break;
  }
}

function computerGeneratePlay() {
  return PLAYS[
    Math.floor(Math.random() * PLAYS.length)].play;
}

function playRound(playerSelection, computerSelection) {
  let playerPlay = PLAYS.find(element => RegExp(playerSelection, 'i').test(element.play));
  let computerPlay = PLAYS.find(element => RegExp(computerSelection, 'i').test(element.play));

  if(!playerPlay || !computerPlay) { return `Unknown Play(s) ${playerSelection} vs ${computerSelection}`; }

  let result = "";
  switch(computerPlay.play) {
    case playerPlay.play:     result += "Tie";           break;
    case playerPlay.wins:     result += "Player Wins";   break;
    case playerPlay.loosesTo: result += "Computer Wins"; break;
  }
  result += ` ${playerSelection} vs ${computerSelection}`
  return result;
}
