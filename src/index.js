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
    
let startY, startX, itemId, itemIdArray
let value
let selectedPercentage = 0;

gridItems.forEach(function (item) {
    item.addEventListener('click', function () {

        if(item.classList.contains("wall")){
            alert("CANT PLACE ON A WALL")
            return;
        }
        var previousSpawn = document.querySelector('.spawn');
        var previousEnd = document.querySelector('.end');
        if(previousSpawn){
            previousSpawn.classList.remove("spawn")
        }
        if (previousEnd) {
            previousEnd.classList.remove('end');
            previousEnd.classList.add("spawn")
        }
        item.classList.add("end");
        itemId = item.id;
        itemIdArray = itemId.split("_");
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

document.getElementById("generateMapButton").addEventListener("click", function() {

    clearGrid();
    genMap(selectedPercentage);
    addStart()
});
    
function clearGrid() {
    grid = []; 
}

