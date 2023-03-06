import {elemBuild} from "./elemBuild.js";
import {apiCall} from "./apiFunctions.js";
import * as drawLib from "./routineDrawLib.js";

const orgDataObj = await apiCall("./get-org-data", "org-placeholder");


// INITIAL PAGE LOAD
const orgRoutines = orgDataObj["routines"];
let currRoutineKey = 0;

const routineSelector = document.getElementById("select-routine");

function loadRoutinesIntoSelector () {
    for (let i=0; i<orgRoutines.length; i++) {

        let routineKey = orgRoutines[i]["key"];
        let routineName = orgRoutines[i]["name"];

        let routineOption = elemBuild("option", "routine-opt");
        routineOption.setAttribute("value", routineKey);
        routineOption.innerHTML = routineName;

        routineSelector.appendChild(routineOption);
    }

    // New Routine option
    let newRoutineOption = elemBuild("option", "new-routine-opt", "new-routine-opt");
    newRoutineOption.innerHTML = "New Routine";

    routineSelector.appendChild(newRoutineOption);

}

function loadLocationsIntoModal() {
    // Load organisation's locations into general panel
    let locations = orgDataObj["locations"];
    let locationSelector = document.getElementById("location");

    for (let i=0; i<locations.length; i++) {
        let keyVal = locations[i]["key"];
        let nameVal = locations[i]["name"];
        let locationOption = elemBuild("option");
        locationOption.setAttribute("data-keyval", keyVal);
        locationOption.setAttribute("value", keyVal);
        locationOption.innerHTML = nameVal;

        locationSelector.appendChild(locationOption);
    }
}

function loadResourcesIntoModal (resource) {
    // Load organisation's horses, people or inventory into their respective panels
    let resourceObj = orgDataObj[resource];
    let resourceTable = document.getElementById(`${resource}-table-body`);

    for (let i=0; i<resourceObj.length; i++) {
        let tdTagValue = ''
        let keyVal = resourceObj[i]["key"];
        let idVal = resourceObj[i]["id"];
        let nameVal = resourceObj[i]["name"];
        let tagArr = resourceObj[i]["tags"];

        let tr = elemBuild("tr", "resource-record");

        let th = elemBuild("th");
        th.setAttribute("scope", "row");

        let inputField = elemBuild("input", "form-check-input table-checkbox");
        inputField.setAttribute("data-keyval", keyVal);
        inputField.setAttribute("type", "checkbox");

        let tdID = elemBuild('td');
        tdID.setAttribute("value", idVal);
        tdID.innerHTML = idVal;

        let tdName = elemBuild('td');
        tdID.setAttribute("value", nameVal);
        tdName.innerHTML = nameVal;

        let tdTags = elemBuild('td');

        for (let j=0; j<tagArr.length; j++) {
            let tagKey = tagArr[j];
            let tagObj = orgDataObj["tags"].find(item => item.key === tagKey);
            if (tagObj) {
                let tagName = tagObj["name"]
                let tag = elemBuild("div", "border rounded col text-center tag");
                tag.setAttribute("value", tagKey);
                tag.innerHTML = tagName;
                tdTags.appendChild(tag);
                tdTagValue += (tagName + ' ')
            }
        }

        tdTags.setAttribute("value", tdTagValue)

        th.appendChild(inputField);
        tr.appendChild(th);
        tr.appendChild(tdID);
        tr.appendChild(tdName);
        tr.appendChild(tdTags);
        resourceTable.appendChild(tr);
    }
}


// ROUTINE SELECTOR

routineSelector.addEventListener("change",  () => {
    drawSelectedRoutine();
})

function drawSelectedRoutine() {
    drawLib.clearRoutineTable();
    currRoutineKey = routineSelector.options[routineSelector.selectedIndex].value;
    let routineData = orgRoutines.find(item => item.key === currRoutineKey);
    let routineTasks = routineData["tasks"];
    for (let i=0; i<routineTasks.length; i++) {
        let rT = routineTasks[i];
        drawLib.addTaskCell(
            rT["key"],
            rT["day"],
            rT["start"],
            rT["end"],
            rT["name"],
            rT["colour"]
        );
    }
    addButtonListeners();
}


// TASK BOARD

function addButtonListeners() {
    let taskButtons = document.querySelectorAll(".task-cell");

    taskButtons.forEach(function(btn) {
        btn.addEventListener("click", () => editRoutine(btn.value));
    })
}

function editRoutine (taskKey) {
    let currRoutineTasks = orgRoutines.find(item => item.key === currRoutineKey)["tasks"];
    let taskData = currRoutineTasks.find(item => item.key === taskKey);

    // Load name of task as header
    let name = taskData["name"];
    let modalTitle = document.getElementById("edit-task-title");
    modalTitle.innerHTML = `Edit "${name}"`;


    // # General: Load task values of each input
    for (const [objKey, objValue] of Object.entries(taskData)) {
        let inputElement = document.getElementById(objKey);
        if (inputElement) {
            inputElement.value = objValue;
            inputElement.setAttribute("data-value", objValue.toString());
        }
    }

    // # Horses, people and inventory panels
    let allResourceRecordsAssigned = taskData["herd"].concat(taskData["team"], taskData["equipment"]);
    let allTableCheckboxes = document.getElementsByClassName("table-checkbox");

    for (let i=0; i<allTableCheckboxes.length; i++) {
        allTableCheckboxes[i].checked = false;
    }

    for (let i=0; i<allResourceRecordsAssigned.length; i++) {
        let trResourceRecord = document.querySelectorAll(`[data-keyval="${allResourceRecordsAssigned[i]}"]`)[0];
        trResourceRecord.checked = true;
    }

}


// MODAL

function addSearchListeners() {
    let searchBars = document.querySelectorAll(".search");

    searchBars.forEach(function(searchBar) {
        searchBar.addEventListener("keyup", () => searchTable(searchBar.name));
    })
}

function searchTable(resource) {
    // Declare variables
    let input = document.getElementById(`${resource}-search`);
    let table = document.getElementById(`${resource}-table`);
    let searchType = document.getElementById(`${resource}-search-type`).value;

    let filter = input.value.toUpperCase();
    let tableRow = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tableRow.length; i++) {
        let tableData = tableRow[i].getElementsByTagName("td")[searchType];
        if (tableData) {
            let txtValue = tableData.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tableRow[i].style.display = "";
            } else {
                tableRow[i].style.display = "none";
            }
        }
    }
}


// RETRIEVE TASK VALUES FROM MODAL

let saveChangesBtn = document.getElementById("save-changes-btn")
saveChangesBtn.addEventListener("click", () => getInputtedData());

function getInputtedData() {
    let generalData = document.querySelectorAll("[data-value]");
    for (let i=0; i<(generalData.length); i++) {
        console.log()
        console.log(generalData[i].dataset.value);
    }

    let checkBoxData = document.querySelectorAll("[data-keyval]");
    for (let i=0; i<checkBoxData.length; i++) {
        if (checkBoxData[i].checked === true){
            console.log(checkBoxData[i].dataset.keyval)
        }
    }
}


// INIT

loadRoutinesIntoSelector();
loadLocationsIntoModal();
loadResourcesIntoModal("horses");
loadResourcesIntoModal("people");
loadResourcesIntoModal("inventory");
drawSelectedRoutine();
addSearchListeners();