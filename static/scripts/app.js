/**
 * Application of Principles of Programming
 * @author Kristian Torres
 */

/**
 * ELEMENTS & EVENT HANDLERS
 */

// Thought of the day
const thoughtText = document.getElementById('thought');
const addThoughtBtn = document.getElementById('addThought');
const clearThoughtBtn = document.getElementById('clearThought');
const deleteThoughtBtn = document.getElementById('deleteThought');
const saveThoughtBtn = document.getElementById('saveThought');

// About
const homeHeader = document.getElementById('homeHeader');
const homeHeaderText = "Learn more and start today"

// Calculator 
const calcHeader = document.getElementById('calcHeader');
const calcHeaderText = "The one who runs sums"

const addAPIbtn = document.getElementById('btnAddAPI');
const subAPIbtn = document.getElementById('btnSubtractAPI');
const multiAPIbtn = document.getElementById('btnMultiplyAPI');
const diviAPIbtn = document.getElementById('btnDivideAPI');

// Journal
const journalHeader = document.getElementById('journalHeader');
const journalHeaderText = "What I've done"

const addEntryBtn = document.getElementById('btnAddEntry');
const deleteEntryBtn = document.getElementById('btnDeleteEntry');
const uploadJournalBtn = document.getElementById('btnUploadJournal');

// Load home page Event Listeners
if (!document.URL.includes("/thought-of-the-day")) {
    // Random Thought
    thoughtText.addEventListener('DOMContentLoaded', changeThought);

    // Calculator Event Listeners
    addAPIbtn.addEventListener('click', addNumbersAPI);
    subAPIbtn.addEventListener('click', subtractNumbersAPI);
    multiAPIbtn.addEventListener('click', multiplyNumbersAPI);
    diviAPIbtn.addEventListener('click', divideNumbersAPI);

    // Journal Event Listeners
    addEntryBtn.addEventListener('click', addEntry);
    deleteEntryBtn.addEventListener('click', deleteEntry);
    uploadJournalBtn.addEventListener('click', uploadJournal);

    // Loads data to be displayed
    changeThought()
    getJournalEntries()
    typingTextEffect()
    typingTextEffect1()
    typingTextEffect2()
}
else {
    //Thought of the Day Event Listeners
    addThoughtBtn.addEventListener('click', addNewThought)
    clearThoughtBtn.addEventListener('click', clearThought)
    deleteThoughtBtn.addEventListener('click', deleteThought)
    saveThoughtBtn.addEventListener('click', saveThoughts)

    // Loads data to be displayed
    getThoughtsEntries() 
}


/**
 * Page styling
 */

// Navigation
const nav = document.querySelector('.nav');

window.addEventListener('scroll', resizeNav);



/**
 * PAGE STYLING - FUNCTIONS
 */

/** clearInputs() 
 * 
 * This function takes in an array of HTML input elements and clears their values.
 * 
 * @param arrayOfElements       Array of input elements 
 */ 
function clearInputs(arrayOfElements) {
    arrayOfElements.forEach(element => {
        element.value = ""
    });
}

/** 
 * resizeNav()
 * 
 * This function dynamically resizes the size and appearance of the navigation bar
 * using CSS.
 */
function resizeNav() {
    if (window.scrollY > nav.offsetHeight + 10) {
        nav.classList.add('active');
    }
    else {
        nav.classList.remove('active');
    }
}

/**
 * Collection of functions:
 * typingTextEffect()
 * typingTextEffect1()
 * typingTextEffect2()
 * 
 * These functions reveals specified text on a letter by letter basis,
 * giving the effect of typing.
 */
var typingSpeed = 220

var TextIndex = 1
function typingTextEffect() {
    homeHeader.innerText = homeHeaderText.slice(0, TextIndex)
    TextIndex++
    if (TextIndex > homeHeaderText.length) {
        TextIndex = 1
    }
    setTimeout(typingTextEffect, typingSpeed) 
}

var TextIndex1 = 1
function typingTextEffect1() {
    calcHeader.innerText = calcHeaderText.slice(0, TextIndex1)
    TextIndex1++
    if (TextIndex1 > calcHeaderText.length) {
        TextIndex1 = 1
    }
    setTimeout(typingTextEffect1, typingSpeed) 
}

