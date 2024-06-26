let score = 0;
const gravity = 1.8;

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
let zombieX = zombieXright.concat(zombieXleft);
let zombiestatus = ["true", "true", "true", "true", "true", "true", "true", "true"];
let zombieY = boardHeight - 70;
let zombieSpeed = 6;
let lastPainttime = 0;
let lastPainttime2 = 0; //to ensure the aggresive zombies appear after a time 
let lastPainttime3 = 0;
let newzombiearrivingturn = "right";

// aggresive zombie
let aggresivezombieWidth = 30;
let aggresivezombieHeight = 70;
let aggresivezombieXright = [(boardWidth / 3) + 70, (boardWidth / 3) - 70, boardWidth / 10 + 140];
let aggresivezombieXleft = [(2 * boardWidth / 3), (2 * boardWidth / 3) + 140, 9 * boardWidth / 10 - 70];
let aggresivezombieX = aggresivezombieXright.concat(aggresivezombieXleft);
let aggresivezombieY = [boardHeight - 270, boardHeight - 170, boardHeight - 70];
let aggresivezombieY2 = aggresivezombieY.concat(aggresivezombieY);
let aggresivezombiestatus = ["false", "false", "false", "false", "false", "false"];
let right_i = 2;
let left_i = 2;

// survivor
let survivorWidth = 50;
let survivorHeight = 200;
let survivorX = boardWidth / 2 + 20;
let survivorY = boardHeight - 200;
let survivordowntime = 0;
let flag2 = 0;
let flag3 = 1;

// survivor gun 
let survivorgunWidth = 26;
let survivorgunHeight = 60;
let survivorgunX = survivorX + 12;
let survivorgunY = survivorY + 60;

// bullet of survivor gun
let velocityx = 0;
let velocityy = 0;
let angle = 0;
let currentX = 0;
let currentY = 0;
let operational_bullet = false;
let time = 0;
let bullet_hit_block = "false";
let bullet_hit_zombie = "false";
let bullet_hit_aggressivezombie = "false";

//block
let blockWidth = 100;
let blockHeight = 100;
let blockX = [(boardWidth / 3), (boardWidth / 3) - 110, (boardWidth / 3) + 50, (2 * boardWidth / 3), (2 * boardWidth / 3) + 110, (2 * boardWidth / 3) - 50];
let blockY = [boardHeight - 100, boardHeight - 100, boardHeight - 200, boardHeight - 100, boardHeight - 100, boardHeight - 200];
let blockstatus = ["true", "true", "true", "true", "true", "true"];
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
let movingaggresivezombiestatus = "false";

