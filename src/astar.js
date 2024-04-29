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
            { x: 0, y: -1 },  // Up
            { x: 0, y: 1 },   // Down
            { x: -1, y: 0 },  // Left
            { x: 1, y: 0 },   // Right
            { x: -1, y: -1 }, // Up-left
            { x: -1, y: 1 },  // Down-left
            { x: 1, y: -1 },  // Up-right
            { x: 1, y: 1 },   // Down-right
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

            // Add the neighbor to the open list
            openList.push(neighborNode);
        }
    }

    // If no path is found, return null
    return null;
}

/*
const grid = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const start = [0, 0];
const end = [9, 9];
*/

function generateRandomGrid(rows, cols) {
    // Generate random start and end points
    const start = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    let end;
    do {
        end = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    } while (start[0] === end[0] && start[1] === end[1]); // Ensure start and end are different

    const grid = [];

    // Initialize grid with zeros
    for (let i = 0; i < rows; i++) {
        grid.push(Array(cols).fill(0));
    }

    // Set start and end points
    grid[start[0]][start[1]] = 1;
    grid[end[0]][end[1]] = 1;

    // Generate random obstacles
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 0 && Math.random() < 0.3) {
                grid[i][j] = 1;
            }
        }
    }

    return { grid, start, end };
}

// Generate random grid
const { grid, start, end } = generateRandomGrid(10, 10);

console.log("Start:", start);
console.log("End:", end);

let path = astar(grid, start, end);
console.log(path);
