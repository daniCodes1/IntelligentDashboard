"use strict"

// const dropHandler = function (event) {
//     console.log("Heyo");
//     event.preventDefault();
// }

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    console.log("Hello! This functionality works")
}
/*
1.) Tasks to be able to be removed (Dani)

-----------------------------------------
- Get event handler registering the drop (may have to preventDefault before)
- once draggable object dragged into remove bin add "hidden" tag to the hrml element 
-You may want to keep an array of all the tasks and apply a fillter to filter out the hidden ones so they are not calculated in the stats 
------------------------------------------

2.) Dynamic resizing of the main panel and adding tasks (Michael)
3.) Calculating the Statistics and displaying them (Dani) 
4.) Reshuffling the tasks 
5.) call to OpenAI API 
6.) Display GPT text 
(main goals)
*/ 