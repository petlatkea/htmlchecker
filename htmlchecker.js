"use strict";

$(window).on("load", documentLoaded);

function documentLoaded() {
    // load json-structure
    console.log("loaded");
    $.getJSON("structure.json", structureLoaded);
}

let structure = "";

function structureLoaded( data ) {
    structure = data.structure;
    console.log(structure);

    // Add parent-elements
    addParentTo(structure,null);

    // TODO: Display required structure as li's...
    //       - make it possible to display checkmarks vs errors ...

    $("#submit").on("click", parseHTML);
}

function addParentTo(description, parent) {
    description.parent = parent;

    if( description.children != undefined ) {
        description.children.forEach( elm => addParentTo(elm,description));
    }
}

let structurePos = 0;
let structureElm = ""

let html = "";

function parseHTML() {
    console.log("Parse away!");
    let str = $("#htmltext").val();
    html = $.parseHTML( str );

    // Check outer structure

    /*
        header
            nav
        section#splash
        section#om
            h2
            .sectionwrapper
                .column
                .column
        section#eksempler
            h2
            .sectionwrapper
                .column
                    .column_content
                        .top
                        .bottom
    */

    // For each correct element - go into it, and check further

    structureElm = structure[0];

    // Find first match in html
    let match = -1;
    for( let i=0; i < html.length; i++) {
        if( html[i].nodeName.toLowerCase() == structureElm.tag.toLowerCase() ) {
            console.log("MATCH!");
            // ready to check
            match = i;
            break;
        }
    }

    if( match != -1 ) {

        checkStructureFrom( match );
    }
    else {
        console.log("No match found for start!");
    }
 /*
    html.forEach( (el,idx) => {

        // Go through all elements, until we hit a match for the first in the structure.
        if( el.nodeName.toLowerCase() == structureElm.tag.toLowerCase() ) {
            console.log("MATCH!");
            // ready to check
            checkStructureFrom( idx );
        }


//        console.log("Element: ", el.nodeName);
    });
    */
}

function checkStructureFrom( index ) {

    console.log("indx", index);
    let el = html[index];

    // check if el compares to structureElm
    if( compareTag(el, structureElm) ) {
        console.log("Match @" + index);
        markAsCorrect(structureElm);
    } else {
        markAsIncorrect(structureElm);
    }

    // Find next element
    if( structureElm.children != undefined ) {
        structureElm
    }

    console.log("El", el.nodeName);
    console.log("st", structureElm);
}

function markAsIncorrect(description) {

}

function markAsCorrect(description) {
    // TODO: Mark tag as correct in output
}

function compareTag(node, description) {
    let compares = false;

    // compare tagname
    if( node.nodeName.toLowerCase() == description.tag.toLowerCase() ) {
        compares = true;

        // for now, everything is okay - but test id and tag
        if( description.hasOwnProperty("id") &&
            !node.classList.contains(description.id) ) {
            compares = false;
        }

        if( description.hasOwnProperty("class") &&
            !node.classList.contains(description.class)) {
            compares = false;
        }
    }


    return compares;

}
