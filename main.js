objHTML =' <div class="listObj mb-3 mx-1 media w-25 create"> <img class="mb-1 p-1 align-self-start icon" src="assets/todo.png"> <div class="media-body"> <button type="button" class="close align-self-start listCloseButton float-right mr-1 hide" tabindex="-1"> <p>&times;</p></button> <form> <div class="form-group"> <input type="text" class="form-control listText hide in" id="title" placeholder="Add item..."> <textarea class="form-control-sm w-75 listText mt-1 text-secondary hide in" id="details" rows="1" placeholder="Details..."></textarea> </div></form> </div></div>';

// list object constructor
var listObj =
    {
        position: 0,
        deleted: false,
        complete: false,
        name: "",
        details: "",
        get location() {return this.position},
        set setLocation(x) {this.position = x;},
        set moveUp(x) {this.position = this.location-x;}, //to be called when a card is deleted
        set storeName(x) {this.name = x;},
        set storeDetails(x) {this.details = x;}
    };

// index object constructor
var objIndex = {
    internalCount: 0,
    DOMCount: 0,
    get IN() {return this.internalCount;},
    get DOM() {return this.DOMCount;},
    set setIN(x) {this.internalCount = x;},
    set setDOM(x) {this.DOMCount = x;},
    get uneven() {return !Object.is(this.IN, this.DOM);}
};

// defining variables
var objArray = []; //indexes starting at ONE

// attaches click event to add obj, checks if is first object, and runs new object tasks
function newClick(index)
{
    $('#addButton').on("click", (function()
        {
            if(!index.DOM)
            {
                $('div #root').append(objHTML)
            }
            else
            {
                $('div.listObj').eq(index.DOM-1).parent().append(objHTML);  //append object HTML to last child

            }
            createObj(index);  //create logical object in objArray
            buildDOM(index, objArray);  //call buildDOM to add new click events to new HTML list object
            cacheObj(index, objArray)
        }
    ));
}

// attaches click event to icon reveal and close button, as well as logical changes
function cardClick(index, objArray)
{
    //we need to make some variables to keep things tidy
    var arrayLength = objArray.length-1;
    var clicked = false;
    var x;
    //check if our array contains any objects, if not, build listeners based upon current DOM tree
    if(arrayLength)
    {
        x = arrayLength;
    }
    else
    {
        x = index.DOM;
    }

    $('.icon').eq(objArray[x].location-1).on("click", function ()
        {
            if(!clicked)
            {
                $('div.form-group').eq(objArray[x].location-1).find('*').removeClass("hide in");
                $('.listObj').eq(objArray[x].location-1).toggleClass("w-25 todo create");
                clicked = true;
            }
            else
            {
                //switching card styles on icon click
                var currentList = $('.listObj').eq(objArray[x].location-1);
                if(currentList.hasClass("todo"))
                {
                    currentList.toggleClass("todo complete").children(":first").attr("src", "assets/done.png");
                }
                else
                {
                    currentList.toggleClass("todo complete").children(":first").attr("src", "assets/todo.png");
                }
                //store object name/details upon leaving
                $('text.listText').eq(objArray[x].location-1).on("blur", function ()
                {
                    objArray[x].storeName = $('text.listText').text();
                });

                $('textarea.listText').eq(objArray[x].location-1).on("blur", function ()
                {
                    objArray[x].storeDetails = $('text.listText').text();
                });
            }
        }
    );
    // attaches click event to remove obj
    $('button.listCloseButton').eq(objArray[x].location-1).on("click", (function()
        {
            $('div.listObj').eq(objArray[x].location-1).remove(); //delete list obj HTML
            index.setIN = index.IN-1;                           //dec internal count
            index.setDOM = $('div.listObj').length;             //dec DOM counter
            updateLocation(index, objArray, x);
        }
    ));
}

//Handler for list object's DOM events
function buildDOM(index, objArray)
{
    console.log("buildDOM called");

    index.setDOM = $('div.listObj').length;
    if (index.uneven) //new list object test via internal count against DOM count
    {
        cardClick(index, objArray);
        index.setIN = index.IN+1;
    }
}

//updateLocation loops and calls all lower-positioned obj and calls setter property to modify position (referenced by click listeners) of ea
function updateLocation(index, objArray, fromObj)
{
    for(var i = objArray[fromObj].location; i <= index.DOM+1; i++)
    {
        objArray[i].moveUp = 1;
    }
}

//runs through all objects, stringifies them using JSON, creates local test item, and stores number of items.
function cacheObj(index, objArray)
{
       var i = index.DOM;
    {
        localStorage.setItem(i.toString(), JSON.stringify(objArray[i]));
        localStorage.setItem('local', '1');
        localStorage.setItem('arrayLength', objArray.length);
        localStorage.setItem('internalCount', index.IN);
        localStorage.setItem('internalDOM', index.DOM);
    }
}

//checks for dummy item in local storage to test presence of previous storage
function checkLocal()
{
    if(localStorage.getItem('local'))
    {
        return true;
    }
}

//builds all locally stored data as well as pulls from local storage
function buildLocal(index, objArray)
{
    //getting object array length as well as index object's counts
    var arrayLength = localStorage.getItem("arrayLength");
    index.setIN = localStorage.getItem("internalCount");
    index.setDOM = localStorage.getItem("internalDOM");

    for(var i = 1; i < index.DOM; i++)
    {
        if(i=1)
        {
            $('div #root').append(objHTML)
        }
        else
        {
            $('div.listObj').eq(i-2).parent().append(objHTML);  //append object HTML to last child

        }
        objArray[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        buildDOM(index, objArray);
    }
}


//creates index object for initial start
function createIndex()
{
    index = Object.create(objIndex);
    index.setIN = 0;
    index.setDOM = 0;
}

//creates objects based upon internal array or if empty, DOM tree
function createObj(index)
{
    index.setDOM = $('div.listObj').length;
    var length = objArray.length;
    if(objArray.length)
    {
        objArray[length] = Object.create(listObj);
        objArray[length].setLocation = index.DOM;
    }
    else
    {
        objArray[index.DOM] = Object.create(listObj);
        objArray[index.DOM].setLocation = index.DOM;
    }
}

//main listener, allows all immediate functionality to occur
$(function()
    {
        createIndex();
        if(checkLocal())
        {
            buildLocal(index, objArray);
        }

        newClick(index, objArray);
    }
);