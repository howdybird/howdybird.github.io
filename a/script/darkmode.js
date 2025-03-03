var darkModeActive

function setOnLoad() {
    darkModeActive = localStorage.getItem("darkMode") == true ? true : false;
    applyDarkModeSetting();
}

function applyDarkModeSetting() {
    if (darkModeActive == true) {darkModeOn();} else {darkModeOff();}
    console.log("stored " + localStorage.getItem("darkMode"));
    console.log("current " + darkModeActive);
}

function toggleDarkMode() {
    darkModeActive = !darkModeActive;
    localStorage.setItem("darkMode", darkModeActive);
    applyDarkModeSetting();
}

function darkModeOn() {
    document.getElementsByTagName("body")[0].style = "background-blend-mode:overlay;"
    console.log("dkmdon");
}

function darkModeOff() {
    document.getElementsByTagName("body")[0].style = "background-blend-mode:normal;"
    console.log("dkmdoff");
}

window.onload = setOnLoad;