// dashboard
let dashboardstatus = "false";

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    console.log(window.innerHeight);
    console.log(boardHeight);
    console.log(boardWidth);
    console.log(board);
    context = board.getContext("2d"); // will be used for drawing on board
    context.strokeStyle = "white";
    context.strokeRect(0, 0, boardWidth, boardHeight);

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
        if (blockstatus[i] == "true") {
            block.x = blockX[i];
            block.y = blockY[i];
            context.fillRect(block.x, block.y, block.width, block.height);
        }
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
    context.lineWidth = 5;
    context.strokeStyle = "white";
    context.strokeRect(0, 0, boardWidth, boardHeight);

    // display of survivor up time
    survivoruptimeboxdisplay();

    //bringing aggresive zombies
    if ((ctime - lastPainttime2) / 1000 > 2) {
        //console.log(ctime);
        //console.log(lastPainttime2);
        if (newzombiearrivingturn === "right") {
            let flag = 0;
            for (let j = 0; j <= 3; j++) {
                if (zombiestatus[j] == "false") {
                    let zombie = {
                        x: zombieXright[j],
                        y: zombieY,
                        height: zombieHeight,
                        width: zombieWidth
                    }
                    context.fillStyle = "green";
                    context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
                    zombiestatus[j] = "true";
                    //console.log(zombiestatus);
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                for (let j = 2; j >= 0; j--) {
                    if (aggresivezombiestatus[j] == "false") {
                        let aggresivezombie = {
                            x: aggresivezombieXright[j],
                            y: aggresivezombieY2[j],
                            height: aggresivezombieHeight,
                            width: aggresivezombieWidth
                        }
                        context.fillStyle = "pink";
                        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        aggresivezombiestatus[j] = "true";
                        flag = 1;
                        break;
                    }
                }
            }
            // destroying the blocks
            if (flag == 0) {
                for (let j = 2; j >= 0; j--) {
                    if (blockstatus[j] == "true" && aggresivezombiestatus[j] == "true") {
                        context.clearRect(blockX[j], blockY[j], 100, 100);
                        blockstatus[j] = "false";
                        if (j != 0) {
                            context.clearRect(aggresivezombieXright[2 - j], aggresivezombieY[2 - j], 30, 70);
                            aggresivezombieY2[2 - j] = aggresivezombieY2[2 - j] + 100;
                            let aggresivezombie = {
                                x: aggresivezombieXright[2 - j],
                                y: aggresivezombieY2[2 - j],
                                height: aggresivezombieHeight,
                                width: aggresivezombieWidth
                            }
                            context.fillStyle = "pink";
                            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        }
                        else if (j == 0) {
                            aggresivezombieY2[0] = aggresivezombieY2[0] + 100;
                            let aggresivezombie = {
                                x: aggresivezombieXright[0],
                                y: aggresivezombieY2[0],
                                height: aggresivezombieHeight,
                                width: aggresivezombieWidth
                            }
                            context.fillStyle = "pink";
                            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        }
                        flag = 1;
                        break;
                    }
                }
            }
            newzombiearrivingturn = "left";
            lastPainttime2 = ctime;
        }
        else if (newzombiearrivingturn === "left") {
            let flag = 0;
            for (let j = 0; j <= 3; j++) {
                if (zombiestatus[j + 4] == "false") {
                    let zombie = {
                        x: zombieXleft[j],
                        y: zombieY,
                        height: zombieHeight,
                        width: zombieWidth
                    }
                    context.fillStyle = "green";
                    context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
                    zombiestatus[j + 4] = "true";
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                for (let j = 2; j >= 0; j--) {
                    if (aggresivezombiestatus[j + 3] == "false") {
                        let aggresivezombie = {
                            x: aggresivezombieXleft[j],
                            y: aggresivezombieY2[j + 3],
                            height: aggresivezombieHeight,
                            width: aggresivezombieWidth
                        }
                        context.fillStyle = "pink";
                        context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        aggresivezombiestatus[j + 3] = "true";
                        flag = 1;
                        break;
                    }
                }
            }
            // destroying the blocks
            if (flag == 0) {
                for (let j = 5; j >= 3; j--) {
                    if (blockstatus[j] == "true" && aggresivezombiestatus[j] == "true") {
                        context.clearRect(blockX[j], blockY[j], 100, 100);
                        blockstatus[j] = "false";
                        if (j != 3) {
                            context.clearRect(aggresivezombieXleft[5 - j], aggresivezombieY[5 - j], 30, 70);
                            aggresivezombieY2[8 - j] = aggresivezombieY2[8 - j] + 100;
                            let aggresivezombie = {
                                x: aggresivezombieXleft[5 - j],
                                y: aggresivezombieY2[8 - j],
                                height: aggresivezombieHeight,
                                width: aggresivezombieWidth
                            }
                            context.fillStyle = "pink";
                            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        }
                        else if (j == 3) {
                            aggresivezombieY2[3] = aggresivezombieY2[3] + 100;
                            let aggresivezombie = {
                                x: aggresivezombieXleft[0],
                                y: aggresivezombieY2[3],
                                height: aggresivezombieHeight,
                                width: aggresivezombieWidth
                            }
                            context.fillStyle = "pink";
                            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                        }
                        flag = 1;
                        break;
                    }
                }
            }

            //introducing the moving zombie
            if (flag == 0) {
                if (turn === "right" && movingaggresivezombiestatus == "false") {
                    movingaggresivezombiestatus = "true";
                    //movingaggresivezombieXright = movingaggresivezombieXright + 30;
                    let aggresivezombie = {
                        x: movingaggresivezombieXright,
                        y: movingaggresivezombieY,
                        height: movingaggresivezombieHeight,
                        width: movingaggresivezombieWidth
                    }
                    context.fillStyle = "pink";
                    context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                }
                else if (turn === "left" && movingaggresivezombiestatus == "false") {
                    movingaggresivezombiestatus = "true";
                    // movingaggresivezombieXleft = movingaggresivezombieXleft - 30;
                    let aggresivezombie = {
                        x: movingaggresivezombieXleft,
                        y: movingaggresivezombieY,
                        height: movingaggresivezombieHeight,
                        width: movingaggresivezombieWidth
                    }
                    context.fillStyle = "pink";
                    context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
                }
            }
            newzombiearrivingturn = "right";
            lastPainttime2 = ctime;
        }
        else {
            lastPainttime2 = ctime;
        }
    }

    //draw Zombie Right
    for (let i = 0; i <= 3; i++) {
        //zombieXright[i] = zombieXright[i] + 30;
        if (zombiestatus[i] == "true") {
            let zombie = {
                x: zombieXright[i],
                y: zombieY,
                height: zombieHeight,
                width: zombieWidth
            }
            context.fillStyle = "green";
            context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        }
    }

    //draw Zombie left
    for (let i = 0; i <= 3; i++) {
        //zombieXleft[i] = zombieXleft[i] - 30;
        if (zombiestatus[i + 4] == "true") {
            let zombie = {
                x: zombieXleft[i],
                y: zombieY,
                height: zombieHeight,
                width: zombieWidth
            }
            context.fillStyle = "green";
            context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        }
    }

    //draw aggresive Zombie right
    for (let i = 0; i <= 2; i++) {
        if (aggresivezombiestatus[i] == "true") {
            let aggresivezombie = {
                x: aggresivezombieXright[i],
                y: aggresivezombieY2[i],
                height: aggresivezombieHeight,
                width: aggresivezombieWidth
            }
            context.fillStyle = "pink";
            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
        }
    }

    // draw aggresive Zombie left
    for (let i = 0; i <= 2; i++) {
        if (aggresivezombiestatus[i + 3] == "true") {
            let aggresivezombie = {
                x: aggresivezombieXleft[i],
                y: aggresivezombieY2[i + 3],
                height: aggresivezombieHeight,
                width: aggresivezombieWidth
            }
            context.fillStyle = "pink";
            context.fillRect(aggresivezombie.x, aggresivezombie.y, aggresivezombie.width, aggresivezombie.height);
        }
    }

    // draw moving aggresive Zombie
    if (turn === "right" && movingaggresivezombiestatus == "true") {
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
    else if (turn === "left" && movingaggresivezombiestatus == "true") {
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
    if (turn === "right" && movingaggresivezombieXright + 30 >= 2 * boardWidth / 3 - 50) {
        //console.log("yes");
        turn = "left";
        movingaggresivezombieXright = (boardWidth / 3) + 120
    }
    else if (turn === "left" && movingaggresivezombieXleft - 30 <= boardWidth / 3 + 150) {
        //console.log("yes1");
        turn = "right";
        movingaggresivezombieXleft = (2 * boardWidth / 3) - 120;
    }
    //console.log(turn);

    // draw survivor
    let survivor = {
        x: survivorX,
        y: survivorY,
        height: survivorHeight,
        width: survivorWidth
    }
    context.fillStyle = "blue";
    context.fillRect(survivor.x, survivor.y, survivor.width, survivor.height);

    // draw survivor gun 
    // let survivorgun = {
    //     x: survivorgunX,
    //     y: survivorgunY,
    //     height: survivorgunHeight,
    //     width: survivorgunWidth
    // }
    // context.fillStyle = "grey";
    // context.fillRect(survivorgun.x, survivorgun.y, survivorgun.width, survivorgun.height);

    //draw score
    const scorecard = document.getElementById("scorecard");
    //console.log(scorecard);
    scorecard.style.color = "white";
    scorecard.innerHTML = ++score;

    //draw Block
    context.fillStyle = "red";
    for (let i = 0; i <= 5; i++) {
        if (blockstatus[i] == "true") {
            block.x = blockX[i];
            block.y = blockY[i];
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }
    // draw border
    context.strokeStyle = "white";
    context.strokeRect(border.x, border.y, border.width, border.height);

    //losing condition
    // if(((movingaggresivezombieXright + 30) >= (boardWidth/2 + 20)) &&  ((movingaggresivezombieXleft - 30 )<= (boardWidth/2 + 60)))
    //     {
    //         alert("you lost !!! Your score is " + score);
    //         confirm("do you want to restart");
    //     }

    // if (survivorY <= boardHeight - 207) {
    //     survivorY = survivorY + 7;
    //     survivorgunY = survivorY + 60;
    // }
    // else {
    //     survivorY = boardHeight - 200;
    //     survivorgunY = survivorY + 60;
    // }

    // projectile motion of bullet
    if (currentX >= 10 && currentX <= boardWidth - 10 && currentY >= 10 && currentY <= boardHeight - 10) {
        time++;
        bullet_hit_block = "false";
        bullet_hit_zombie = "false";
        bullet_hit_aggressivezombie = "false";

        currentX = currentX + velocityx;
        currentY = currentY - velocityy + gravity * (2 * time - 1) / 2; // s= [ut+(1/2)at^2] - [u(t-1)+(1/2)a(t-1)^2]

        // bullet hit block
        //bullethitblock();

        // bullet hit zombie
        bullethitzombie();
        bullethitaggressivezombie();
        bullethitmovingaggresivezombie();

        // draw bullet

        if (bullet_hit_block == "false" && bullet_hit_zombie == "false" && bullet_hit_aggressivezombie == "false") {
            drawbullet(currentX, currentY);
            bullet_hit_block = "false";
            bullet_hit_zombie = "false";
        }

    }
    else {
        operational_bullet = false;
        currentX = 0;
        currentY = 0;
        time = 0;
    }

    document.addEventListener("keydown", Movezombie);
    if (flag2 == 1) {
        //console.log("down1");
        lastPainttime3 = ctime;
        flag2 = 0;
    }
    //updating the survivor uptime display
    if (lastPainttime3 == 0) {
        context.fillStyle = "green";
        context.fillRect(survivorX - 35, boardHeight - 391, 120, 16);
    }
    else if ((ctime - lastPainttime3) / 1000 < 2) {
        context.fillStyle = "green";
        context.fillRect(survivorX - 35, boardHeight - 391, 120 - (120 * ((ctime - lastPainttime3) / 2000)), 16);
        context.fillStyle = "gold";
        context.fillRect((survivorX - 35) + 120 - (120 * ((ctime - lastPainttime3) / 2000)), boardHeight - 391, (120 * ((ctime - lastPainttime3) / 2000)), 16);
    }
    else if ((ctime - lastPainttime3) / 1000 < 6) {
        flag3 = 0;
        context.fillStyle = "gold";
        context.fillRect((survivorX - 35) + (120 * ((ctime - lastPainttime3 - 2000) / 4000)), boardHeight - 391, 120 - (120 * ((ctime - lastPainttime3 - 2000) / 4000)), 16);
        context.fillStyle = "green";
        context.fillRect(survivorX - 35, boardHeight - 391, 120 * ((ctime - lastPainttime3 - 2000) / 4000), 16);
    }
    else {
        flag3 = 1;
        context.fillStyle = "green";
        context.fillRect(survivorX - 35, boardHeight - 391, 120, 16);
    }

    // apply gravity for survivor
    if ((ctime - lastPainttime3) / 1000 > 2) {
        if (survivorY < boardHeight - 200) {
            // console.log(ctime);
            // console.log(lastPainttime3);
            // console.log("down");
            survivorY = survivorY + 75;
            survivorgunY = survivorgunY + 75;
            //lastPainttime3 = 0;
        }
    }

    document.addEventListener('mousemove', Survivorgun);

    //draw dashboard
    if (dashboardstatus == "true") {
        const dashboardX = boardWidth / 2 - 200;
        const dashboardY = boardHeight / 2 - 120;
        context.fillStyle = "grey";
        context.fillRect(boardWidth / 2 - 200, boardHeight / 2 - 120, 400, 240);
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.strokeRect(boardWidth / 2 - 200, boardHeight / 2 - 120, 400, 240);
        context.fillStyle = "green";
        context.fillRect(dashboardX + 70, dashboardY + 125, 100, 50);
        context.strokeRect(dashboardX + 70, dashboardY + 125, 100, 50);
        context.fillStyle = "red";
        context.fillRect(dashboardX + 230, dashboardY + 125, 100, 50);
        context.strokeRect(dashboardX + 230, dashboardY + 125, 100, 50);
        context.font = "30px Arial ";
        context.fillStyle = "purple";
        context.fillText("You lost! \n" + "Your score is : " + score + ".", dashboardX + 100, dashboardY + 70, 200);
        context.fillStyle = "black";
        context.font = "25px Arial";
        context.fillText("replay", dashboardX + 85, dashboardY + 155, 100);
        context.fillText("exit", dashboardX + 260, dashboardY + 155, 100);
        // events on clicking replay 
        // score=0;
        // time=0;
        // currentX=0;
        // currentY=0;
        // lastPainttime=lastPainttime2=lastPainttime3=0;
        document.addEventListener("click", (e) => {
            if (e.clientX >= dashboardX + 70 && e.clientX <= dashboardX + 170 && e.clientY <= dashboardY + 175 && e.clientY >= dashboardY + 125) {
                restorevariables();
                context.clearRect(0,0,boardWidth,boardHeight);
            }
        })

    }

    // losing condition
    if ((movingaggresivezombiestatus == "true" && turn == "left" && movingaggresivezombieXleft >= survivorX - 29 && movingaggresivezombieXleft <= survivorX + 49) || (movingaggresivezombiestatus == "true" && turn == "right" && movingaggresivezombieXright >= survivorX - 29 && movingaggresivezombieXright <= survivorX + 49)) {
        const dashboardX = boardWidth / 2 - 200;
        const dashboardY = boardHeight / 2 - 120;
        dashboardstatus = "true";
        context.fillStyle = "grey";
        context.fillRect(boardWidth / 2 - 200, boardHeight / 2 - 120, 400, 240);
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.strokeRect(boardWidth / 2 - 200, boardHeight / 2 - 120, 400, 240);
        context.fillStyle = "green";
        context.fillRect(dashboardX + 70, dashboardY + 125, 100, 50);
        context.strokeRect(dashboardX + 70, dashboardY + 125, 100, 50);
        context.fillStyle = "red";
        context.fillRect(dashboardX + 230, dashboardY + 125, 100, 50);
        context.strokeRect(dashboardX + 230, dashboardY + 125, 100, 50);
        context.font = "30px Arial ";
        context.fillStyle = "purple";
        context.fillText("You lost! \n" + "Your score is : " + score + ".", dashboardX + 100, dashboardY + 70, 200);
        context.fillStyle = "black";
        context.font = "25px Arial";
        context.fillText("replay", dashboardX + 85, dashboardY + 155, 100);
        context.fillText("exit", dashboardX + 260, dashboardY + 155, 100);
    }
}

function Movezombie(e) {
    if (e.code == "ArrowLeft") {
        if (survivorX - 50 >= (boardWidth / 3) + 150) {
            survivorX = survivorX - 50;
            survivorgunX = survivorX + 12;
            survivorgunY = survivorY + 60;
        }
        else if (survivorX - 50 >= (boardWidth / 3) + 100) {
            survivorX = (boardWidth / 3) + 150;
            survivorgunX = survivorX + 12;
            survivorgunY = survivorY + 60;
        }
    }
    else if (e.code == "ArrowRight") {
        if (survivorX + 50 <= (2 * boardWidth / 3) - 100) {
            survivorX = survivorX + 50;
            survivorgunX = survivorX + 12;
            survivorgunY = survivorY + 60;
        }
        else if (survivorX + 50 <= (2 * boardWidth / 3) - 50) {
            survivorX = (2 * boardWidth / 3) - 100;
            survivorgunX = survivorX + 12;
            survivorgunY = survivorY + 60;
        }
    }
    else if (e.code == "ArrowUp" && survivorY == boardHeight - 200 && flag3 == 1) {
        console.log("down1");
        survivorY = survivorY - 75;
        survivorgunX = survivorX + 12;
        survivorgunY = survivorY + 60;
        flag2 = 1;
    }
}

function Survivorgun(e) {
    const hingeX = survivorgunX + 13;
    const hingeY = survivorgunY;
    // console.log(hingeX);
    // console.log(hingeY);

    const finalX = e.clientX;
    const finalY = e.clientY;

    angle = Math.atan2(finalX - hingeX, finalY - hingeY);
    //console.log(angle*180/Math.PI);

    context.save();
    context.translate(hingeX, hingeY);
    context.rotate(-angle);

    // const gradient= context.createLineargradient(0,0,50,200);
    // gradient.addcolourstop(0,"grey");
    // gradient.addcolourstop(1,"black");
    // i tried of creating a gradient in gun but the whole started moving anywhere 

    context.fillStyle = "grey";
    context.fillRect(-13, 0, survivorgunWidth, survivorgunHeight);

    document.addEventListener("click", shoot);

    context.restore();
}

function shoot(e) {
    const startX = (survivorgunX + 13) + (60 + 20) * Math.cos(angle - (Math.PI / 2));
    const startY = (survivorgunY) + (60 + 20) * Math.sin(angle + (Math.PI / 2));

    currentX = startX;
    currentY = startY;

    drawbullet(currentX, currentY);
    operational_bullet = true;
    time = 0;

    velocityx = 25 * Math.cos(angle - (Math.PI / 2));
    velocityy = 25 * Math.sin(-angle - (Math.PI / 2));
    console.log(velocityy);
}

function drawbullet(currentX, currentY) {
    context.beginPath();            //used to specify new path if you are drawing many paths
    context.arc(currentX, currentY, 20, 0, 2 * Math.PI, false);
    context.fillStyle = "grey";
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
}

function revertblockstatus(i) {
    blockstatus[i] = "false";
}

function revertzombiestatus(i) {
    zombiestatus[i] = "false";
}

// function bullethitblock() {
//     if (currentX >= boardWidth / 3 && currentX <= boardWidth / 3 + 100 && currentY <= boardHeight && currentY >= boardHeight - 100 && blockstatus[0] == "true") {
//         
//         bullet_hit_block = "true";
//     }
//     else if (currentX >= boardWidth / 3 + 50 && currentX <= boardWidth / 3 + 150 && currentY <= boardHeight - 100 && currentY >= boardHeight - 200 && blockstatus[1] == "true") {
//         
//         operational_bullet = false;
//         currentX = 0;
//         currentY = 0;
//         time = 0;
//         bullet_hit_block = "true";
//     }
//     else if (currentX >= 2 * boardWidth / 3 && currentX <= 2 * boardWidth / 3 + 100 && currentY <= boardHeight && currentY >= boardHeight - 100 && blockstatus[2] == "true") {
//         context.clearRect(2 * boardWidth / 3, boardHeight - 100, 100, 100);
//         revertblockstatus(2);
//         operational_bullet = false;
//         currentX = 0;
//         currentY = 0;
//         time = 0;
//         bullet_hit_block = "true";
//     }
//     else if (currentX >= 2 * boardWidth / 3 - 50 && currentX <= 2 * boardWidth / 3 + 50 && currentY <= boardHeight - 100 && currentY >= boardHeight - 200 && blockstatus[3] == "true") {
//         context.clearRect(2 * boardWidth / 3 - 50, boardHeight - 200, 100, 100);
//         revertblockstatus(3);
//         operational_bullet = false;
//         currentX = 0;
//         currentY = 0;
//         time = 0;
//         bullet_hit_block = "true";
//     }
//     else if (currentX >= boardWidth / 3 - 110 && currentX <= boardWidth / 3 - 10 && currentY <= boardHeight && currentY >= boardHeight - 100 && blockstatus[4] == "true") {
//         context.clearRect(boardWidth / 3 - 110, boardHeight - 100, 100, 100);
//         revertblockstatus(4);
//         operational_bullet = false;
//         currentX = 0;
//         currentY = 0;
//         time = 0;
//         bullet_hit_block = "true";
//     }
//     else if (currentX >= 2 * boardWidth / 3 + 110 && currentX <= 2 * boardWidth / 3 + 210 && currentY <= boardHeight && currentY >= boardHeight - 100 && blockstatus[5] == "true") {
//         context.clearRect(2 * boardWidth / 3 + 110, boardHeight - 100, 100, 100);
//         revertblockstatus(5);
//         operational_bullet = false;
//         currentX = 0;
//         currentY = 0;
//         time = 0;
//         bullet_hit_block = "true";
//     }
// }

function bullethitzombie() {
    for (let j = 0; j <= 7; j++) {
        if (currentX >= zombieX[j] && currentX <= zombieX[j] + 30 && currentY >= zombieY && currentY <= boardHeight && zombiestatus[j] == "true") {
            context.clearRect(zombieX[j], zombieY[j], zombieWidth, zombieHeight);
            zombiestatus[j] = "false";
            bullet_hit_zombie = "true";
            operational_bullet = false;
            currentX = 0;
            currentY = 0;
            time = 0;
        }
    }
}

function bullethitaggressivezombie() {
    for (let j = 0; j <= 5; j++) {
        if (currentX >= aggresivezombieX[j] && currentX <= aggresivezombieX[j] + 30 && currentY >= aggresivezombieY2[j] && currentY <= aggresivezombieY2[j] + aggresivezombieHeight && aggresivezombiestatus[j] == "true") {
            console.log("yes");
            context.clearRect(aggresivezombieX[j], aggresivezombieY2[j], aggresivezombieWidth, aggresivezombieHeight);
            aggresivezombiestatus[j] = "false";
            bullet_hit_aggressivezombie = "true";
            operational_bullet = false;
            currentX = 0;
            currentY = 0;
            time = 0;
        }
    }
}

function bullethitmovingaggresivezombie() {
    if (turn == "right" && movingaggresivezombiestatus == "true" && currentX >= movingaggresivezombieXright && currentX <= movingaggresivezombieXright + 30 && currentY >= movingaggresivezombieY && currentY <= movingaggresivezombieY + movingaggresivezombieHeight) {
        context.clearRect(movingaggresivezombieXright, movingaggresivezombieY, movingaggresivezombieWidth, movingaggresivezombieHeight);
        movingaggresivezombiestatus = "false";
        currentX = 0;
        currentY = 0;
        time = 0;
    }
    else if (turn == "left" && movingaggresivezombiestatus == "true" && currentX >= movingaggresivezombieXleft && currentX <= movingaggresivezombieXleft + 30 && currentY >= movingaggresivezombieY && currentY <= movingaggresivezombieY + movingaggresivezombieHeight) {
        context.clearRect(movingaggresivezombieXleft, movingaggresivezombieY, movingaggresivezombieWidth, movingaggresivezombieHeight);
        movingaggresivezombiestatus = "false";
        currentX = 0;
        currentY = 0;
        time = 0;
    }
}

function survivoruptimeboxdisplay() {
    context.lineWidth = 7;
    context.strokeStyle = "grey";
    context.strokeRect(survivorX - 35, boardHeight - 391, 120, 16);
    // context.fillStyle = "green";
    // context.fillRect(survivorX-35,boardHeight-391,120,16)
}

function restorevariables(){
    dashboardstatus = "false";
    lastPainttime = 0
    lastPainttime2 = 0; //to ensure the aggresive zombies appear after a time 
    lastPainttime3 = 0;
    newzombiearrivingturn = "right";
    zombiestatus = ["true", "true", "true", "true", "true", "true", "true", "true"];
    aggresivezombieY = [boardHeight - 270, boardHeight - 170, boardHeight - 70];
    aggresivezombiestatus = ["false", "false", "false", "false", "false", "false"];
    survivorX = boardWidth / 2 + 20;
    survivorY = boardHeight - 200;
    survivordowntime = 0;
    flag2 = 0;
    flag3 = 1;
    survivorgunX = survivorX + 12;
    survivorgunY = survivorY + 60;
    velocityx = 0;
    velocityy = 0;
    angle = 0;
    currentX = 0;
    currentY = 0;
    operational_bullet = false;
    time = 0;
    bullet_hit_block = "false";
    bullet_hit_zombie = "false";
    bullet_hit_aggressivezombie = "false";
    blockstatus = ["true", "true", "true", "true", "true", "true"];
    movingaggresivezombieXright = (boardWidth / 3) + 120;
    movingaggresivezombieXleft = (2 * boardWidth / 3) - 120;
    movingaggresivezombiestatus = "false";
}

//buttons(pause play)
//scorecard
//buttons in dashboard

