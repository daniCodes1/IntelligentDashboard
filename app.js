"use strict";

document.querySelector(".add").addEventListener("click", function () {
  event.preventDefault();
  var div = document.createElement("div");
  div.setAttribute("class", "box");
  div.setAttribute("draggable", "true");
  div.setAttribute("ondragstart", "drag(event)");

  const newTaskName = document.getElementById("tname").value;
  const newTaskDuration = document.getElementById("duration").value;

  const idName = newTaskName.replace(/\s+/g, ""); // remove spaces for ID name
  div.setAttribute("id", `${idName}-id`);
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Set the data that is being transferred during the drag
  event.dataTransfer.setData("text/plain", event.target.id);
  // Set ONLY THE INNER TEXT DATA of each task
  event.dataTransfer.setData("text/plain-content", event.target.innerText);
}

function drop(event) {
  event.preventDefault();
  console.log("Hello! This functionality works");
  var draggedId = event.dataTransfer.getData("text/plain");
  // Get a reference to the dragged element
  var draggedElement = document.getElementById(draggedId);

  // Check if the dragged element existss
  if (draggedElement) {
    // Remove the dragged element from the DOM
    draggedElement.parentNode.removeChild(draggedElement);

    // Print out the task that was completed and removed
    var textContent = event.dataTransfer.getData("text/plain-content");
    console.log("The following task was completed: ", textContent);
  }

  // var myDiv = ev.target;

  // // Check if the div element exists
  // if (myDiv) {
  //     // Remove the div from the DOM
  //     myDiv.parentNode.removeChild(myDiv);

  // }
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
