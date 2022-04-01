/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

console.log("Hello, whenever you are ready to begin playing press the Start Button");

// Global Variables
// Global Constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var pattern = [1, 10, 7, 8, 4, 6, 2, 2, 9, 5, 9, 9, 3, 1, 7, 5, 10, 6];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame()
{
    //initialize game variables
    Math.random(pattern);
    progress = 0;
    gamePlaying = true;
  
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function guess(btn)
{
  console.log("user guessed: " + btn);
  if(!gamePlaying)
  {
    return;
  }
  
  // add game logic here
  if(pattern[guessCounter] == btn)
  {
    //Guess was correct!
    if(guessCounter == progress)
    {
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }
      
      else
      {
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }
    
    else
    {
      //so far so good... check the next guess
      guessCounter++;
    }
  }
  
  else
  {
    //Guess was incorrect
    //GAME OVER: LOSE!
    loseGame();
  }
}

function stopGame()
{
    //initialize game variables
    gamePlaying = false;
  
  // swap the Start and Stop buttons
document.getElementById("stopBtn").classList.add("hidden");
document.getElementById("startBtn").classList.remove("hidden");
}

function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

function winGame()
{
  stopGame();
  alert("Congratulations. You won!");
}

// Sound Synthesis Functions
const freqMap = 
      {
  1: 261.6,  /// green
  2: 329.6,    /// blue
  3: 199.9,      /// pink 
  4: 466.2,  /// yellow
  5: 261.6,    /// orange
  6: 272.6,  /// green 
  7: 265.8,    /// blue
  8: 164.2,      /// pink
  9: 261.6,  /// yellow 
  10: 197.6    /// orange
  
}

function playSingleClue(btn)
{
  if(gamePlaying)
  {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence()
{
  context.resume()
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++)
  { // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function playTone(btn,len)
{ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function()
             {
    stopTone()
  }
             ,len)
}

function startTone(btn)
{
  if(!tonePlaying)
  {
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}

function stopTone()
{
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

