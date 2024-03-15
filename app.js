"use strict";

let countdown = 0;
let difficulty = [0, 0]; // represents difficulty, # of elements

document.querySelector(".add").addEventListener("click", function () {
  event.preventDefault();
  let dur = document.getElementById("duration").value;
  let diff = document.getElementById("difficulty").value;
  let newTaskName = document.getElementById("tname").value;

  const newTaskDuration = Number(dur);
  const newTaskDifficulty = Number(diff);

  if (newTaskName == "" || newTaskDuration == "" || newTaskDifficulty == "") {
    alert("Please fill in all fields.");
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
    alert("Difficulty should be a a positive integer less than or equal to 10");
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
    document.querySelector(".main-screen").appendChild(div);

    // Add the duration to total duration:
    updateDuration(newTaskDuration, true);

    updateDifficulty(newTaskDifficulty, true);
  }

  document.getElementById("duration").value = "";
  document.getElementById("difficulty").value = "";
  document.getElementById("tname").value = "";
});

function updateDuration(duration, state) {
  if (state) {
    countdown += duration;
  } else {
    countdown -= duration;
  }
  let header = document.getElementById("countdown");
  header.innerHTML = countdown;
}

function updateDifficulty(level, state) {
  if (state) {
    difficulty[0] += level;
    difficulty[1] += 1;
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

    // Print out the task that was completed and removed
    alert(`The following task was completed: ${textContent}`);
  }
}

/*
1.) Tasks to be able to be removed (Dani)

-----------------------------------------
- Get event handler registering the drop (may have to preventDefault before)
2.) Dynamic resizing of the main panel and adding tasks (Michael)
3.) Calculating the Statistics and displaying them (Dani) 
4.) Reshuffling the tasks 
5.) call to OpenAI API 
6.) Display GPT text 
(main goals)
*/
