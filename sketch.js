let s;
let food;
let cols;
let rows;
let buttons;
let score = 0;
let pause = false;
let gameOver = false;
let gameStarted = false;
let myFont;
let winWidth = 400;
let winHeight = 300;
let scl = 20;
let fps = 5;
let scoreSpan;

function preload() {
  scoreSpan = document.querySelector("#score");
  myFont = loadFont("PressStart2P.ttf");
}

function setup() {
  var myCanvas = createCanvas(winWidth, winHeight);
  myCanvas.parent("game-container");
  frameRate(fps);
  cols = floor(width / scl);
  rows = floor(height / scl);

  s = new Snake();
  food = new Food();
  food.pickFoodLocation();

  // Add event listeners for button clicks
  document.getElementById("down").addEventListener("click", function () {
    clickArrow(DOWN_ARROW);
  });
  document.getElementById("left").addEventListener("click", function () {
    clickArrow(LEFT_ARROW);
  });
  document.getElementById("right").addEventListener("click", function () {
    clickArrow(RIGHT_ARROW);
  });
  document.getElementById("play").addEventListener("click", function () {
    gameStarted = true;
    pause = false;
  });
  document.getElementById("pause").addEventListener("click", function () {
    pause = true;
  });
  document.getElementById("up").addEventListener("click", function () {
    clickArrow(UP_ARROW);
  });

  // Add keyboard event listeners
  document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      case 38: // Up arrow key
        clickArrow(UP_ARROW);
        break;
      case 40: // Down arrow key
        clickArrow(DOWN_ARROW);
        break;
      case 37: // Left arrow key
        clickArrow(LEFT_ARROW);
        break;
      case 39: // Right arrow key
        clickArrow(RIGHT_ARROW);
        break;
    }
  });
  buttons = selectAll(".button");
  buttons.forEach((button) => {
    button.style("background-color", "#e74c3c");
    button.style("border", "2px solid #c0392b");
    button.style("font-size", "16px");
    button.style("width", "30px");
    button.style("height", "30px");
    button.style("margin", "5px");
    button.style("color", "#fff");

    // Hover styles
    button.mouseOver(() => {
      button.style("background-color", "#d9534f");
    });

    // Clicked styles
    button.mousePressed(() => {
      button.style("background-color", "#c9302c");
    });

    // Reset styles after release
    button.mouseReleased(() => {
      button.style("background-color", "#e74c3c");
    });
  });

  // Style the game-boy-text
  let gameBoyText = select("#game-boy-text");
  gameBoyText.style("margin", "10px 140px");
  gameBoyText.style("font-family", "'Press Start 2P', cursive");
  gameBoyText.style("font-size", "25px");
  gameBoyText.style("color", "white");
  gameBoyText.style("background-color", "#000");
  gameBoyText.style("padding", "5px");
  gameBoyText.style("border-radius", "5px");

  // Hover styles for game-boy-text
  gameBoyText.mouseOver(() => {
    gameBoyText.style("background-color", "#333");
  });

  // Clicked styles for game-boy-text
  gameBoyText.mousePressed(() => {
    gameBoyText.style("background-color", "#555");
  });

  // Reset styles after release for game-boy-text
  gameBoyText.mouseReleased(() => {
    gameBoyText.style("background-color", "#000");
  });
}

function draw() {
  background(51);

  if (!gameStarted) {
    displayStartMessage();
    return; // Skip the rest of the draw function if the game hasn't started
  }

  if (!pause) {
    s.update();
  }
  s.show();
  if (s.death()) {
    gameOver = true;
    s.reset();
  }

  if (s.eat(food)) {
    food.pickFoodLocation();
  }

  fill(200, 0, 0);
  rect(food.x, food.y, scl, scl);
  textSize(32);
  scoreSpan.innerHTML = score;
  if (gameOver) {
    background(0);
    textSize(50);
    textAlign(CENTER);
    fill(255, 0, 0);
    textFont(myFont);
    text("Game Over", width / 2, height / 2);
    textSize(14);
    text("click Restart", width / 2, height / 2 + 50);
    noLoop();
  }
}

function displayStartMessage() {
  textSize(16);
  textAlign(CENTER);
  fill(255, 0, 0);
  textFont(myFont);
  text("Press Start to Play", width / 2, height / 2);
}

function clickArrow(keyClicked) {
  switch (keyClicked) {
    case UP_ARROW:
      if (!s.ySpeed) {
        s.dir(0, -1);
      }
      break;
    case DOWN_ARROW:
      if (!s.ySpeed) {
        s.dir(0, 1);
      }
      break;
    case RIGHT_ARROW:
      if (!s.xSpeed) {
        s.dir(1, 0);
      }
      break;
    case LEFT_ARROW:
      if (!s.xSpeed) {
        s.dir(-1, 0);
      }
      break;
  }
}

class Cell {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Food {
  x = 0;
  y = 0;

  pickFoodLocation() {
    this.x = scl * floor(random(cols));
    this.y = scl * floor(random(rows));
  }
}

class Snake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = (scl * cols) / 2;
    this.y = (scl * rows) / 2;

    this.xSpeed = 1;
    this.ySpeed = 0;

    this.total = 0;
    this.tail = [];
  }

  update() {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.total - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = new Cell(this.x, this.y);

    this.x = this.x + this.xSpeed * scl;
    this.y = this.y + this.ySpeed * scl;

    if (this.x === width || this.x < 0) {
      switch (this.xSpeed) {
        case 1:
          this.x = 0;
          break;
        case -1:
          this.x = width;
          break;
      }
    }

    if (this.y === height || this.y < 0) {
      switch (this.ySpeed) {
        case 1:
          this.y = 0;
          break;
        case -1:
          this.y = height;
          break;
      }
    }

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  show() {
    fill(255);
    rect(this.x, this.y, scl, scl);
    for (let i = 0; i < this.total; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
  }

  dir(xdir, ydir) {
    // Check if the new direction is opposite of the current direction
    if (
      (xdir === 1 && this.xSpeed === -1) ||
      (xdir === -1 && this.xSpeed === 1) ||
      (ydir === 1 && this.ySpeed === -1) ||
      (ydir === -1 && this.ySpeed === 1)
    ) {
      gameOver = true;
      console.log("Game Over - Opposite Direction");
      return;
    }
    this.xSpeed = xdir;
    this.ySpeed = ydir;
  }

  eat(eatfood) {
    let d = dist(this.x, this.y, eatfood.x, eatfood.y);
    if (d < 1) {
      this.total++;
      score += 10; // Increment the score by 10 points
    }
    return d < 1;
  }

  death() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) return true;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".button");
  var clickSound = new Audio("click.wav"); // Replace 'click.mp3' with your sound file

  buttons.forEach(function (button) {
    // Set the initial background color to purple
    button.style.backgroundColor = "purple";

    button.addEventListener("click", function () {
      // Reset the color for all buttons
      buttons.forEach(function (resetButton) {
        resetButton.style.backgroundColor = resetButton.classList.contains(
          "navigation-button"
        )
          ? "#3498db"
          : "purple";
      });

      // Change the color of the clicked button to green
      button.style.backgroundColor = button.classList.contains(
        "navigation-button"
      )
        ? "#5eff87"
        : "green";

      // Play the click sound
      clickSound.play();
    });
  });
});
