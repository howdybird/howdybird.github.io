function getPageCatalog(cFunction, incCategories = []) {
    if (typeof incCategories == "string") incCategories = [incCategories];

    var sortedPagesList = [];

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "pages-list.json");

    xhttp.onload = () => {
        let unsortedPagesList = getPagesInCategories(incCategories, JSON.parse(xhttp.response));
        sortedPagesList = sortPagesByDate(unsortedPagesList);

        cFunction(sortedPagesList);
    }

    xhttp.send(); 
}

function getPagesInCategories(subIncCategories, pageData) {
    let result = [];

    if (subIncCategories.length == 0) return pageData;

    for (let i = 0; i < pageData.length; i++) {
        for (let j = 0; j < subIncCategories.length; j++) {
            if (pageData[i].categories.includes(subIncCategories[j])) {result.push(pageData[i]); break;}
        }
    }

    return result;
}

function sortPagesByDate(pages) {
    let sortedPages = [pages[0]];
    
    for (let i = 1; i < pages.length; i++) {
        if (!("date" in pages[i])) sortedPages.splice(0, 0, pages[i]);
        else if ("date" in sortedPages[0] && pages[i].date.localeCompare(sortedPages[0].date) == -1) 
            sortedPages.unshift(pages[i]);
        else if (pages[i].date.localeCompare(sortedPages[sortedPages.length - 1].date) >= 0) sortedPages.push(pages[i]);
        else { 
            let j = 1;
            while (true) {
                if (!("date" in sortedPages[j]) || pages[i].date.localeCompare(sortedPages[j].date) >= 0) j++;
                else {
                    sortedPages.splice(j, 0, pages[i]); break;
                }
            }
        }
    }

    return sortedPages.reverse();
}

function pageCatalogToHtml(data) {
    let txt = "";

    for (i = 0; i < data.length; i++) {
        txt += `<a href=\"${data[i].address}\"><h2>` + data[i].title + "</h2></a>";
        if ("date" in data[i]) txt += data[i].date + "<br>";
        if ("blurb" in data[i]) txt += data[i].blurb + "<br>";
        txt += "<br>"
    }   

    return txt;
}