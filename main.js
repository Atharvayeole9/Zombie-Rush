let score = 0;
// board
let board;
let boardHeight = window.innerHeight;
let boardWidth = 1.840 * boardHeight;
let context;

// zombie
let zombieWidth = 30;
let zombieHeight = 70;
let zombieXright = [(boardWidth / 10), (boardWidth / 10) + 35, (boardWidth / 10) + 70, (boardWidth / 10) + 105];            // those which move towards right
let zombieXleft = [(9 * boardWidth / 10), (9 * boardWidth / 10) - 35, (9 * boardWidth / 10) + 70, (9 * boardWidth / 10) + 35]  // those which move towards left
let zombieY = boardHeight - 70;
let zombieSpeed = 6;
let lastPainttime = 0;

// aggresive zombie
let aggresivezombieWidth = 30;
let aggresivezombieHeight = 70;
let aggresivezombieXright = [(boardWidth / 3) - 70, (boardWidth / 3) + 70];
let aggresivezombieXleft = [(2 * boardWidth / 3) + 140, (2 * boardWidth / 3)]
let aggresivezombieY = [boardHeight - 170, boardHeight - 270];

// survivor
let survivorWidth = 50;
let survivorHeight = 200;
let survivorX = boardWidth/2 + 20;
let survivorY = boardHeight - 200;

//block
let blockWidth = 100;
let blockHeight = 100;
let blockX = [(boardWidth / 3), (boardWidth / 3) + 50, (2 * boardWidth / 3), (2 * boardWidth / 3) - 50, (boardWidth / 3) - 110, (2 * boardWidth / 3) + 110];
let blockY = [boardHeight - 100, boardHeight - 200, boardHeight - 100, boardHeight - 200, boardHeight - 100, boardHeight - 100];
let block = {
    x: blockX,
    y: blockY,
    height: blockHeight,
    width: blockWidth
}

//border of block
let borderWidth = 104;
let borderHeight = 104;
let borderX = blockX - 2;
let borderY = blockY - 2;
let border = {
    x: borderX,
    y: borderY,
    height: borderHeight,
    width: borderWidth
}

