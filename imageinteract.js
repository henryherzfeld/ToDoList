//caching minified HTML of default list object for reproduction
var listObj = ' <div class="listObj mb-3 mx-1 media" id="1"> <img class="mb-1 p-1 align-self-start icon" src="assets/create.png"> <div class="media-body"> <button type="button" class="close align-self-start listCloseButton float-right mr-1 hide" tabcount="-1"> <p>&times;</p></button> <form> <div class="form-group"> <input type="text" class="form-control listText hide in" id="title" placeholder="Add item..."> <textarea class="form-control-sm w-75 listText mt-1 text-secondary hide in" id="details" rows="1" placeholder="Details..."></textarea> </div></form> </div></div>';

//defining callback object
var count = {In: 1, DOM: 1};

// "Unhiding" (CSS) list object child elements via initial list object click
function initialClick(count)
{
    $('#icon').eq(count.In).on("click", function()
        {
            $('#icon').eq(count.In).find('*').removeClass("hide in");
        }
    );
}

//Delete button of list object removes itself
function closeClick(count)
{
    $('button.listCloseButton').on(click(function()
        {
         $('div.listObj').eq(count.In).remove();
            return count--;
        }
    ));
}

// Creating a new card via add (plus) button click, also iterates count and calls update function for DOM
function newClick(count)
{
    $('#addButton').on("click", (function()
        {
            $(listObj).appendTo($('div.listObj').last().parent());
            newListDOM(count);
        }
    ));
}

//Handler for new list object's DOM events
function newListDOM(count)
{
    updateCount();
    if(count.In < count.DOM) //new list object test via internal count against DOM count
    {
        count.In++;
    }
}

//update DOM count of list objects
function updateCount(count)
{
    count.DOM = $('[id*="listObj"]').length;
}

//creating base list's DOM
function init(count)
{
    newListDOM(count);
    newClick(count);
}


document.on("ready", function(count)
    {
        init(count);


    }
);