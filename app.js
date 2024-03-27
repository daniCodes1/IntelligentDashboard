"use strict";

class TaskManager {
  constructor() {
    // DOM elements
    this.addBtn = document.querySelector(".add");
    this.totalDifficulty = document.getElementById("stat-difficulty");
    this.congratsMsg = document.querySelector(".congrats");
    this.handleTask = this.handleTask.bind(this);
    this.addBtn.addEventListener("click", this.handleTask);

    // Properties
    this.totalTasks = 0;
    this.difficulty = 0;
    this.timeLeft = 0;
  }

  handleTask() {
    event.preventDefault();

    // Alert user if the total tasks exceed screen capacity
    if (this.totalTasks >= 12) {
      alert("You are at the maximum number of tasks");
    } else {
      let newTaskName = document.getElementById("tname").value;
      let newTaskDuration = Number(document.getElementById("duration").value);
      let newTaskDifficulty = Number(
        document.getElementById("difficulty").value
      );

      // Validate input fields for a new task
      if (
        this.authenticateTaskFields(
          newTaskName,
          newTaskDuration,
          newTaskDifficulty
        )
      ) {
        // Proceed with task creation
        this.addTask(newTaskName, newTaskDuration, newTaskDifficulty);

        // Manage states
        this.updateDuration(newTaskDuration, true);
        this.updateDifficulty(newTaskDifficulty, true);

        // Set back to empty inputs
        document.getElementById("duration").value = "";
        document.getElementById("difficulty").value = "";
        document.getElementById("tname").value = "";
      }
    }
  }

  addTask(newTaskName, newTaskDuration, newTaskDifficulty) {
    // Set task attributes
    let div = document.createElement("div");
    div.setAttribute("class", "box");
    div.setAttribute("draggable", "true");
    div.setAttribute("ondragstart", "drag(event)");
    div.dataset.duration = newTaskDuration;
    div.dataset.difficulty = newTaskDifficulty;

    // Set ID
    const idName = newTaskName.replace(/\s+/g, "");
    div.setAttribute("id", `${idName}`);

    // Add task element to the task list, alternating between two columns if one column is full
    div.innerHTML = `${newTaskName} <h5>[${newTaskDuration} minutes]</h5>`;
    const leftChildren = document.querySelector(".column1").children.length;
    if (leftChildren < 6) {
      document.querySelector(".column1").appendChild(div);
      console.log(`Tasks on left: ${leftChildren}`);
    } else {
      document.querySelector(".column2").appendChild(div);
    }
  }

  authenticateTaskFields(newTaskName, newTaskDuration, newTaskDifficulty) {
    if (newTaskName == "") {
      alert("Please fill in task name.");
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
      return true;
    }
    return false;
  }

  // If state is true, add the task duration to the total time left; otherwise, subtract the task duration
  // If the total time left becomes 0, show the congratulations message for finishing all tasks
  updateDuration(duration, state) {
    console.log(duration);
    if (state) {
      this.congratsMsg.classList.add("hidden");
      this.timeLeft += duration;
    } else {
      this.timeLeft -= duration;
      if (this.timeLeft == 0) {
        this.congratsMsg.classList.remove("hidden");
      }
    }

    // Update the user display
    let header = document.getElementById("countdown");
    header.innerHTML = this.timeLeft;
  }

  // Update total difficulty and number of tasks based on the specified difficulty level and state
  updateDifficulty(level, state) {
    console.log(document);
    if (state) {
      this.difficulty += level;
      this.totalTasks++;
    } else {
      this.difficulty -= level;
      this.totalTasks -= 1;
    }

    // Cannot divide by 0 (denominator is 0)
    if (this.totalTasks == 0) {
      this.totalDifficulty.innerHTML = "No tasks";
    } else {
      const avgDifficulty = this.difficulty / this.totalTasks;

      // Update user display
      if (avgDifficulty < 4) {
        this.totalDifficulty.innerHTML = "Easy";
      } else if (avgDifficulty <= 7) {
        this.totalDifficulty.innerHTML = "Medium";
      } else {
        this.totalDifficulty.innerHTML = "Difficult";
      }
    }
  }
}

class Quote {
  constructor() {
    // DOM element assignments
    document
      .querySelector(".quote")
      .addEventListener("click", this.getQuote.bind(this));
    this.displayQuote = document.querySelector(".user-quote");
  }

  // Asynchronously fetch a quote from the API
  async getQuote() {
    try {
      // Clear any existing quote
      this.displayQuote.innerHTML = "";

      // Add a spinning animation while waiting for response
      this.displayQuote.classList.add("spinning");

      // Fetch quote from API
      const response = await fetch("https://api.adviceslip.com/advice");
      var data = await response.json();

      // Update the quote
      this.displayQuote.innerHTML = data.slip.advice;

      // Remove spinning animation and show the quote on UI
      this.displayQuote.classList.remove("spinning");
      this.displayQuote.classList.remove("hidden");
    } catch (err) {
      // Alert user with any error from fetch
      alert(err);
    }
  }
}

