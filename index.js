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

gridItems.forEach(function (item) {
    item.addEventListener('click', function () {

        if (item.classList.contains("wall")) {
            alert("CANT PLACE ON A WALL")
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
    grid = [];
}

// Function to visualize the path
function visualizePath(path) {
    let items = document.querySelectorAll('.grid-item');

    items.forEach(function (item) {
        if (item.classList.contains("cc")) {
            item.classList.remove("cc");
        }
    })
    for (const [x, y] of path) {
        const resultString = x.toString() + "_" + y.toString(); // Reversed order of x and y
        document.getElementById(resultString).classList.add("neighbour");
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
    // Manhattan distance heuristic
    return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
}

function astar(grid, start, end) {
    // List of Nodes to be evaluated
    const openList = [];
    // Map of Nodes that already been evaluated
    const closedList = new Map();

    // Create Start Node and End Node
    const startNode = new Node(start[0], start[1]);
    const endNode = new Node(end[0], end[1]);
    // Push the Start Node to the OpenNodes
    openList.push(startNode);

    while (openList.length > 0) {
        // Sort the Array so that the Node with the lowest F cost is at the start
        openList.sort((nodeA, nodeB) => nodeA.f - nodeB.f);

        // Get the Current element by retrieving the Node with the lowest F cost
        const currentNode = openList.shift();

        // Check if the currentNode's coordinates match the end coordinates
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            let path = [];
            let current = currentNode;
            while (current !== null) {
                path.unshift([current.x, current.y]);
                current = current.parent;
            }
            return path;
        }

        // Generate a unique key for the current node
        const nodeKey = `${currentNode.x},${currentNode.y}`;

        // Add the current node to the closed list
        closedList.set(nodeKey, currentNode);

        const neighbours = [
            {x: 0, y: -1},  // Up
            {x: 0, y: 1},   // Down
            {x: -1, y: 0},  // Left
            {x: 1, y: 0},   // Right
            {x: -1, y: -1}, // Up-left
            {x: -1, y: 1},  // Down-left
            {x: 1, y: -1},  // Up-right
            {x: 1, y: 1},   // Down-right
        ];

        // Loop through each Neighbour of the currentNode
        for (const neighbour of neighbours) {
            const neighbourX = currentNode.x + neighbour.x;
            const neighbourY = currentNode.y + neighbour.y;

            // Check if the neighbor is within the grid bounds
            if (neighbourX < 0 || neighbourY < 0 || neighbourX >= grid[0].length || neighbourY >= grid.length) {
                continue;
            }

            // Check if the neighbor is an obstacle
            if (grid[neighbourY][neighbourX] === 1) {
                continue;
            }

            // Generate a unique key for the neighbor node
            const neighborKey = `${neighbourX},${neighbourY}`;

            // Check if the neighbor is already in the closed list
            if (closedList.has(neighborKey)) {
                continue;
            }

            // Calculate the tentative g cost for the neighbor
            const tentativeGCost = currentNode.g + 1;

            // Check if the neighbor is already in the open list
            const existingIndex = openList.findIndex(node => node.x === neighbourX && node.y === neighbourY);
            if (existingIndex !== -1) {
                // If this path is worse, skip
                if (tentativeGCost >= openList[existingIndex].g) {
                    continue;
                }
            }

            // Create a new Node for the neighbor
            const neighborNode = new Node(neighbourX, neighbourY);

            // This path is the best so far. Record it!
            neighborNode.parent = currentNode;
            neighborNode.g = tentativeGCost;
            neighborNode.h = heuristic(neighborNode, endNode);
            neighborNode.f = neighborNode.g + neighborNode.h;

            let cordy = neighborNode.y;
            let cordx = neighborNode.x;

            let finalCord = cordx.toString() + "_" + cordy.toString();

            document.getElementById(finalCord).classList.add("cc");
            // Add the neighbor to the open list
            openList.push(neighborNode);
        }
    }

    let items = document.querySelectorAll('.grid-item');

    items.forEach(function (item) {
        if (item.classList.contains("cc") || item.classList.contains("neighbour")) {
            item.classList.remove("cc");
            item.classList.remove("neighbour");
        }
    })

    // If no path is found, return null
    return null;
}
