var form = document.getElementById('addForm');
var itemList = document.getElementById('itemList');
var removeButtons = document.getElementsByClassName('remove-btn');
var editButtons = document.getElementsByClassName('edit-btn');

// Get local stored data
var storedItemsText = localStorage.getItem('items-text');
var storedItemsState = localStorage.getItem('items-state');
var storedTexts = [];
var storedStates = [];
if (storedItemsText) {
    storedTexts = JSON.parse(storedItemsText);
}
if (storedItemsState) {
    storedStates = JSON.parse(storedItemsState);
}
// Show on items list
for (var i = 0; i < storedTexts.length; ++i) {
    createItem(storedTexts[i], storedStates[i]);
}


/*===== LISTENING TO ALL EVENTS =====*/

// Form submit event 
form.addEventListener('submit', addItem);
// Item click event
itemList.addEventListener('click', check);
// Remove event
for (var btn of removeButtons) {
    btn.addEventListener('click', removeItem);
}
// Edit event
for (var btn of editButtons) {
    btn.addEventListener('click', editItem);
}


/*===== CREATING ALL PARTS FOR AN ITEM IN LIST =====*/

function createItem(text, checked) {
    // Create new item in list
    var li = document.createElement('li');
    li.className = "item-li";

    // Create span store to-do text
    var span = document.createElement('span');
    span.className = "title-li";
    span.innerHTML = text;
    // console.log(span);
    li.appendChild(span);

    // Create edit button
    var editBtn = document.createElement('button');
    editBtn.className = "edit-btn";
    editBtn.appendChild(document.createTextNode('Edit'));
    li.appendChild(editBtn);

    // Create remove button
    var removeBtn = document.createElement('button');
    removeBtn.className = "remove-btn";
    removeBtn.appendChild(document.createTextNode('Remove'));
    li.appendChild(removeBtn);

    if (checked) {
        editBtn.disabled = true;
        span.innerHTML = "<del>" + text + "</del>";
        li.style.background = "#eee";
    }
    // Add item to list
    itemList.appendChild(li);
}


/*===== CHANGING THINGS WHEN ITEM CHECK DONE OR UNCHECK =====*/

function check(e) {
    e.preventDefault();

    if (e.target && e.target.nodeName == "LI") {
        var li = e.target;

        // Update to items-state in localStorage
        var id = [].indexOf.call(li.parentElement.children, li);
        storedStates[id] = !storedStates[id];
        localStorage.setItem('items-state', JSON.stringify(storedStates));

        // Change style in html
        var editBtn = li.getElementsByClassName('edit-btn')[0];
        var rmvBtn = li.getElementsByClassName('remove-btn')[0];
        var span = li.getElementsByTagName('span')[0];
        if (storedStates[id]) {
            editBtn.disabled = true;
            span.innerHTML = "<del>" + span.textContent + "</del>";
            li.style.background = "#ededed";
            editBtn.style.background = "#ededed";
            editBtn.style.borderColor = "#ededed";
            rmvBtn.style.background = "#ededed";
            rmvBtn.style.borderColor = "#ededed";
        }
        else {
            editBtn.disabled = false;
            span.innerHTML = span.children[0].textContent;
            li.style.background = "#fcfcfc";
            editBtn.style.background = "#fcfcfc";
            rmvBtn.style.background = "#fcfcfc";
        }
    }
}


/*===== ADDING ITEM TO LIST WHEN SUBMIT ADDFORM =====*/

function addItem(e) {
    e.preventDefault();

    // Get input value
    var text = document.getElementById('newItem').value;

    // Check empty input
    if (text === '') {
        alert("You must write something!");
        return;
    }
    // Create item
    createItem(text, false);

    // Remove event listener for new item
    removeButtons[removeButtons.length - 1].addEventListener('click', removeItem);

    // Edit event listener for new item
    editButtons[editButtons.length - 1].addEventListener('click', editItem);

    // Store item to local storage
    storedTexts.push(text);
    localStorage.setItem('items-text', JSON.stringify(storedTexts));
    storedStates.push(false);
    localStorage.setItem('items-state', JSON.stringify(storedStates));

    form.reset();
}


/*===== REMOVING AN ITEM FORM TODO-LIST =====*/

function removeItem(e) {
    e.preventDefault();

    // Aler confirmation
    
    var li = e.target.parentElement;

    // Remove from localStorage
    var id = [].indexOf.call(li.parentElement.children, li);
    storedTexts.splice(id, 1);
    localStorage.setItem('items-text', JSON.stringify(storedTexts));
    storedStates.splice(id, 1);
    localStorage.setItem('items-state', JSON.stringify(storedStates));

    // Remove from list in html
    itemList.removeChild(li);
    
}


/*===== EDITING AN ITEM IN TODO-LIST =====*/

function editItem(e) {
    e.preventDefault();

    // Get necessary elements
    var li = e.target.parentElement;
    var span = li.getElementsByTagName('span')[0];
    var text = span.textContent;

    // Replace text content with input form
    span.innerHTML = '<input class="form-control" type="text" value="' + text + '"/>';

    // Change text value and replace input form with normal text content
    var input = span.children[0];
    input.focus();
    input.select();
    input.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            let newText = input.value;
            span.textContent = newText;

            // Change in localStorage
            var id = [].indexOf.call(li.parentElement.children, li);
            storedTexts[id] = newText;
            localStorage.setItem('items-text', JSON.stringify(storedTexts));
        }
    });
}