var TextIndex2 = 1
function typingTextEffect2() {
    journalHeader.innerText = journalHeaderText.slice(0, TextIndex2)
    TextIndex2++
    if (TextIndex2 > journalHeaderText.length) {
        TextIndex2 = 1
    }
    setTimeout(typingTextEffect2, typingSpeed) 
}



/** 
 * THOUGHT OF THE DAY - FUNCTIONS
*/

/**
 * changeThoughtAPI()
 * 
 * This function creates a HTTP GET request (using XMLHTTpRequest) 
 * to retrieve a random 'thought'.
 * The responseText property returns the response from the server as a string.
 * The response contains two objects, one for requested data and one for error messages.
 */
 function changeThought() {
    let url = "/api/get-thought";
    //  Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            thoughtText.innerHTML = response["result"];
        }
        if (this.readyState === 4 && this.status === 500) {
            let response = JSON.parse(this.responseText);
            alert(response["error"])
        }
    }
    // Specify and send HTTP request
    APIrequest.open("GET", url, true)
    APIrequest.send();
}


/**
 * getThoughtsEntries()
 * 
 * This function makes a HTTP GET request to the server for the 'Thoughts' data,
 * which will be displayed by lists elements (dynamically generated).
 */
function getThoughtsEntries() {
    let url = "/api/thought-of-the-day";
    //  Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Parse response and get 'Thoughts'
            let response = JSON.parse(this.responseText);
            let thoughts = response["result"];
            var thoughtEntries = document.getElementById('listThoughts')
            for (entry of thoughts) {
                let li = document.createElement("li")
                li.setAttribute('id', thoughts.indexOf(entry))
                li.setAttribute('content', String(entry.content))
                li.setAttribute('dateAdded', String(entry.dateAdded))
                li.appendChild(document.createTextNode(entry.content))
                thoughtEntries.appendChild(li)
            }
            // Add event listener to each list element
            thoughtEntries.addEventListener('click', (item) => {
                if (item.target.tagName === 'LI') {
                    displaySelectedThought(item.target.id)
                }
            })
            
        }
        if (this.readyState === 4 && this.status === 404) {
            response = JSON.parse(this.responseText);
            alert(response["error"])
        }
    }
    // Specify and send HTTP request
    APIrequest.open("GET", url, true);
    APIrequest.send();
}


/**
 * displaySelectedThought()
 * 
 * This function takes in an element and retrieves all the relevant information from the element.
 * The retrieved data is displayed within input boxes.
 * 
 * @param item          ID of selected list element
 */
function displaySelectedThought(item) {
    let selectedThought = document.getElementById(item)

    entryID = selectedThought.getAttribute('id')
    entryDate = selectedThought.getAttribute('dateAdded')
    entryContent = selectedThought.getAttribute('content')

    let displayID = document.getElementById('thoughtID')
    let displayDate = document.getElementById('thoughtDate')
    let displayThought = document.getElementById('thoughtEntry')

    displayID.value = entryID
    displayDate.value = entryDate
    displayThought.value = entryContent
}


/**
 * clearThought()
 * 
 * This function clears the text inputs from the Thought of the Day page.
 */
function clearThought() {
    let displayID = document.getElementById('thoughtID')
    let displayDate = document.getElementById('thoughtDate')
    let displayThought = document.getElementById('thoughtEntry')

    clearInputs([displayID, displayDate, displayThought])
}


/**
 * addNewThought()
 * 
 * This function adds new 'Thought' entries to the currently displayed entries,
 * by creating a new list element and appending it to the list.
 */
function addNewThought() {
    let thoughtEntry = document.getElementById('thoughtEntry')
    
    // Check if input values are empty
    if (thoughtEntry.value === "") {
        alert("Please fill in all input boxes")
        return
    }

    // Create new list element and display on the page
    var thoughtEntries = document.getElementById("listThoughts");
    let date = new Date().toLocaleDateString()
    let li = document.createElement("li")
    li.setAttribute('id', thoughtEntries.childNodes.length - 1)
    li.setAttribute('content', thoughtEntry.value)
    li.setAttribute('dateAdded', date)
    li.appendChild(document.createTextNode(thoughtEntry.value))
    thoughtEntries.appendChild(li)
    clearInputs([thoughtEntry])
}


/**
 * deleteThought()
 * 
 * This function retrieves the displayed data and 
 * uses the entry ID to remove the selected entry from the displayed entries.
 */
