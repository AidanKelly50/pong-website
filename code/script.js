
// Represents a Paddle that the player uses to hit the ball
class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 100;
        this.color = "white";
        this.moveFactor = 0;
    }
}

// Represents a Ball that is hit by players using paddles
class Ball {
    constructor() {
        this.size = 16;
        this.x = canvas.width / 2 - this.size / 2;
        this.y = canvas.height / 2 - this.size / 2;
        this.color = "white";
        this.moveX = 0;
        this.moveY = 0;
        this.speed = 7;
    }
}

var canvas = document.getElementById("canvas");
var leftPaddle = new Paddle(20, canvas.height / 2 - 50, 20);
var rightPaddle = new Paddle(770, canvas.height / 2 - 50, 20);
var ball = new Ball();
var context = canvas.getContext('2d');

var leftScore = 0;
var leftScoreText = document.getElementById("left-score");
var rightScore = 0;
var rightScoreText = document.getElementById("right-score");
var resetting = false;
var players = 0;

window.onload = ()=>{
    gameLoop();
}

// Runs the game on repeat
function gameLoop() {
    setInterval(show, 1000/60) // 60 fps
}

// Holds the steps of the game
function show(){
    update();
    draw();
}

// Changes values and updates the game 
function update() {
    //If single player, moves the CPU paddle
    if (players == 1) {
        if (leftPaddle.y + (leftPaddle.height / 2) >= ball.y + (ball.size / 2)) {
            leftPaddle.moveFactor = -1;
        } else if (leftPaddle.y + (leftPaddle.height / 2) <= ball.y + (ball.size / 2)) {
            leftPaddle.moveFactor = 1;
        }
    }
    
    // Move Left Paddle
    if (leftPaddle.y >= 5 && leftPaddle.moveFactor == -1) {
        leftPaddle.y += (leftPaddle.moveFactor * 7);
    } else if (leftPaddle.y <= 595 - leftPaddle.height && leftPaddle.moveFactor == 1) {
        leftPaddle.y += (leftPaddle.moveFactor * 7);
    }
  
    // Move Right Paddle
    if (rightPaddle.y >= 5 && rightPaddle.moveFactor == -1) {
        rightPaddle.y += (rightPaddle.moveFactor * 7);
    } else if (rightPaddle.y <= 595 - rightPaddle.height && rightPaddle.moveFactor == 1) {
        rightPaddle.y += (rightPaddle.moveFactor * 7);
    }
  
    // Ball Contact With Paddles
    // Contact with left Paddle
    if (ball.x <= 30 && ball.x >= 30 - ball.speed - 1) {
        if (ball.y >= leftPaddle.y - ball.size && ball.y <= leftPaddle.y + 25 - (ball.size / 2)) {
            ball.moveY = -0.75;
            ball.moveX = 1;
            ball.speed += 0.2;
        } else if (ball.y >= leftPaddle.y + 25 - (ball.size / 2) && ball.y <= leftPaddle.y + 50 - (ball.size / 2)) {
            ball.moveY = -0.5;
            ball.moveX = 1;
            ball.speed += 0.2;
        } else if (ball.y >= leftPaddle.y + 50 - (ball.size / 2) && ball.y <= leftPaddle.y + 75 - (ball.size / 2)) {
            ball.moveY = 0.5;
            ball.moveX = 1;
            ball.speed += 0.2;
        } else if (ball.y >= leftPaddle.y + 75 - (ball.size / 2) && ball.y <= leftPaddle.y + 100) {
            ball.moveY = 0.75;
            ball.moveX = 1;
            ball.speed += 0.2;
        }
        if (ball.speed >= 12) {
            ball.speed = 12
        }
        ball.speed = Math.round(ball.speed * 100) / 100;
    }

    // Contact with right Paddle
    if (ball.x >= 770 - ball.size && ball.x <= 770 - ball.size + ball.speed + 1) {
        if (ball.y >= rightPaddle.y - ball.size && ball.y <= rightPaddle.y + 25 - (ball.size / 2)) {
            ball.moveY = -0.75;
            ball.moveX = -1;
            ball.speed += 0.2;
        } else if (ball.y >= rightPaddle.y + 25 - (ball.size / 2) && ball.y <= rightPaddle.y + 50 - (ball.size / 2)) {
            ball.moveY = -0.5;
            ball.moveX = -1;
            ball.speed += 0.2;
        } else if (ball.y >= rightPaddle.y + 50 - (ball.size / 2) && ball.y <= rightPaddle.y + 75 - (ball.size / 2)) {
            ball.moveY = 0.5;
            ball.moveX = -1;
            ball.speed += 0.2;
        } else if (ball.y >= rightPaddle.y + 75 - (ball.size / 2) && ball.y <= rightPaddle.y + 100) {
            ball.moveY = 0.75;
            ball.moveX = -1;
            ball.speed += 0.2;
        }
        if (ball.speed >= 12) {
            ball.speed = 12
        }
        ball.speed = Math.round(ball.speed * 100) / 100;
    }
  
    //Ball Contact with top or bottom -> bounce off
    if (ball.y <= 0 || ball.y >= canvas.height - ball.size) {
        ball.moveY *= -1;
    }

    //Ball contact with sides -> end game
    if (ball.x <= 0 && ball.color != "red") {
        resetting = true;
        ball.x = 0;
        ball.moveX = 0;
        ball.moveY = 0;
        resetGame(true);
        ball.color = "red";
    } else if (ball.x >= canvas.width - ball.size && ball.color != "red") {
        resetting = true;
        ball.x = canvas.width - ball.size;
        ball.moveX = 0;
        ball.moveY = 0;
        resetGame(false);
        ball.color = "red";
    }

    //Move Ball
    ball.x += (ball.moveX * ball.speed);
    ball.y += (ball.moveY * ball.speed);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// After a player wins, resets the game to how it starts and changes the score
function resetGame(rightWin) {
    // Starting value for Ball speed
    ball.speed = 7;
  
    
    if (rightWin && ball.color == "white") {
        // Adds one to right score and makes the text green temporarily
        rightScore += 1;
        rightScoreText.innerHTML = rightScore.toString();
        rightScoreText.style.color = "#00FF00";
    } else if (!rightWin && ball.color == "white"){
        // Adds one to left score and makes the text green temporarily
        leftScore += 1;
        leftScoreText.innerHTML = leftScore.toString();
        leftScoreText.style.color = "#00FF00";
    }
    
    // Brings ball back to center and changes the score text color back to black
    setTimeout(()=> {
        ball.x = canvas.width / 2 - ball.size / 2;
        ball.y = canvas.height / 2 - ball.size / 2;
        ball.color = "white";

        leftPaddle.y = canvas.height / 2 - 50;
        rightPaddle.y = canvas.height / 2 - 50;

        rightScoreText.style.color = "Black";
        leftScoreText.style.color = "Black";
        resetting = false;
    }, 2000); // After 2 second delay
    
}

// Draws each frame of the game
function draw() {
    //Black Background
    createRect(0, 0, canvas.width, canvas.height, "black");

    if (players != 0) {
        // Paddles
        createRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "white");
        createRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "white");

        // Ball
        createRect(ball.x, ball.y, ball.size, ball.size, ball.color);
    } else {
        // Writes text in image
        context.font = "35px Monospace";
        context.fillStyle = "white";
        context.fillText("1 Player", 110, canvas.height / 2);
        createRect(canvas.width / 2 - 1, 0, 2, 600, "white");
        context.fillText("2 Players", 510, canvas.height / 2);
    }
    
}

