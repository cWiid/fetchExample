import {elemBuild} from "./elemBuild.js";
import {apiCall} from "./apiFunctions.js";
import * as drawLib from "./routineDrawLib.js";

const orgDataObj = await apiCall("./get-org-data", "org-placeholder");


// INITIAL PAGE LOAD
const orgRoutines = orgDataObj["routines"];
let currRoutineUid = 0;

const routineSelector = document.getElementById("select-routine");

function loadRoutinesIntoSelector () {
    for (let i=0; i<orgRoutines.length; i++) {

        let routineUid = orgRoutines[i]["uid"];
        let routineName = orgRoutines[i]["name"];

        let routineOption = elemBuild("option", "routine-opt");
        routineOption.setAttribute("value", routineUid);
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
        let uidVal = locations[i]["uid"];
        let nameVal = locations[i]["name"];
        let locationOption = elemBuild("option");
        locationOption.setAttribute("value", uidVal);
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
        let uidVal = resourceObj[i]["uid"];
        let idVal = resourceObj[i]["id"];
        let nameVal = resourceObj[i]["name"];
        let tagArr = resourceObj[i]["tags"];

        let tr = elemBuild("tr", "resource-record");

        let th = elemBuild("th");
        th.setAttribute("scope", "row");

        let inputField = elemBuild("input", "form-check-input table-checkbox");
        inputField.setAttribute("data-label", resource)
        inputField.setAttribute("data-uidval", uidVal);
        inputField.setAttribute("type", "checkbox");

        let tdID = elemBuild('td');
        tdID.setAttribute("value", idVal);
        tdID.innerHTML = idVal;

        let tdName = elemBuild('td');
        tdID.setAttribute("value", nameVal);
        tdName.innerHTML = nameVal;

        let tdTags = elemBuild('td');

        for (let j=0; j<tagArr.length; j++) {
            let tagUid = tagArr[j];
            let tagObj = orgDataObj["tags"].find(item => item.uid === tagUid);
            if (tagObj) {
                let tagName = tagObj["name"]
                let tag = elemBuild("div", "border rounded col text-center tag");
                tag.setAttribute("value", tagUid);
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
    currRoutineUid = routineSelector.options[routineSelector.selectedIndex].value;
    let routineData = orgRoutines.find(item => item.uid === currRoutineUid);
    let routineTasks = routineData["tasks"];
    for (let i=0; i<routineTasks.length; i++) {
        let rT = routineTasks[i];
        drawLib.addTaskCell(
            rT["uid"],
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

function editRoutine (taskUid) {
    let currRoutineTasks = orgRoutines.find(item => item.uid === currRoutineUid)["tasks"];
    let taskData = currRoutineTasks.find(item => item.uid === taskUid);

    // Load name of task as header
    let name = taskData["name"];
    let modalTitle = document.getElementById("edit-task-title");
    modalTitle.innerHTML = `Edit "${name}"`;


    // # General: Load task values of each input
    for (const [objUid, objValue] of Object.entries(taskData)) {
        let inputElement = document.querySelectorAll(`[data-label="${objUid}"]`)[0];
        if (inputElement) {
            inputElement.value = objValue;
            inputElement.setAttribute("data-generalvalue", objValue.toString());
        }
    }

    // # Horses, people and inventory panels
    let allResourceRecordsAssigned = taskData["herd"].concat(taskData["team"], taskData["equipment"]);
    let allTableCheckboxes = document.getElementsByClassName("table-checkbox");

    for (let i=0; i<allTableCheckboxes.length; i++) {
        allTableCheckboxes[i].checked = false;
    }

    for (let i=0; i<allResourceRecordsAssigned.length; i++) {
        let trResourceRecord = document.querySelectorAll(`[data-uidval="${allResourceRecordsAssigned[i]}"]`)[0];
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
    let taskDataObj = {
        "horses": [],
        "people": [],
        "inventory": []
    }
    let generalData = document.querySelectorAll("[data-generalvalue]");
    for (let i=0; i<(generalData.length); i++) {
        let label = generalData[i].dataset.label
        taskDataObj[label] = generalData[i].dataset.generalvalue;
    }

    let checkBoxData = document.querySelectorAll("[data-uidval]");
    for (let i=0; i<checkBoxData.length; i++) {
        if (checkBoxData[i].checked) {
            let label = checkBoxData[i].dataset.label
            let idVal = checkBoxData[i].dataset.uidval
            taskDataObj[label].push(idVal)
        }
    }
    console.log(taskDataObj)
}


// INIT

loadRoutinesIntoSelector();
loadLocationsIntoModal();
loadResourcesIntoModal("horses");
loadResourcesIntoModal("people");
loadResourcesIntoModal("inventory");
drawSelectedRoutine();
addSearchListeners();