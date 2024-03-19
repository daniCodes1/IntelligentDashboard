"use strict";

let countdown = 0;
let difficulty = [0, 0]; // represents difficulty, # of elements
let tasks = 0;
let timerRound = 0;

document.querySelector(".add").addEventListener("click", function () {
  event.preventDefault();
  if (tasks >= 12) {
    alert("You are at the maximum number of tasks");
  } else {
    let dur = document.getElementById("duration").value;
    let diff = document.getElementById("difficulty").value;
    let newTaskName = document.getElementById("tname").value;

    const newTaskDuration = Number(dur);
    const newTaskDifficulty = Number(diff);

    if (newTaskName == "" || dur == "" || diff == "") {
      alert("Please fill in all fields.");
    } else if (newTaskName.length > 25) {
      console.log(newTaskName.length);
      alert("Task name must be under 25 characters");
    } else if (newTaskDifficulty == 0 || newTaskDuration == 0) {
      alert("difficulty and duration cannot be 0");
    } else if (!(Number.isInteger(newTaskDuration) && newTaskDuration > 0)) {
      console.log(newTaskDuration);
      alert("The duration should be a positive integer");
    } else if (
      !(
        Number.isInteger(newTaskDifficulty) &&
        newTaskDifficulty > 0 &&
        newTaskDifficulty <= 10
      )
    ) {
      alert(
        "Difficulty should be a a positive integer less than or equal to 10"
      );
    } else {
      let div = document.createElement("div");
      div.setAttribute("class", "box");
      div.setAttribute("draggable", "true");
      div.setAttribute("ondragstart", "drag(event)");

      // Set ID
      const idName = newTaskName.replace(/\s+/g, "");
      div.setAttribute("id", `${idName}`);
      // Create task
      div.innerHTML = `${newTaskName} <h5 id="${idName}-time" data-duration="${newTaskDuration}" data-difficulty="${newTaskDifficulty}" >[${newTaskDuration} minutes]</h5>`;
      console.log(`${idName}-time`);

      const leftChildren = document.querySelector(".column1").children.length;
      if (leftChildren < 6) {
        document.querySelector(".column1").appendChild(div);
        console.log(`Tasks on left: ${leftChildren}`);
      } else {
        document.querySelector(".column2").appendChild(div);
      }

      updateDuration(newTaskDuration, true);

      updateDifficulty(newTaskDifficulty, true);

      tasks++;

      document.getElementById("duration").value = "";
      document.getElementById("difficulty").value = "";
      document.getElementById("tname").value = "";
    }
  }
});

function updateDuration(duration, state) {
  if (state) {
    countdown += duration;
  } else {
    countdown -= duration;
    if (countdown == 0) {
      alert("Congratulations! All tasks are finished, productivity god!");
    }
  }
  let header = document.getElementById("countdown");
  header.innerHTML = countdown;
}

