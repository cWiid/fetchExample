import {elemBuild} from "./elemBuild.js";
import {apiCall} from "./apiFunctions.js";
import * as drawLib from "./routineDrawLib.js";

const orgDataObj = await apiCall("./get-org-data", "org-placeholder", false);

// INITIAL PAGE LOAD
const orgTasks = orgDataObj["tasks"];
let currRoutineUid = 0;

const routineSelector = document.getElementById("select-routine");

function loadRoutinesIntoSelector() {
    let routines = orgDataObj["routines"]
    for (let i=0; i<routines.length; i++) {

        let routineUid = routines[i]["uid"];
        let routineName = routines[i]["name"];

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

function loadSelectorIntoModal(key) {
    let keys = orgDataObj[key];
    let selector = document.getElementById(key);

    keys.forEach(key => {
        let uidVal = key["uid"];
        let nameVal = key["name"];
        let option = elemBuild("option");
        option.setAttribute("value", uidVal);
        option.innerHTML = nameVal;

        selector.appendChild(option);
    })
}

function loadResourcesIntoModal(resource) {
    // Load organisation's horses, people or inventory into their respective panels
    let resourceObj = orgDataObj[resource];
    let resourceTable = document.getElementById(`${resource}-table-body`);

    resourceObj.forEach(item => {
        let uidVal = item["uid"];
        let idVal = item["id"];
        let nameVal = item["name"];
        let tagArr = item["tags"];

        let tr = elemBuild("tr", "resource-record");

        let th = elemBuild("th");
        th.setAttribute("scope", "row");

        let inputField = elemBuild("input", "form-check-input table-checkbox");
        inputField.setAttribute("data-label", resource)
        inputField.setAttribute("data-resourceuid", uidVal);
        inputField.setAttribute("type", "checkbox");

        let tdID = elemBuild('td');
        tdID.setAttribute("value", idVal);
        tdID.innerHTML = idVal;

        let tdName = elemBuild('td');
        tdID.setAttribute("value", nameVal);
        tdName.innerHTML = nameVal;

        let tdTags = createTagCell(tagArr)

        th.appendChild(inputField);
        tr.appendChild(th);
        tr.appendChild(tdID);
        tr.appendChild(tdName);
        tr.appendChild(tdTags);
        resourceTable.appendChild(tr);
    });
}

function createTagCell(tagArr) {
    let tdTagValue = ''
    let tdTags = elemBuild('td');

    tagArr.forEach(tagUid => {
        let tagObj = orgDataObj["tags"].find(item => item["uid"] === tagUid);
        if (tagObj) {
            let tagName = tagObj["name"]
            let tagElem = elemBuild("div", "border rounded col text-center tag");
            tagElem.setAttribute("value", tagUid);
            tagElem.innerHTML = tagName;
            tdTags.appendChild(tagElem);
            tdTagValue += (tagName + ' ')
        }
    });

    tdTags.setAttribute("value", tdTagValue)
    return tdTags
}

// ROUTINE SELECTOR

routineSelector.addEventListener("change",  () => {
    drawSelectedRoutine();
})

function drawSelectedRoutine() {
    drawLib.clearRoutineTable()
    currRoutineUid = routineSelector.options[routineSelector.selectedIndex].value;
    orgTasks.forEach(task => {
        if (task["routine"] === currRoutineUid) {
            drawLib.addTaskCell(
                task["uid"],
                task["days"],
                task["start"],
                task["end"],
                task["name"],
                task["colour"]
            );
        }
    });
    addButtonListeners();
    drawLib.scrollToTopLeftTask();
}


// TASK BOARD

function addButtonListeners() {
    let taskButtons = document.querySelectorAll(".task-cell");

    if (taskButtons) {
        taskButtons.forEach(btn => {
            btn.addEventListener("click", () => editRoutine(btn.dataset.taskuid));
        })
    }
}


function editRoutine(taskUid) {
    let taskData = orgTasks.find(item => item.uid === taskUid);

    // Load name of task as header
    let name = taskData["name"];
    let modalTitle = document.getElementById("edit-task-title");
    modalTitle.innerHTML = `Edit "${name}"`;

    // Load uid of task into header dataset
    modalTitle.setAttribute("data-taskuidval", taskUid)

    // # General: Load task values of each input
    for (const [objKey, objValue] of Object.entries(taskData)) {
        let inputElement = document.querySelectorAll(`[data-label="${objKey}"]`)[0];
        if (inputElement) {
            inputElement.value = objValue;
            inputElement.setAttribute("data-generalval", objValue.toString());
        }
    }

    // # Day checkboxes
    let dayCheckboxes = document.querySelectorAll("[data-day]")
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    })

    let taskDays = taskData["days"]
    taskDays.forEach(day => {
        let dayCheckbox = document.querySelectorAll(`[data-day="${day}"]`)[0];
        dayCheckbox.checked = true;
    })

    // # Horses, people and inventory panels
    let tableCheckboxes = document.querySelectorAll(".table-checkbox");

    tableCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    })

    let resourceUidsAssigned = taskData["herd"].concat(taskData["team"], taskData["equipment"]);
    resourceUidsAssigned.forEach(uid => {
        let trResourceRecord = document.querySelectorAll(`[data-resourceuid="${uid}"]`)[0];
        trResourceRecord.checked = true;
    })
}