//moving aggresive zombie 
let turn = "right";
let movingaggresivezombieWidth = 30;
let movingaggresivezombieHeight = 70;
let movingaggresivezombieXright = (boardWidth / 3) + 120;
let movingaggresivezombieXleft = (2 * boardWidth / 3) - 120;
let movingaggresivezombieY = boardHeight - 70;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    console.log(window.innerHeight);
    console.log(boardHeight);
    console.log(boardWidth);
    console.log(board);
    context = board.getContext("2d"); // will be used for drawing on board

    // draw bird
    for (let i = 0; i <= 2; i++) {
        let zombie = {
            x: zombieXright[i],
            y: zombieY,
            height: zombieHeight,
            width: zombieWidth
        }
        context.fillStyle = "green";
        context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    }
    for (let i = 0; i <= 2; i++) {
        let zombie = {
            x: zombieXleft[i],
            y: zombieY,
            height: zombieHeight,
            width: zombieWidth
        }
        context.fillStyle = "green";
        context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    }

    // draw block 
    context.fillStyle = "red";
    for (let i = 0; i <= 5; i++) {
        block.x = blockX[i];
        block.y = blockY[i];
        context.fillRect(block.x, block.y, block.width, block.height);
    }

    // draw border
    context.strokeStyle = "white";
    context.strokeRect(border.x, border.y, border.width, border.height);

    // draw score
    const scorecard = document.getElementById("scorecard");
    console.log(scorecard);
    scorecard.style.color = "white";
    scorecard.innerHTML = score;

    window.requestAnimationFrame(main);
    // const wallpaper = new Image();
    // wallpaper.src= 'assets/zombiewallpaper.jpg';
    // const x = (board.width - wallpaper.width) / 2;
    // const y = (board.height - wallpaper.height) / 2;
    // context.drawImage(wallpaper, x, y);
}

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPainttime) / 1000 < 1 / zombieSpeed) {
        return;
    }
    lastPainttime = ctime;

    //clear whatever present on screen
    context.clearRect(0, 0, boardWidth, boardHeight);

    //draw Zombie Right
    for (let i = 0; i <= 3; i++) {
        //zombieXright[i] = zombieXright[i] + 30;
        let zombie = {
            x: zombieXright[i],
            y: zombieY,
            height: zombieHeight,
            width: zombieWidth
        }
        context.fillStyle = "green";
        context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    }
    for (let i = 0; i <= 3; i++) {
        //zombieXleft[i] = zombieXleft[i] - 30;
        let zombie = {
            x: zombieXleft[i],
            y: zombieY,
            height: zombieHeight,
            width: zombieWidth
        }
        context.fillStyle = "green";
        context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    }

    //draw aggresive Zombie right
    for (let i = 0; i <= 1; i++) {
        //console.log("yes");
        let aggresivezombie = {
            x: aggresivezombieXright[i],
            y: aggresivezombieY[i],
            height: aggresivezombieHeight,
            width: aggresivezombieWidth
        }
        context.fillStyle = "pink";
        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
        // console.log("yes1");
    }

    // draw aggresive Zombie left
    for (let i = 0; i <= 1; i++) {
        let aggresivezombie = {
            x: aggresivezombieXleft[i],
            y: aggresivezombieY[i],
            height: aggresivezombieHeight,
            width: aggresivezombieWidth
        }
        context.fillStyle = "pink";
        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
        // console.log("yes1");
    }

    // draw moving aggresive Zombie
    if (turn === "right") {
        movingaggresivezombieXright = movingaggresivezombieXright + 30;
        let aggresivezombie = {
            x: movingaggresivezombieXright,
            y: movingaggresivezombieY,
            height: movingaggresivezombieHeight,
            width: movingaggresivezombieWidth
        }
        context.fillStyle = "pink";
        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
    }
    else {
        movingaggresivezombieXleft = movingaggresivezombieXleft - 30;
        let aggresivezombie = {
            x: movingaggresivezombieXleft,
            y: movingaggresivezombieY,
            height: movingaggresivezombieHeight,
            width: movingaggresivezombieWidth
        }
        context.fillStyle = "pink";
        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
    }

    // update turn
    if (turn === "right" && movingaggresivezombieXright + 30 >= 2 * boardWidth / 3) {
        console.log("yes");
        turn = "left";
        movingaggresivezombieXright = (boardWidth / 3) + 120
    }
    else if (turn === "left" && movingaggresivezombieXleft - 30 <= boardWidth / 3) {
        console.log("yes1");
        turn = "right";
        movingaggresivezombieXleft = (2 * boardWidth / 3) - 120;
    }
    console.log(turn);

    // draw survivor
    let survivor = {
        x: survivorX,
        y: survivorY,
        height: survivorHeight,
        width: survivorWidth
    }
    context.fillStyle = "blue";
    context.fillRect(survivor.x, survivor.y, survivor.width, survivor.height);

    //draw score
    const scorecard = document.getElementById("scorecard");
    console.log(scorecard);
    scorecard.style.color = "white";
    scorecard.innerHTML = ++score;

    //draw Block
    context.fillStyle = "red";
    for (let i = 0; i <= 5; i++) {
        block.x = blockX[i];
        block.y = blockY[i];
        context.fillRect(block.x, block.y, block.width, block.height);
    }
    // draw border
    context.strokeStyle = "white";
    context.strokeRect(border.x, border.y, border.width, border.height);

    //losing condition
    if(((movingaggresivezombieXright + 30) >= (boardWidth/2 + 20)) &&  ((movingaggresivezombieXleft - 30 )<= (boardWidth/2 + 60)))
        {
            alert("you lost !!! Your score is " + score);
            confirm("do you want to restart");
        }
}