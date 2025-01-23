function getPageCatalog(cFunction, incCategories = [], noEntries = 0, hidelistEnabled = false) {
    /* cFunction: func called on load ; noEntries: # of entries to return (0 for all) ;
    incCategories: category or array of categories to include, set to "all" or empty array for all */

    if (typeof incCategories == "string") incCategories = [incCategories];
    if (incCategories.includes("all")) incCategories = [];

    var sortedPagesList = [];

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/pages-list.json");

    xhttp.onload = () => {
        let unsortedPagesList = getPagesInCategories(incCategories, JSON.parse(xhttp.response), hidelistEnabled);
        sortedPagesList = sortPagesByDate(unsortedPagesList);

        if (noEntries > 0) sortedPagesList = sortedPagesList.slice(0, noEntries);

        cFunction(sortedPagesList);
    }

    xhttp.send(); 
}

function getPagesInCategories(subIncCategories, pageData, hidelistEnabled = false) {
    let result = [];

    let includeAll = false;
    if (subIncCategories.length == 0) includeAll = true;

    for (let i = 0; i < pageData.length; i++) {
        if (pageData[i].hidelist && hidelistEnabled) {continue;}
        if (pageData[i].noindex) {continue;}
        if (includeAll) {result.push(pageData[i]); continue;}
        for (let j = 0; j < subIncCategories.length; j++) {
            if (pageData[i].categories.includes(subIncCategories[j])) {result.push(pageData[i]); break;}
        }
    }

    return result;
}

function sortPagesByDate(pages) {
    let sortedPages = [pages[0]];
    
    // for (let i = 1; i < pages.length; i++) {
    //     if (!("date" in pages[i])) //place undated item at index 0
    //         {sortedPages.unshift(pages[i]);}
    //     else if ("date" in sortedPages[0] && pages[i].date.localeCompare(sortedPages[0].date) == -1) //if 
    //         {sortedPages.unshift(pages[i]);}
    //     else if (pages[i].date.localeCompare(sortedPages[sortedPages.length - 1].date) >= 0) 
    //         {sortedPages.push(pages[i]);}
    //     else {
    //         let j = 1;
    //         while (true) {
    //             if (!("date" in sortedPages[j]) || pages[i].date.localeCompare(sortedPages[j].date) >= 0) j++;
    //             else {
    //                 sortedPages.splice(j, 0, pages[i]); break;
    //             }
    //         }
    //     }
    // }

    for (let i = 1; i < pages.length; i++) {
        let j = 0;
        while (true) {
            if (j == sortedPages.length) {
                sortedPages.splice(j, 0, pages[i]); break;
            }
            if (j < sortedPages.length && (
                !("date" in sortedPages[j]) || ("date" in pages[i] && pages[i].date.localeCompare(sortedPages[j].date) >= 0))) {
                j++;
            }
            else {
                sortedPages.splice(j, 0, pages[i]); break;
            }
        }
    }

    return sortedPages.reverse();
}

function pageCatalogToHtml(data = []) {
    let txt = "";
    
    for (i = 0; i < data.length; i++) {
        txt += `<h3><a href=\"${data[i].address}\">` + data[i].title + "</a></h3>";
        if ("date" in data[i]) txt += '<div class="link-date">' + data[i].date + "</div>";
        if ("blurb" in data[i]) txt += '<div class="link-blurb">' + data[i].blurb + "</div>";
        else {txt += "<br>";}
    }   

    return txt;
}