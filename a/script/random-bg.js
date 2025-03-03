const no_of_pics = 50;

rand_bg();

function rand_bg() {
    var imgindex = Math.round(rngmod(str_to_seed(window.location.pathname + window.location.search)) * 50);
    if (imgindex < 1) {imgindex = 1;} else if (imgindex > no_of_pics) {imgindex = no_of_pics;}
    var imgindex_str = String(imgindex);
    document.getElementsByTagName("body")[0].style = `background-image:url("/a/resource/bg-image/highways/` + imgindex_str + `.jpg");`
}


function rngmod(seed) {
    return ((10000 * seed) % 1000) / 1000;
}

function str_to_seed(input) {
    var charlist = input.split("");
    var output = 10;
    var alternator = 0;
    for (i=0; i<charlist.length; i+=1) {
        var char = charlist[i];
        if (alternator == 0){ output *= char.charCodeAt(0); alternator = 1 }
        else { output /= char.charCodeAt(0); alternator = 0 }
    }
    return output;
}

function testFunc(inputfile, pretext) {
    console.log(pretext);
    console.log(inputfile);
}