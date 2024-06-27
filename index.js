var grid = [];
var container = document.getElementById("grid");
for (var y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
        var div = document.createElement("div");
        div.classList.add("grid-item");
        div.id = y + "_" + x;
        container.appendChild(div);
    }
}

var gridItems = document.querySelectorAll('.grid-item');

let startY, startX, itemId, itemIdArray, endId
let value
let selectedPercentage = 20;


let toastBox = document.getElementById('toastBox');

function popup(errormsg) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = errormsg;
    toastBox.appendChild(toast);

    if (errormsg.includes('Error')) {
        toast.classList.add('error');
    }

    setTimeout(() => {
        toast.remove();
    }, 1500)
}

gridItems.forEach(function (item) {
    item.addEventListener('click', function () {

        if (item.classList.contains("wall")) {

            let errormsg = "    ❌ | Error: Cant place on a wall.";
            
            popup(errormsg);
            return;
        }
        var previousSpawn = document.querySelector('.spawn');
        var previousEnd = document.querySelector('.end');
        if (previousSpawn) {
            previousSpawn.classList.remove("spawn")
        }
        if (previousEnd) {
            previousEnd.classList.remove('end');
            previousEnd.classList.add("spawn")
        }
        item.classList.add("end");
        itemId = item.id;
        itemIdArray = itemId.split("_");

        let numberArray = [];

        length = itemIdArray.length;


        for (let i = 0; i < length; i++) {
            numberArray.push(parseInt(itemIdArray[i]));
        }

        let itemStartArray = [];

        itemStartArray.push(startY);
        itemStartArray.push(startX);

        let items = document.querySelectorAll('.grid-item');

        items.forEach(function (item) {
            if (item.classList.contains("neighbour")) {
                item.classList.remove("neighbour");
            }
        })

        let result = astar(grid, itemStartArray, numberArray);

        if (result) {
            visualizePath(result)
        } else {
            console.log("❌ | Error: Path not found.")

            let errormsg = "    ❌ | Error: Path not found.";

            popup(errormsg);
        }
        console.log(result);

        endId = item.id
        let endItemId = endId.split("_");
        let converEndId = [];
        let endItemLength = endItemId.length;
        for (let i = 0; i < endItemLength; i++) {
            converEndId.push(parseInt(endItemId[i]));
        }
        startY = converEndId[0];
        startX = converEndId[1];
    })
})



function addStart() {
    var currentStartCell = document.querySelector('.spawn');
    if (currentStartCell) {
        currentStartCell.classList.remove('spawn');
    }
    startY = Math.floor(Math.random() * 50);
    startX = Math.floor(Math.random() * 50);

    var newStartCell = document.getElementById(startY + "_" + startX);
    newStartCell.classList.add("spawn");
}

function renderGrid() {

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            var cell = document.getElementById(y + "_" + x);
            if (grid[y][x] === 1) {
                cell.classList.add("wall");
            } else {
                cell.classList.remove("wall");
            }
        }
    }
}

function genMap(percentage) {
    selectedPercentage = percentage;
    clearGrid();
    for (let i = 0; i < 50; i++) {
        const row = [];
        for (let j = 0; j < 50; j++) {
            let randNum = Math.random();
            if (randNum < selectedPercentage / 100) {
                value = 1;
            } else {
                value = 0;
            }
            row.push(value);
        }
        grid.push(row);
    }
    renderGrid();
}

genMap();
addStart()

document.getElementById("generateMapButton").addEventListener("click", function () {
    clearGrid();
    genMap(selectedPercentage);
    addStart()
});

function clearGrid() {
    deletePath()
    grid = [];
}

function visualizePath(path) {
    let items = document.querySelectorAll('.grid-item');

    items.forEach(function (item) {
        if (item.classList.contains("cc")) {
            item.classList.remove("cc");
        }
    })
    let delay = 0;
    for (const [x, y] of path) {
        setTimeout((xCoord, yCoord) => {
            const resultString = xCoord.toString() + "_" + yCoord.toString();
            document.getElementById(resultString).classList.add("neighbour");
        }, delay, x, y);
        delay += 50;
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

function heuristic(node, endNode) {
    return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
}

function astar(grid, start, end) {
    const openList = [];
    const closedList = new Map();

    const startNode = new Node(start[0], start[1]);
    const endNode = new Node(end[0], end[1]);
    openList.push(startNode);

    while (openList.length > 0) {
        openList.sort((nodeA, nodeB) => nodeA.f - nodeB.f);

        const currentNode = openList.shift();
        
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            let path = [];
            let current = currentNode;
            while (current !== null) {
                path.unshift([current.x, current.y]);
                current = current.parent;
            }
            return path;
        }

        const nodeKey = `${currentNode.x},${currentNode.y}`;

        closedList.set(nodeKey, currentNode);

        const neighbours = [
            { x: 0, y: -1 },  // Up
            { x: 0, y: 1 },   // Down
            { x: -1, y: 0 },  // Left
            { x: 1, y: 0 },   // Right
            { x: -1, y: -1 }, // Up-left
            { x: -1, y: 1 },  // Down-left
            { x: 1, y: -1 },  // Up-right
            { x: 1, y: 1 },   // Down-right
        ];

        for (const neighbour of neighbours) {
            const neighbourX = currentNode.x + neighbour.x;
            const neighbourY = currentNode.y + neighbour.y;

            if (neighbourX < 0 || neighbourY < 0 || neighbourX >= grid[0].length || neighbourY >= grid.length) {
                continue;
            }

            if (grid[currentNode.x][currentNode.y] === 1) {
                continue;
            }

            const neighborKey = `${neighbourX},${neighbourY}`;

            if (closedList.has(neighborKey)) {
                continue;
            }

            const tentativeGCost = currentNode.g + 1;

            const existingIndex = openList.findIndex(node => node.x === neighbourX && node.y === neighbourY);
            if (existingIndex !== -1) {
                if (tentativeGCost >= openList[existingIndex].g) {
                    continue;
                }
            }

            const neighborNode = new Node(neighbourX, neighbourY);


            neighborNode.parent = currentNode;
            neighborNode.g = tentativeGCost;
            neighborNode.h = heuristic(neighborNode, endNode);
            neighborNode.f = neighborNode.g + neighborNode.h;

            let cordy = neighborNode.y;
            let cordx = neighborNode.x;

            let finalCord = cordx.toString() + "_" + cordy.toString();

            document.getElementById(finalCord).classList.add("cc");

            openList.push(neighborNode);
        }
    }

    deletePath()

    return null;
}

function deletePath(){
    let items = document.querySelectorAll('.grid-item');

    items.forEach(function (item) {
        if (item.classList.contains("cc") || item.classList.contains("neighbour")) {
            item.classList.remove("cc");
            item.classList.remove("neighbour");
        }
    })
}
