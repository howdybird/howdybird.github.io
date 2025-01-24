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

function pageCatalogToHtml(data = [], printCategories = false) {
    let txt = "";
    
    for (i = 0; i < data.length; i++) {
        txt += `<h3><a href=\"${data[i].address}\">` + data[i].title + "</a></h3>";
        let infolinetxt = "";
        if ("categories" in data[i] && typeof data[i].categories == "string") {data[i].categories = [data[i].categories]}
        if (printCategories && "categories" in data[i] && data[i].categories.length > 0) {
            let link_cat_txt = "";
            link_cat_txt += "<em>";
            for (let j = 0; j < data[i].categories.length; j++) {
                if (j > 0) {link_cat_txt += ", ";}
                link_cat_txt += data[i].categories[j]
            }
            link_cat_txt += "</em>";
            infolinetxt += '<div class="link-infoline">' + link_cat_txt;
        }
        if ("date" in data[i] && !("hidedate" in data[i] && data[i].hidedate == true)) {
            if (infolinetxt == "") {infolinetxt += '<div class="link-infoline">'}
            else {infolinetxt += ' <span style="font-size:70%;">&bull;</span> '}
            infolinetxt += data[i].date;
        }
        if (infolinetxt != "") {infolinetxt += '</div>'; txt += infolinetxt;}
        if ("blurb" in data[i]) {txt += '<div class="link-blurb">' + data[i].blurb + "</div>";}
        else {txt += "<br>";}
    }   

    return txt;
}