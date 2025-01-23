let splitPath = window.location.pathname.split("/");

if (splitPath[splitPath.length-1] == '') {
    splitPath.pop();
}

let parent = splitPath[splitPath.length - 2];

if (parent == '') {
    document.getElementById("back-buttons").innerHTML =
    `<u><h3><a href="/">⤊</a></h3></u>`;   
}
else {
    document.getElementById("back-buttons").innerHTML =
    `<u><h3><a href="/">⤊</a> <a href=".">⇑</a></h3></u>`;
}