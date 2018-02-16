"use strict";

$("#submit").on("click", parseHTML);

function parseHTML() {
    console.log("Parse away!");
    let str = $("#htmltext").val();
    let html = $.parseHTML( str );

    // Check outer structure

    // For each correct element - go into it, and check further

    // TODO: Have defined structure as JSON - use that to check against

    html.forEach( el => {
        console.log("Element: ", el.nodeName);
    })
}
