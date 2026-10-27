let currentSes = "3x3";
let r3moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
let r2moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2"];
let skewbmoves = ["R", "R'", "L", "L'", "U", "U'", "B", "B'"];
let r4moves = ["R", "R'", "R2", "Rw", "Rw'", "Rw2", "L", "L'", "L2", "Lw", "Lw'", "Lw2", 
    "U", "U'", "U2", "Uw", "Uw'", "Uw2", "D", "D'", "D2", "Dw", "Dw'", "Dw2", 
    "F", "F'", "F2", "Fw", "Fw'", "Fw2", "B", "B'", "B2", "Bw", "Bw'", "Bw2"];

let scrambleList = [];
let scrambleCount = 0;
let currentScramble = "";

let timerRunning = false;
let spaceStop = false;
let timerInterval;
let time;
let elapsed;
let solveNumber;

let solveList = [];
let bestTime = Infinity;
let oldAo5 = Infinity;
let oldAo12 = Infinity;

let ao5Time;
let ao12Time;

function changeSession(session) {
    if (currentSes != session) {
        scrambleCount = 0;
        scrambleList = [];

        const tableBody = document.getElementById("tableBody");
        if (tableBody) {
            clearList();
        }

        const diffText = document.getElementById("difference");
        diffText.style.visibility = "hidden";

        document.getElementById("timerText").textContent = "00:00.00"; 

        bestTime = Infinity;
        oldAo5 = Infinity;
        oldAo12 = Infinity;
    }

    currentSes = session;

    document.getElementById("session_btn").textContent = session;

    let scramble = getScramble(session);
    document.getElementById("scramble").textContent = scramble;
    currentScramble = scramble;

    document.getElementById("mode_btn").textContent = 'Competition';
}

function newScramble() {
    if (scrambleList[scrambleCount + 1]) {
        currentScramble = scrambleList[scrambleCount + 1];
        document.getElementById("scramble").textContent = currentScramble;
        scrambleCount++;
        return;
    }

    let scramble = getScramble(currentSes);
    document.getElementById("scramble").textContent = scramble;
}

/**
 * @returns {string} scramble
 */
function getScramble(session) {
    let max;
    let min;
    let moves;

    if (session == "3x3") {
        max = 27;
        min = 21;
        moves = r3moves;
    } else if (session == "2x2") {
        max = 14;
        min = 9;
        moves = r2moves;
    } else if (session == "Skewb") {
        max = 12;
        min = 8;
        moves = skewbmoves;
    } else if (session == "4x4") {
        max = 46;
        min = 39;
        moves = r4moves;
    } else {
        return "Error";
    }

    let length = Math.floor(Math.random() * (max - min + 1) + min);

    let item = 0;
    let scramble = "";
    let lastStr = "";

    if (session == "2x2") {
        scramble = twoScramble(length);
    } else {
        for (let i = 0; i < length; i++) {
            item = Math.floor(Math.random() * moves.length);

            while (lastStr[0] == moves[item].charAt(0)) {
                item = Math.floor(Math.random() * moves.length);
            }

            scramble += moves[item] + "  ";
            lastStr = moves[item];
        }
    }

    scrambleList.push(scramble);
    scrambleCount = scrambleList.length - 1;

    currentScramble = scramble;

    return scramble.trimEnd();
}

function twoScramble(length) {
    let item = 0;
    let lastStr = "";
    let res = "";

    for (let i = 0; i < length; i++) {
        item = Math.floor(Math.random() * r2moves.length);

        while (lastStr[0] == r2moves[item].charAt(0) ||
            (lastStr == "R" && r2moves[item] == "L'") ||
            (lastStr == "R'" && r2moves[item] == "L") || 
            (lastStr == "R2" && r2moves[item] == "L2") || 

            (lastStr == "L" && r2moves[item] == "R'") || 
            (lastStr == "L'" && r2moves[item] == "R") || 
            (lastStr == "L2" && r2moves[item] == "R2") || 
        
            (lastStr == "U" && r2moves[item] == "D'") || 
            (lastStr == "U'" && r2moves[item] == "D") || 
            (lastStr == "U2" && r2moves[item] == "D2") || 

            (lastStr == "D" && r2moves[item] == "U'") || 
            (lastStr == "D'" && r2moves[item] == "U") || 
            (lastStr == "D2" && r2moves[item] == "U2") || 

            (lastStr == "F" && r2moves[item] == "B'") || 
            (lastStr == "F'" && r2moves[item] == "B") || 
            (lastStr == "F2" && r2moves[item] == "B2") || 
        
            (lastStr == "B" && r2moves[item] == "F'") || 
            (lastStr == "B'" && r2moves[item] == "F") || 
            (lastStr == "B2" && r2moves[item] == "F2")) {
            item = Math.floor(Math.random() * r2moves.length);
        } 

        res += r2moves[item] + "  ";
        lastStr = r2moves[item];
    }

    return res;
}

