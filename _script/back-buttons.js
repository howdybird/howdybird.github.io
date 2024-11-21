let splitPath = window.location.pathname.split("/");
let parent = splitPath[splitPath.length - 2];
if (parent == "") {
    document.getElementById("back-buttons").innerHTML =
    `<u><h3><a href="/">⤊</a></h3></u>`;   
}
else {
    document.getElementById("back-buttons").innerHTML =
    `<u><h3><a href="/">⤊</a> <a href=".">⇑</a></h3></u>`;
}