function deleteThought() {
    let thoughtID = document.getElementById('thoughtID')
    let thoughtEntry = document.getElementById('thoughtEntry')

    // Check if input is empty
    if (!thoughtID.value) {
        alert("Please select an entry to delete.")
        return
    }

    // Find matching list element and remove the list element
    var thoughtEntries = document.getElementById("listThoughts");
    thoughtEntries.childNodes.forEach(entry => {
        if (entry.tagName === 'LI') {
            if (entry.id === thoughtID.value) {
                thoughtEntries.removeChild(entry)
            }
        }
    })
    clearInputs([thoughtID, thoughtEntry])
}


/**
 * saveThoughts()
 * 
 * This function retrieves the currently displayed entries and reformats them into a JSON object.
 * The JSON object is then sent back to the server/API via HTTP PUT request (usinng XMLHttpRequest)
 * to be processed and stored.
 */
function saveThoughts() {
    let url = "/api/thought-of-the-day";
    let objectEntries = {"thoughts": []};
    // Get relevant stored values from each list element
    var journalEntries = document.getElementById("listThoughts").childNodes
    journalEntries.forEach(entry => {
        if (entry.tagName === 'LI') {
            console.log(entry)
            let newObject = {id: entry.id, 
                content: entry.getAttribute('content'), 
                dateAdded: entry.getAttribute('dateAdded')}
            objectEntries["thoughts"].push(newObject)
        }
    })
    // Store collection of values a JSON string
    let jsonData = JSON.stringify(objectEntries)

    //  Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Parse acknowledgement
            let response = JSON.parse(this.responseText);
            alert(response["result"])
            clearThought()
            location.reload()
        }
        if (this.readyState === 4 && this.status === 404) {
            // Parse error message
            let response = JSON.parse(this.responseText);
            alert(response["error"])
            location.reload()
        }
    }
    // Specify and send HTTP request
    APIrequest.open("PUT", url, true)
    APIrequest.send(jsonData)
}



/** 
 * CALCULATOR - FUNCTIONS
*/

/**
 * callAPI()
 *
 * This function uses the built-in (to the browser) XMLHttpRequest object to request data from a server
 * The responseText property returns the response from the server as a string.
 * The response contains two objects, 'result' for requested data and 'error' for error messages.
 *
 * @param url           Endpoint URL
 * @param elResponse    ID of the result field
 */
 function callAPI(url, elResponse) {
    // Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            document.getElementById(elResponse).value = response["result"];
        }
        if (this.readyState === 4 && this.status === 500) {
            let response = JSON.parse(this.responseText)
            alert(response["error"])
        }
    }
    // Specify and send HTTP request
    APIrequest.open("GET", url, true);
    APIrequest.send();
}


/**
 * addNumbers()
 * 
 * This function calculates the sum of two input values.
 * 
 * @returns sum         Sum of two input values
 */
function addNumbers(){
    let value1 = document.getElementById('add1').value;
    let value2 = document.getElementById('add2').value;
    let sum = 0;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Perform addition
        value1 = Number(value1);
        value2 = Number(value2);
        sum = value1 + value2;
    }
    catch (error) {
        alert(error)
    }
    finally {
        document.getElementById("inputAdd").value = String(sum)
    }
    
    return sum;
}

/**
 * addNumbersAPI()
 * 
 * This function takes user input (from the add section) 
 * and passes it to a function that handles API calls.
 * 
 */
function addNumbersAPI(){
    const resultEl = "inputAdd";
    let url = "/api/add";
    let value1 = document.getElementById('add1').value;
    let value2 = document.getElementById('add2').value;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Concatenate to URL
        url += `?val1=${value1}&val2=${value2}`
        callAPI(url, resultEl);
    }
    catch(error) {
        alert(error)
    }
}

/**
 * subtractNumbers()
 * 
 * This function calculates the difference between two input values.
 *
 * @returns difference      Difference of two input values
 */
function subtractNumbers(){
    let value1 = document.getElementById('sub1').value;
    let value2 = document.getElementById('sub2').value;
    let difference = 0;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Perform subtraction
        value1 = Number(value1);
        value2 = Number(value2);
        difference = value1 - value2;
    }
    catch (error) {
        alert(error)
    }
    finally {
        document.getElementById("inputSubtract").value = String(difference)
    }
   
    return difference;
}

/**
 * subtractNumbersAPI()
 * 
 * This function takes user input (from the subtract section) 
 * and passes it to a function that handles API calls.
 * 
 */