function lastScramble() {
    if (scrambleCount == 0) {
        return;
    }

    let scramble = scrambleList[scrambleCount - 1];
    document.getElementById("scramble").textContent = scramble.trimEnd();
    currentScramble = scramble;
    scrambleCount--;
}

function spaceChecker(event) {
    if (event.code == "Space" && event.type == "keydown" && !event.repeat) {
        if (spaceStop) {
            spaceStop = false;
            return;
        } 
        changeColor(event);
    } else if (event.code == "Space" && event.type == "keyup" && !event.repeat) {
        if (spaceStop) {
            spaceStop = false;
            return;
        }
        changeColor(event);
    }
}

function changeColor(event) {
    const timer = document.querySelector(".timerColor");

    if (event.code == "Space" && event.type == "keydown" && !event.repeat) {
        if (!timerRunning) {
            timer.style.color = "rgb(40, 216, 40)";
        }
    }

    if (event.code == "Space" && event.type == "keyup") {
        if (!timerRunning) {
            timer.style.color = "black";
            startTimer();
        }
    }
}

function startTimer() {
    timerRunning = true;
    let startTime = Date.now();

    timerInterval = setInterval(function() {

        elapsed = Date.now() - startTime;

        let centiseconds = Math.floor(elapsed / 10) % 100;
        let seconds = Math.floor(elapsed / 1000) % 60;
        let minutes = Math.floor(elapsed / 60000);

        let centiString = centiseconds.toString().padStart(2, "0");
        let secondString = seconds.toString().padStart(2, "0");
        let minuteString = minutes.toString().padStart(2, "0");
        
        time = minuteString + ":" + secondString + "." + centiString;
        document.getElementById("timerText").textContent = time;
        

        if (elapsed >= (59 * 6000) + (59 * 100) + 99) {
            endTimer();
            return;
        }
    }, 10);
}

function endTimer(event) {
    if (!timerRunning) {
        return;
    }

    clearInterval(timerInterval);
    document.getElementById("timerText").textContent = time;
    timerRunning = false;

    if (event.code == "Space") {
        spaceStop = true;
    }

    if (time.slice(0,2) == "00") {
        time = time.slice(3);
    }

    addTimeToList();
    newScramble();
}

function changeMode(mode) {
    newScramble();
    document.getElementById("mode_btn").textContent = mode;

    const tableBody = document.getElementById("tableBody");
    if (tableBody) {
        clearList();
    }

    const diffText = document.getElementById("difference");
    diffText.style.visibility = "hidden";

    document.getElementById("timerText").textContent = "00:00.00";

    scrambleCount = 0;
    scrambleList = [];

    bestTime = Infinity;
    oldAo5 = Infinity;
    oldAo12 = Infinity; 
}

function clearList() {
    const tableBody = document.getElementById("tableBody");
    tableBody.replaceChildren();

    solveList = [];    
}

function addTimeToList() {
    const tableBody = document.getElementById("tableBody");
    const row = document.createElement("tr");
    solveNumber = tableBody.children.length + 1;

    const numberCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const ao5Cell = document.createElement("td");
    const ao12Cell = document.createElement("td");

    numberCell.textContent = solveNumber;
    timeCell.textContent = time;
    ao5Cell.textContent = "-";
    ao12Cell.textContent = "-";

    if (elapsed < bestTime) {
        timeCell.style.color = "red";
        bestTime = elapsed;
    }

    solveList.push(elapsed);
    if (solveNumber >= 5) {
        ao5Calc(ao5Cell);
        ao5Res();
    }
    if (solveNumber >= 12) {
        ao12Calc(ao12Cell);
        ao12Res();
    }

    row.append(numberCell, timeCell, ao5Cell, ao12Cell);
    tableBody.prepend(row);

    if (solveList.length > 1) {
        difference();
    }
}

