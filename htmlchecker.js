"use strict";

$(window).on("load", documentLoaded);

function documentLoaded() {
    // load json-structure
    console.log("loaded");
    $.getJSON("structure.json", structureLoaded);
}

/* Naming:
    - structure: a tree of objects describing the correct structure
    - desc: a descriptor node in the structure tree

    - html: a parsed html DOM node tree
    - node: a node in the html tree
    - curNode: the current node while traversing the HTML tree
*/

let structure = "";

let html = null;
let curNode = null;


function structureLoaded( data ) {
    structure = data.structure;

    // Add parent-elements
    structure.forEach( desc => addParentTo(desc,null) );

    // TODO: Display required structure as li's...
    //       - make it possible to display checkmarks vs errors ...

    $("#submit").on("click", parseHTML);
}

function addParentTo(descriptor, parent) {
    descriptor.parent = parent;

    if( descriptor.children != undefined ) {
        descriptor.children.forEach( child => addParentTo(child,descriptor) );
    }
}


function parseHTML() {
    console.log("Parse away!");
    let str = $("#htmltext").val();
    html = $.parseHTML( str );

    // Start checking structure
    checkStructure();
}

function checkStructure() {
    // reset cur
    curNode = html[0];

    // check entire structure - one child at a time, deep-left
    structure.forEach( desc => checkSubStructure(desc) );

    console.log("DONE CHECKING!")
}

/* checks part of the tree, with the given desc as root.
   matches the current part of the HTML, expecting curNodes' parent as root.
   curNode is modified - can be expected to be a sibling of curNode. */
function checkSubStructure( rootDesc ) {

    let match = false;
    // compare rootDesc and curNode - nextSibling curNode until a match is found
    while( !match && curNode != null ) {
        // TODO: Test if last node is checked!
        if( compareTag( rootDesc, curNode) ) {
            console.log("Match between %o and %o", rootDesc, curNode );
            match = true;
        } else {
            curNode = curNode.nextElementSibling;
        }
    }

    if( !match ) {
        console.log("Never found match for %o", rootDesc);
        // TODO: MarkAsIncorrect

    } else {
        // TODO: Mark as correct
        // Correct!
        // if rootDesc has children, check those
        if( rootDesc.children != undefined ) {
            let lastNode = curNode;
            curNode = curNode.firstElementChild;
            rootDesc.children.forEach( desc => checkSubStructure(desc) );
            curNode = lastNode;
        }

        // finally, move curNode to the nextSibling
        curNode = curNode.nextElementSibling;
    }
}

function markAsIncorrect(description) {

}

function markAsCorrect(description) {
    // TODO: Mark tag as correct in output
}

function compareTag(desc, node) {
    let compares = false;

    // compare tagname
    if( node.nodeName.toLowerCase() == desc.tag.toLowerCase() ) {
        compares = true;

        // for now, everything is okay - but test id and tag
        if( desc.hasOwnProperty("id") && node.id != desc.id ) {
            compares = false;
        }

        if( desc.hasOwnProperty("class") && !node.classList.contains(desc.class) ) {
            compares = false;
        }
    }


    return compares;

}
