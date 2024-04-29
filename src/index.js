var container = document.getElementById("grid");
for (var y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
        var div = document.createElement("div");
        div.classList.add("grid-item");
        div.id = y + "_" + x;
        container.appendChild(div);
    }
}