// Timer functionality
/* Pomodoro technique:
25 minutes of work broken into 5 minute breaks
Every 4 consecutive interals u get a 20 minute break
*/

class Pomodoro {
  constructor() {
    document
      .querySelector(".study-timer")
      .addEventListener("click", this.runPomodoro.bind(this)); // Called by the element triggering the event
    document
      .querySelector(".stop-timer")
      .addEventListener("click", this.stopPomodoro.bind(this));
    this.timerDisplay = document.querySelector(".update-timer");
    this.infoLink = document.querySelector(".pomodoro-link");
    this.currentInterval = document.getElementById("interval-name");
    // only the counting
    this.countdown = document.querySelector(".current");
    this.progressBar = document.querySelector(".progress-bar");
    this.progressContainer = document.querySelector(".progress-container");
    this.startTime = 0;
    this.rounds = 0;
    this.intervalID = "";
    this.timeoutID = "";
  }

  runPomodoro() {
    console.log("starting");
    this.rounds++;
    this.infoLink.classList.remove("pomodoro-link");
    this.infoLink.classList.add("hidden");
    this.currentInterval.innerHTML = "Current interval: 25 minutes of work";

    console.log("Reached 25");
    // Set appropriate timer + callback
    if (this.rounds == 4) {
      this.rounds = 0; // set back to 0 intervals of work time
      this.showTimer(25);

      this.timeoutID = setTimeout(this.doTwentyBreak.bind(this), 25 * 60000); // after 25 mins of work, get a 20 minute break
    } else {
      this.showTimer(25);
      this.timeoutID = setTimeout(this.doFiveBreak.bind(this), 25 * 60000); // after 25 mins of work, get a 5 minute break
    }
  }

  // Five minute break, run 25 after
  doFiveBreak() {
    console.log("Reached 5");
    this.currentInterval.innerHTML = "Current interval: 5 minute break";
    this.showTimer(5);
    this.timeoutID = setTimeout(this.runPomodoro.bind(this), 5 * 60000);
  }

  // Twenty minute break, run 25 after
  doTwentyBreak() {
    console.log("Reached 20");
    this.currentInterval.innerHTML = "Current interval: 20 minute break";
    this.showTimer(20);
    this.timeoutID = setTimeout(this.runPomodoro.bind(this), 20 * 60000);
  }

  showTimer(num) {
    // Update start time
    this.startTime = Date.now();

    // Count and show elapsed time
    clearInterval(this.intervalID);
    this.intervalID = setInterval(this.updateElapsedTime.bind(this, num), 1000);
  }

  updateElapsedTime(num) {
    // Get the current time (to subtract from)
    const currentTime = Date.now();

    // Calculate the elapsed time (milliseconds)
    const elapsedTime = currentTime - this.startTime;
    const remainingTime = num * 60000 - elapsedTime;

    // Convert to minutes and seconds
    const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Display the elapsed time
    this.countdown.innerHTML = `Time left: ${remainingMinutes} minutes ${remainingSeconds} seconds`;

    // Calculate progress percentage
    const progress = ((num * 60000 - remainingTime) / (num * 60000)) * 100;

    // Update progress bar
    this.progressBar.style.width = `${progress}%`;
    if (Math.ceil(progress) > 100) {
      this.progressBar.innerHTML;
    } else {
      this.progressBar.innerHTML = `${Math.ceil(progress)}%`;
    }
    this.progressContainer.classList.remove("hidden");
    // Show the time
    this.timerDisplay.classList.remove("hidden");
  }

  stopPomodoro() {
    clearInterval(this.intervalID);
    clearTimeout(this.timeoutID);
    this.rounds = 0;
    this.countdown.innerHTML = "";
    this.timerDisplay.classList.add("hidden");
    this.infoLink.classList.remove("hidden");
    this.infoLink.classList.add("pomodoro-link");
    this.progressBar.style.width = "0%";
    this.progressContainer.classList.add("hidden");
  }
}

// Global functions
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Set the data that is being transferred during the drag
  event.dataTransfer.setData("text/plain", event.target.id);
  console.log(event.target.id);
  // Set the text of the dragged element
  event.dataTransfer.setData("text/plain-content", event.target.textContent);
}

function drop(event) {
  event.preventDefault();
  let draggedId = event.dataTransfer.getData("text/plain");

  // Get a reference to the dragged element
  let draggedElement = document.getElementById(draggedId);

  // Check if the dragged element exists
  if (draggedElement) {
    // Update time
    taskManager.updateDuration(
      parseInt(draggedElement.dataset.duration),
      false
    );

    // Update difficulty
    taskManager.updateDifficulty(
      parseInt(draggedElement.dataset.difficulty),
      false
    );

    // Remove the dragged element from the DOM
    const textContent = event.dataTransfer.getData("text/plain-content");
    draggedElement.parentNode.removeChild(draggedElement);

    // Print out the task that was completed and removed
    console.log(`The following task was completed: ${textContent}`);
  }
}

const taskManager = new TaskManager();
const quote = new Quote();
const pomodoro = new Pomodoro();