function ao5Calc(ao5Cell) {
    let bestSolve = Infinity;
    let worstSolve = -Infinity;
    for (let i = solveList.length - 5; i < solveList.length; i++) {
        if (solveList[i] < bestSolve) {
            bestSolve = solveList[i];
        }
        if (solveList[i] > worstSolve) {
            worstSolve = solveList[i];
        }
    }
    let calc = 0;
    for (let i = solveList.length - 5; i < solveList.length; i++) {
        if (solveList[i] == bestSolve || solveList[i] == worstSolve) {
            continue;
        }
        calc += solveList[i];
    }
    calc /= 3;

    let centiseconds = Math.floor(calc / 10) % 100;
    let seconds = Math.floor(calc / 1000) % 60;
    let minutes = Math.floor(calc / 60000);

    let centiString = centiseconds.toString().padStart(2, "0");
    let secondString = seconds.toString().padStart(2, "0");
    let minuteString = minutes.toString().padStart(2, "0");

    ao5Time = minuteString + ":" + secondString + "." + centiString;

    if (ao5Time.slice(0, 2) == "00") {
        ao5Time = ao5Time.slice(3);
    }

    ao5Cell.textContent = ao5Time;

    if (calc < oldAo5) {
        ao5Cell.style.color = "red";
        oldAo5 = calc;
    }
}

function ao12Calc(ao12Cell) {
    let bestSolve = Infinity;
    let worstSolve = -Infinity;
    for (let i = solveList.length - 12; i < solveList.length; i++) {
        if (solveList[i] < bestSolve) {
            bestSolve = solveList[i];
        }
        if (solveList[i] > worstSolve) {
            worstSolve = solveList[i];
        }
    }
    let calc = 0;
    for (let i = solveList.length - 12; i < solveList.length; i++) {
        if (solveList[i] == bestSolve || solveList[i] == worstSolve) {
            continue;
        }
        calc += solveList[i];
    }
    calc /= 10 ;

    let centiseconds = Math.floor(calc / 10) % 100;
    let seconds = Math.floor(calc / 1000) % 60;
    let minutes = Math.floor(calc / 60000);

    let centiString = centiseconds.toString().padStart(2, "0");
    let secondString = seconds.toString().padStart(2, "0");
    let minuteString = minutes.toString().padStart(2, "0");

    ao12Time = minuteString + ":" + secondString + "." + centiString;

    if (ao12Time.slice(0, 2) == "00") {
        ao12Time = ao12Time.slice(3);
    }

    ao12Cell.textContent = ao12Time;

    if (calc < oldAo12) {
        ao12Cell.style.color = "red";
        oldAo12 = calc;
    }
}

function difference() {
    const diffText = document.getElementById("difference");

    let previousSolve = Math.floor(solveList.at(-2) / 10);
    let newSolve = Math.floor(solveList.at(-1) / 10);
    let diff = previousSolve - newSolve;
    let isWorse = false;
    if (diff < 0) {
        isWorse = true;
    }
    diff = Math.abs(diff);

    let centiseconds = diff % 100;
    let seconds = Math.floor(diff / 1000) % 60;
    let minutes = Math.floor(diff / 60000);

    let centiString = centiseconds.toString().padStart(2, "0");
    let secondString = seconds.toString().padStart(2, "0");
    let minuteString = minutes.toString().padStart(2, "0");

    let diffString = minuteString + ":" + secondString + "." + centiString;

    if (diffString.slice(0, 2) == "00") {
        diffString = diffString.slice(3); 
    }

    if (isWorse == true) {
        diffText.textContent = "+" + diffString;
        diffText.style.color = "#FF7F7F";
    } else {
        diffText.textContent = "-" + diffString;
        diffText.style.color = "rgb(11,206,11)";
    }
    diffText.style.visibility = "visible";
}

function ao5Res() {
    const ao5 = document.getElementById("ao5Text");

    if (solveList.length >= 5) {
        ao5.textContent = "ao5: " + ao5Time;
        ao5.style.visibility = "visible";
    }
}

function ao12Res() {
    const ao12 = document.getElementById("ao12Text");

    if (solveList.length >= 12) {
        ao12.textContent = "ao12: " + ao12Time;
        ao12.style.visibility = "visible";
    }   
}

function scrambleStatistics() {
    
}

newScramble();

//event listeners for timer and timer color
document.addEventListener("keydown", spaceChecker);
document.addEventListener("keyup", spaceChecker);

document.addEventListener("keydown", endTimer);

