function funcOnLoad(filePath, cFunction, ...args) {
    /* 
    fetches file from server, executes specified function on load with file as 1st argument
    cFunction: func called on load
    can incl arbitrary no of arguments after first 2, they will be passed as args to cFunction
    */

    var funcArgs = args;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", filePath);

    xhttp.onload = () => {
        var response = xhttp.response;
        funcArgs.unshift(response);
        cFunction.apply(this, funcArgs);
    }

    xhttp.send();
}

function xFileReq(filePath){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", filePath);
    xhttp.send();

    return xhttp;
}

function xFilesReq(...filePaths){
    var requests = [];

    for (const path in filePaths){
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", path);
        xhttp.send();

        requests.push(xhttp);
    }

    return requests;
}

// function funcOnMultipleLoad(...filePaths) {
//     const xhttp = new XMLHttpRequest();
//     xhttp.open("GET", filePath);

//     xhttp.onload = () => {
//         var response = xhttp.response;
//         funcArgs.unshift(response);
//         cFunction.apply(this, funcArgs);
//     }

//     xhttp.send();
// }