function updateDifficulty(level, state) {
  if (state) {
    difficulty[0] += level;
    difficulty[1]++;
  } else {
    difficulty[0] -= level;
    difficulty[1] -= 1;
  }
  const status = document.getElementById("stat-difficulty");
  if (difficulty[1] == 0) {
    // case: denominator = 0
    status.innerHTML = "Easy";
  } else {
    const avgDifficulty = difficulty[0] / difficulty[1];

    if (avgDifficulty < 4) {
      status.innerHTML = "Easy";
    } else if (avgDifficulty <= 7) {
      status.innerHTML = "Medium";
    } else {
      status.innerHTML = "Difficult";
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Set the data that is being transferred during the drag
  event.dataTransfer.setData("text/plain", event.target.id);
  // Construct the text content including the child elements
  const textContent = Array.from(event.target.childNodes)
    .map((child) => child.textContent || child.innerText)
    .join("");

  // Set the text content data
  event.dataTransfer.setData("text/plain-content", textContent);
}

function drop(event) {
  event.preventDefault();
  var draggedId = event.dataTransfer.getData("text/plain");
  // Get a reference to the dragged element
  var draggedElement = document.getElementById(draggedId);

  // Check if the dragged element exists
  if (draggedElement) {
    // Update time
    let element = document.getElementById(`${draggedId}-time`);
    const duration = Number(element.getAttribute("data-duration"));
    updateDuration(duration);

    // Update difficulty
    updateDifficulty(Number(element.getAttribute("data-difficulty")), false);

    // Remove the dragged element from the DOM
    const textContent = event.dataTransfer.getData("text/plain-content");
    draggedElement.parentNode.removeChild(draggedElement);
    tasks--;

    // Print out the task that was completed and removed
    console.log(`The following task was completed: ${textContent}`);
  }
}

// Fetch Quote
document.querySelector(".quote").addEventListener("click", getQuote);

async function getQuote() {
  try {
    const displayQuote = document.querySelector(".user-quote");
    displayQuote.innerHTML = "";
    displayQuote.classList.add("spinning");
    // Get the element where you want to show the loading animation
    // const loadingText = document.querySelector(".user-quote");
    // Set the inner text of the element to the spinning animation

    const response = await fetch("https://api.adviceslip.com/advice");
    var data = await response.json();

    displayQuote.innerHTML = data.slip.advice;

    displayQuote.classList.remove("spinning");
    displayQuote.classList.remove("hidden");
  } catch (err) {
    alert(err);
  }
}

// Timer functionality
/* Pomodoro technique:
25 minutes of work broken into 5 minute breaks
every 4 consecutive interals u get a 20 minute break
*/

document.querySelector(".study-timer").addEventListener("click", runPomodoro);
document.querySelector(".stop-timer").addEventListener("click", stopPomodoro);
// Show time section
const timerDisplay = document.querySelector(".update-timer");
// Display the elapsed time only
const displayTime = document.querySelector(".current");
const link = document.querySelector(".pomodoro-link");

let startTime;
let intervalID; // to stop it later
let timeoutID;

function stopPomodoro() {
  clearInterval(intervalID);
  clearTimeout(timeoutID);
  timerRound = 0;
  displayTime.innerHTML = "";
  timerDisplay.classList.add("hidden");
  link.classList.remove("hidden");
  link.classList.add("pomodoro-link");
}

function runPomodoro() {
  // Update which round of Pomodoro
  timerRound++;
  link.classList.remove("pomodoro-link");
  link.classList.add("hidden");
  // Set appropriate timer
  if (timerRound == 4) {
    timerRound = 0; // set back to 0 intervals of work time
    showTimer();
    timeoutID = setTimeout(doTwentyBreak, 25 * 60 * 1000); // after 25 mins of work, get a 20 minute break
  } else {
    showTimer();
    timeoutID = setTimeout(doFiveBreak, 25 * 60 * 1000); // after 25 mins of work, get a 5 minute break
  }
}

function showTimer() {
  // Update start time
  startTime = Date.now();

  // Count and show elapsed time
  clearInterval(intervalID);
  intervalID = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
  // Get the current time (to subtract from)
  const currentTime = Date.now();

  // Calculate the elapsed time (milliseconds)
  const elapsedTime = currentTime - startTime;

  // Convert to minutes and seconds
  const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
  const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

  // Show time
  timerDisplay.classList.remove("hidden");

  // Display the elapsed time
  displayTime.innerHTML = `Elapsed time: ${elapsedMinutes} minutes ${elapsedSeconds} seconds`;
}

// Five minute break, run 25 after
function doFiveBreak() {
  showTimer();
  timeoutID = setTimeout(runPomodoro, 5 * 60 * 1000);
}

// Twenty minute break, run 25 after
function doTwentyBreak() {
  showTimer();
  timeoutID = setTimeout(runPomodoro, 20 * 60 * 1000);
}

// TESTING PURPOSES ONLY (shortened version):

// document.querySelector(".study-timer").addEventListener("click", runPomodoro);
// let startTime;
// let intervalID;
// // 25 minutes of work
// function runPomodoro() {
//   //update current round
//   timerRound++;
//   console.log(timerRound);

//   // show current status of timer
//   const timerDisplay = document.querySelector(".update-timer");
//   timerDisplay.classList.remove("hidden");

//   if (timerRound == 4) {
//     timerRound = 0; // set back to 0 intervals of work time
//     // Record the time when the timer is set
//     // startTime = Date.now();
//     showTimer();
//     setTimeout(doTwentyBreak, 10000); // after 10 secs of work, get a 9 sec break
//     // showTimer(25 * 60 * 1000);
//   } else {
//     // startTime = Date.now();
//     showTimer();
//     setTimeout(doFiveBreak, 10000); // after 10 secs of work, get a 5 sec break
//   }
// }

// function showTimer() {
//   startTime = Date.now();
//   console.log("Got to showTimer");
//   clearInterval(intervalID);
//   intervalID = setInterval(updateElapsedTime, 1000);
// }

// // Function to update the elapsed time
// function updateElapsedTime() {
//   // Get the current time
//   const currentTime = Date.now();

//   // Calculate the elapsed time in milliseconds
//   const elapsedTime = currentTime - startTime;

//   // Convert the elapsed time to minutes and seconds
//   const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
//   const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

//   const displayTime = document.querySelector(".current");
//   // Display the elapsed time
//   displayTime.innerHTML = `Elapsed time: ${elapsedMinutes} minutes ${elapsedSeconds} seconds`;
// }

// // Five minute break
// function doFiveBreak() {
//   showTimer();
//   setTimeout(runPomodoro, 5000);
//   // showTimer(5 * 60 * 1000);
// }

// // Twenty minute break
// function doTwentyBreak() {
//   // startTime = Date.now();
//   showTimer();
//   setTimeout(runPomodoro, 9000);
//   // showTimer(20 * 60 * 1000);
// }
