"use strict";

let countdown = 0;

document.querySelector(".add").addEventListener("click", function () {
  event.preventDefault();
  let div = document.createElement("div");
  div.setAttribute("class", "box");
  div.setAttribute("draggable", "true");
  div.setAttribute("ondragstart", "drag(event)");

  const newTaskName = document.getElementById("tname").value;
  const newTaskDuration = document.getElementById("duration").value;

  const idName = newTaskName.replace(/\s+/g, ""); // remove spaces for ID name
  div.setAttribute("id", `${idName}`);

  div.innerHTML = `${newTaskName} <h5 id="${idName}-time" data-duration="${newTaskDuration}">[${newTaskDuration} minutes]</h5>`;
  console.log(`${idName}-time`);
  document.querySelector(".main-screen").appendChild(div);

  // add the duration to total duration:
  countdown += Number(newTaskDuration);
  let header = document.getElementById("countdown");
  header.innerHTML = countdown;
});

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

  // Check if the dragged element existss
  if (draggedElement) {
    // Update time
    let element = document.getElementById(`${draggedId}-time`);
    const duration = element.getAttribute("data-duration");
    countdown -= String(duration);
    let header = document.getElementById("countdown");
    header.innerHTML = countdown;

    // Remove the dragged element from the DOM
    const textContent = event.dataTransfer.getData("text/plain-content");
    draggedElement.parentNode.removeChild(draggedElement);

    // Print out the task that was completed and removed
    console.log("The following task was completed: ", textContent);
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
