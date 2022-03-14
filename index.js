console.log("Whats Up ?");

const PLAYS = [
  {
    play: "Rock",
    wins: "Scissors",
    loosesTo: "Paper"
  },
  {
    play: "Scissors",
    wins: "Paper",
    loosesTo: "Rock"
  },
  {
    play: "Paper",
    wins: "Rock",
    loosesTo: "Scissors"
  }
];

function computerPlay() {
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

let playerScore =  0;
let computerScore =  0;

for(let i = 0; i < 5; i++) {
  let userInput =  window.prompt();
  let roundResult = playRound(userInput, computerPlay());
  
  console.log(`round ${i}`, roundResult);
  if(roundResult.includes("Tie")) { continue; }
  if(roundResult.includes("Player"))   { playerScore++; continue; }
  if(roundResult.includes("Computer")) { computerScore++; continue; }
  
  i--;
}

console.log(
  "Final Result:\n",
  "playerScore =", playerScore,
  "computerScore =", computerScore
)
