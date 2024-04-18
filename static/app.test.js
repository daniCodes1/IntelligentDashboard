document.body.innerHTML = `
<div class="add"></div>
<div class="undo"></div>
<div class="redo"></div>
<div class="quote"></div>
<div class="study-timer"></div>
<div class="stop-timer"></div>
<div class="update-timer"></div>
<div class="pomodoro-link"></div>
<div id="interval-name"></div>
<div class="current"></div>
<div class="progress-bar"></div>
<div class="progress-container"></div>
<div class="remove-tasks"></div>
<div class="drop-zone"></div>
`;

const { Pomodoro } = require("./app");

describe("Pomodoro", () => {
  let pomodoro;

  beforeEach(() => {
    pomodoro = new Pomodoro(); // New instance
  });

  test("runPomodoro sets timer for 25 minutes interval", () => {
    const newEvent = {
      target: document.createElement("div"),
    };

    pomodoro.runPomodoro(newEvent);

    // Check if timer is running correctly
    expect(pomodoro.startTime).toBeGreaterThan(0);
    expect(pomodoro.intervalID).not.toBeNull();
    expect(pomodoro.timeoutID).not.toBeNull();
    expect(pomodoro.rounds).toBe(1);
  });
});