function subtractNumbersAPI(){
        const resultEl = "inputSubtract";
        let url = "/api/subtract";
        let value1 = document.getElementById('sub1').value;
        let value2 = document.getElementById('sub2').value;
        // Validate gathered inputs
        try {
            if (isNaN(value1) || isNaN(value2)) {
                throw "Please enter number inputs"
            }
            // Concatenate to URL
            url += `?val1=${value1}&val2=${value2}`
            callAPI(url, resultEl);
        }
        catch(error) {
            alert(error)
        }
}

/**
 * multiplyNumbers()
 * 
 * This function calculates the product of two input values.
 * 
 */
function multiplyNumbers(){
    let value1 = document.getElementById('multi1').value;
    let value2 = document.getElementById('multi2').value;
    let product = 0;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Perform multplication
        value1 = Number(value1);
        value2 = Number(value2);
        product = value1 * value2;
    }
    catch(error) {
        alert(error)
    }
    finally {
        document.getElementById("inputMultiply").value = String(product)
    }
}

/**
 * multiplyNumbersAPI()
 * 
 * This function takes user input (from the multiply section) 
 * and passes it to a function that handles API calls.
 * 
 */
function multiplyNumbersAPI(){
    const resultEl = "inputMultiply";
    let url = "/api/multiply";
    let value1 = document.getElementById('multi1').value;
    let value2 = document.getElementById('multi2').value;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Concatenate to URL
        url += `?val1=${value1}&val2=${value2}`
        callAPI(url, resultEl);
    }
    catch(error) {
        alert(error)
    }

}

/**
 * divideNumbers()
 * 
 * This function calculates the quotient of two input values.
 * 
 * @returns quotient        Quotient of two input values
 */
function divideNumbers(){
    let dividend = document.getElementById('divi1').value;
    let divisor = document.getElementById('divi2').value;
    let quotient = 0;
    console.log(dividend, divisor)
    // Validate gathered inputs
    try {
        console.log(isNaN(dividend), isNaN(divisor))
        if (isNaN(dividend) || isNaN(divisor)) {
            throw "Please enter number inputs"
        }
        // Perform division
        dividend = Number(dividend) 
        divisor = Number(divisor)
        if (divisor === 0 ) {
            throw "Divide by zero error"
        }
        quotient = dividend / divisor;
    }
    catch(error) {
        alert(error)
    }
    finally {
        document.getElementById("inputDivide").value = String(quotient);
    }
}

/**
 * divideNumbersAPI()
 * 
 * This function takes user input (from the divide section) 
 * and passes it to a function that handles API calls.
 * 
 */
function divideNumbersAPI(){
    const resultEl = "inputDivide";
    let url = "/api/divide";
    let value1 = document.getElementById('divi1').value;
    let value2 = document.getElementById('divi2').value;
    // Validate gathered inputs
    try {
        if (isNaN(value1) || isNaN(value2)) {
            throw "Please enter number inputs"
        }
        // Concatenate to URL
        url += `?val1=${value1}&val2=${value2}`
        callAPI(url, resultEl);
    }
    catch(error) {
        alert(error)
    }
}



/** 
 * JOURNAL - FUNCTIONS
*/
/**
 * getJournalEntries()
 *
 * This function creates a HTTP GET request (using XMLHTTpRequest),
 * for retrieving journal data from the server and displaying the values
 * on the frontend.
 */
function getJournalEntries() {
    let url = "/api/journal";
    //  Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Parse response and get journal entries
            let response = JSON.parse(this.responseText);
            let journal = JSON.parse(response.result);
            // Create a collection of list elements (one item = journal entry)
            var journalEntries = document.getElementById("listEntries");
            for (entry of journal.journals) {
                let li = document.createElement("li")
                li.setAttribute('id', journal.journals.indexOf(entry))
                li.setAttribute('date', String(entry.date))
                li.setAttribute('name', String(entry.name))
                li.setAttribute('notes', String(entry.note))
                li.appendChild(document.createTextNode(entry.name))
                journalEntries.appendChild(li)
            }
            // Add event listener to each list element
            journalEntries.addEventListener('click', (item) => {
                if (item.target.tagName === 'LI') {
                    populateEntry(item.target.id)
                }
            })
        }
        if (this.readyState === 4 && this.status === 404) {
            let response = JSON.parse(this.responseText);
            alert(response["error"])
        }
    }
    // Specify and send HTTP request
    APIrequest.open("GET", url, true);
    APIrequest.send();
}