// Draws a rectangle
function createRect(x, y, width, height, color) {
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

window.addEventListener("keydown", (event)=> {
    setTimeout(()=> {
        if (event.keyCode == 83 && players == 2) {
            // S pressed, move left Paddle up
            leftPaddle.moveFactor = -1;
        } else if (event.keyCode == 88 && players == 2) {
            // X pressed, move left Paddle down
            leftPaddle.moveFactor = 1;
        } else if (event.keyCode == 38 && players != 0) {
            // Up arrow pressed, move right Paddle up
            rightPaddle.moveFactor = -1;
        } else if (event.keyCode == 40 && players != 0) {
            // Down arrow pressed, move right Paddle down
            rightPaddle.moveFactor = 1;
        } else if (event.keyCode == 32 && ball.x == canvas.width / 2 - ball.size / 2 && ball.color != "red" && players != 0) {
            // Space bar pressed and ball is set at starting position
            while (ball.moveX == 0) {
                ball.moveX = Math.floor(Math.random() * 2.999) - 1;
            }
            ball.moveY = 0;
        }
    }, 1)
})

window.addEventListener("keyup", (event)=> {
    // Stops paddle movements on keyup
    setTimeout(()=> {
        if (event.keyCode == 83 && leftPaddle.moveFactor == -1) {
            leftPaddle.moveFactor = 0;
        } else if (event.keyCode == 88 && leftPaddle.moveFactor == 1) {
            leftPaddle.moveFactor = 0;
        } else if (event.keyCode == 38 && rightPaddle.moveFactor == -1) {
            rightPaddle.moveFactor = 0;
        } else if (event.keyCode == 40 && rightPaddle.moveFactor == 1) {
            rightPaddle.moveFactor = 0;
        }
    }, 1)
})

window.addEventListener("click", (event)=> {
    // Selects player number
    if (players == 0 && event.clientY >= window.innerHeight / 2 - 300 && event.clientY <= window.innerHeight / 2 + 300) {
        if (event.clientX <= window.innerWidth / 2 && event.clientX >= window.innerWidth / 2 - 400) {
            players = 1;
        } else if (event.clientX >= window.innerWidth / 2 && event.clientX <= window.innerWidth / 2 + 400) {
            players = 2;
        }
    }
});
