var query = window.location.search.slice(1);

function populateNavColWithList(divId, category){
    const xreq_pageIndex = xFileReq("/a/index/pages-mainlist.json");
    const xreq_navLinkList = xFileReq("/a/index/homepage-nav-links.json");

    xreq_pageIndex.onload = () => {
        //basically once the 1st file loads check if the second has already loaded; if so proceed, if not wait for onload
        const ifLinkListLoadedExecute = () => {
            const parsedList_pageIndex = JSON.parse(xreq_pageIndex.response); 
            const parsedList_navLinks = JSON.parse(xreq_navLinkList.response);

            const toDisplayList = parsedList_navLinks[category];

            var html = "";

            for (const linkItem in toDisplayList){
                var linkIndex = toDisplayList[linkItem];

                if (linkIndex.at(0) == "#") {
                    linkIndex = linkIndex.slice(1);
                    const linkAddress = "/tag/?" + linkIndex
                    html += `<h2><a href="` + linkAddress + `" class="nav-col-link taglink">` + linkIndex + `</a></h2>`;
                }
                else {
                    const linkTitle = parsedList_pageIndex[linkIndex]["title"];
                    const linkAddress = parsedList_pageIndex[linkIndex]["address"];
                    html += `<h2><a href="` + linkAddress + `" class="nav-col-link text-bg">` + linkTitle + `</a></h2>`;
                }
            }

            document.getElementById(divId).innerHTML = html;
        }

        if (xreq_navLinkList.readyState == XMLHttpRequest.DONE) {
            ifLinkListLoadedExecute();
        }
        else {
            xreq_navLinkList.onload = ifLinkListLoadedExecute;
        }
    }
}


function populatePageIndex(divId, sourceFilePath, tag="", flags=[]) {
    const xreq_pageList = xFileReq(sourceFilePath)

    xreq_pageList.onload = () => {
        const parsedList_pageList = JSON.parse(xreq_pageList.response)

        var toDisplayList = parsedList_pageList;
        if (tag != "") {toDisplayList = filterPageListByTag(toDisplayList, tag);}
        toDisplayList = filterSpecialTags(toDisplayList, flags);
        toDisplayList = sortPageListByDate(toDisplayList); //display pages list filtered and sorted

        var html = ""; //format html

        for (const item_i in toDisplayList) {
            const item = toDisplayList[item_i];

            var itemContentTags = [] //tags not beginning with "!"
            if ("tags" in item) {
                for (const tag_i in item.tags) {
                    if (item.tags[tag_i].at(0) != "!") {itemContentTags.push(item.tags[tag_i]);}
                }
            }

            html += `<div class="page-list-entry"><span class="text-bg page-list-hover-parent">`
            html += `<a href="` + item.address + `" class="page-list-entry-title page-list-hover-group">` + item.title + `</a><br>`
            if ("date" in item || itemContentTags != []) {
                html += `<span class="page-list-entry-info page-list-hover-group">`
                if ("date" in item) {html += `<span class="page-list-entry-info-date">` + item.date + `</span>`}
                if (itemContentTags != []) {
                    if ("date" in item && item.date != "") {html += `<span style="font-size:70%;">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>`;}
                    for (var i = 0; i < itemContentTags.length; i+=1) {
                        if (i != 0) {html += ", ";}
                        html += `<a href="/tag/?` + itemContentTags[i] + `" class="taglink">` + itemContentTags[i] + `</a>`;
                    }
                }
                html += `</span><br>`
            }
            if ("blurb" in item) {html += `<span class="page-list-entry-blurb page-list-hover-group">` + item.blurb + `</span>`;}
            html += `</div>`
        }

        document.getElementById(divId).innerHTML = html;
    }
}


function filterPageListByTag(pages, tag) {
    var newlist = []
    for (item in pages) {
        if ("tags" in pages[item] && pages[item].tags.includes(tag)) {
            newlist.push(pages[item]);
        }
    }
    return newlist;
}


function sortPageListByDate(pages) {
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

function filterSpecialTags(pages, flags) { //filter out hide-home etc from pagelist
    var newlist = []
    for (item in pages) {
        const itemtags = ("tags" in pages[item]) ? pages[item].tags : [];
        
        const filterConditions = (
            itemtags.includes("!no-index") ||
            ( itemtags.includes("!hide-home") && flags.includes("hide-home") )
        );
        
        if (!filterConditions) { //if no itemtags or all filter conditions false
            newlist.push(pages[item]);
        }
    }

    return newlist;
}