/**
 * populateEntry(item)
 *
 * This function retrieves stored list elements and displays
 * its relevant attributes in input boxes.
 * 
 * @param item      ID of selected list element
 */
function populateEntry(item) {
    // Get stored relevant attributes from list element
    let selectedEntry = document.getElementById(item);
    let entryID = selectedEntry.getAttribute('id');
    let entryDate =  selectedEntry.getAttribute('date');
    let entryName = selectedEntry.getAttribute('name');
    let entryNotes =  selectedEntry.getAttribute('notes');
    // Retrieve display input boxes
    let displayEntryID = document.getElementById("idEntry");
    let displayEntryDate = document.getElementById("dateEntry");
    let displayEntryName = document.getElementById("namEntry");
    let displayEntryNotes = document.getElementById("txtNote");
    // Store values in input boxes to be displayed
    displayEntryID.value = entryID
    displayEntryDate.value = entryDate
    displayEntryName.value = entryName
    displayEntryNotes.value = entryNotes
}

/**
 * addEntry()
 *
 * This function retrievs input values under the 'Add Entry' section.
 * The values are assigned to the attributes of a new list element.
 * The new list element is appended to the 'Journal Entries'.
 */
function addEntry(){
    let entryID = document.getElementById("idAdd");
    let entryDate = document.getElementById("dateAdd");
    let entryName = document.getElementById("nameAdd");
    let entryNotes = document.getElementById("txtAdd");

    // Check if input values are empty
    let valueArray = [entryID.value, entryDate.value,
         entryName.value, entryNotes.value]
    if (valueArray.includes("")) {
        alert("Please fill in all input boxes")
        return
    }
    // Create new list element and display on the page
    var ul = document.getElementById("listEntries");
    let li = document.createElement("li")
    li.setAttribute('id', String(entryID.value))
    li.setAttribute('date', String(entryDate.value))
    li.setAttribute('name', String(entryName.value))
    li.setAttribute('notes', String(entryNotes.value))
    li.appendChild(document.createTextNode(entryName.value))
    ul.appendChild(li)
    clearInputs([entryID, entryDate, entryName, entryNotes])
}

/**
 * deleteEntry()
 *
 * This function retrieves the values of the selected list element and 
 * find the matching list element within 'Journal Entries'.
 * The matching list element is then removed from 'Journal Entries'.
 */
function deleteEntry() {
    let displayEntryID = document.getElementById("idEntry");
    let displayEntryDate = document.getElementById("dateEntry");
    let displayEntryName = document.getElementById("namEntry");
    let displayEntryNotes = document.getElementById("txtNote");
    // Check if input is empty
    if (!displayEntryID.value) {
        alert("Please select an entry to delete.")
        return
    }

    // Find matching list element and remove the list element
    var journalEntries = document.getElementById("listEntries");
    journalEntries.childNodes.forEach(entry => {
        if (entry.tagName === 'LI') {
            if (entry.id === displayEntryID.value) {
                journalEntries.removeChild(entry)
            }
        }
    })
    clearInputs([displayEntryID, displayEntryDate, displayEntryName, displayEntryNotes])
}

/**
 * uploadJournal()
 *
 * This function gathers data from each of list entry 
 * and stores it as an object
 * to be converted into a JSON string.
 */
function uploadJournal() {
    let url = "/api/journal";
    let objectEntries = {"journals": []};
    // Get relevant stored values from each list element (journal entry)
    var journalEntries = document.getElementById("listEntries").childNodes
    journalEntries.forEach(entry => {
        if (entry.tagName === 'LI') {
            console.log(entry)
            let newObject = {id: entry.id, 
                date: entry.getAttribute('date'), 
                name: entry.getAttribute('name'),
                notes: entry.getAttribute('notes')}
            objectEntries["journals"].push(newObject)
        }
    })
    // Store collection of values a JSON string
    let jsonData = JSON.stringify(objectEntries)

    //  Create HTTP request object
    let APIrequest = new XMLHttpRequest();
    // Handle API response
    APIrequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Parse acknowledgement
            let response = JSON.parse(this.responseText);
            alert(response["result"])
            location.reload()
        }
        if (this.readyState === 4 && this.status === 404) {
            // Parse error message
            let response = JSON.parse(this.responseText);
            alert(response["error"])
            location.reload()
        }
    }
    // Specify and send HTTP request
    APIrequest.open("PUT", url, true)
    APIrequest.send(jsonData)
}