// MODAL

function addSearchListeners() {
    let searchBars = document.querySelectorAll(".search");

    searchBars.forEach(searchBar => {
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
    tableRow.forEach(row => {
        let tableData = row.getElementsByTagName("td")[searchType];
        if (tableData) {
            let txtValue = tableData.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    });
}

// SAVE MODAL EDITS

let saveChangesBtn = document.getElementById("save-changes-btn");
saveChangesBtn.addEventListener("click", () => saveTask());

async function saveTask() {
    let taskDataObj = getInputtedData();
    await apiCall("./post-edited-task", JSON.stringify(taskDataObj), true);

    let currTask = orgTasks.find(task => task["uid"] === taskDataObj["uid"]);
    if (currTask) {
        let currTaskIndex = orgTasks.indexOf(currTask);
        console.log(orgTasks);
        orgTasks[currTaskIndex] = taskDataObj;
    }
    else {
        throw new Error(`Original task with uid ${taskDataObj.uid} does not exist.`);
    }
    drawSelectedRoutine();
}

// RETRIEVE TASK VALUES FROM MODAL

function getInputtedData() {
    let taskDataObj = {
        "days": [],
        "horses": [],
        "people": [],
        "inventory": []
    };

    // Add task uid
    let modalHeader = document.getElementById("edit-task-title");
    taskDataObj["uid"] = modalHeader.dataset.taskuidval;

    // Add general data
    let generalData = document.querySelectorAll("[data-generalval]");
    generalData.forEach(field => {
        let label = field.dataset.label;
        taskDataObj[label] = field.dataset.generalval;
    });

    // Add days data
    let allDayCheckboxes = document.querySelectorAll("[data-day]");
    for (let i=0; i<7; i++) {
        if (allDayCheckboxes[i].checked) {
            taskDataObj["days"].push(allDayCheckboxes[i].dataset.day);
        }
    }

    // Add resource data
    let checkBoxData = document.querySelectorAll("[data-resourceuid]");
    checkBoxData.forEach(checkbox => {
        if (checkbox.checked) {
            let label = checkbox.dataset.label;
            let idVal = checkbox.dataset.resourceuid;
            taskDataObj[label].push(idVal);
        }
    });
    return taskDataObj
}


// INIT

loadRoutinesIntoSelector();
loadSelectorIntoModal("routines");
loadSelectorIntoModal("locations");
loadResourcesIntoModal("horses");
loadResourcesIntoModal("people");
loadResourcesIntoModal("inventory");
drawSelectedRoutine();
addSearchListeners();