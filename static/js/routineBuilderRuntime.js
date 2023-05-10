import {elemBuild} from "./elemBuild.js";
import {apiCall} from "./apiFunctions.js";
import * as drawLib from "./routineDrawLib.js";


// INIT


const orgDataObj = await apiCall("./get-org-data", "org-placeholder", false);
const errGet = "Something went wrong. " +
    "Your changes were not saved to the server. " +
    "Ensure you are connected to the internet and try again."
let orgTasks = orgDataObj["tasks"];
let visibleTaskUids = [];
let routines = orgDataObj["routines"]

const routineSelector = document.getElementById("routine-select");
routineSelector.addEventListener("change",  () => { switchRoutine() })

const saveTaskBtn = document.getElementById("save-task-btn");
saveTaskBtn.addEventListener("click", () => saveTask());

const searchBars = document.querySelectorAll(".search");
searchBars.forEach(searchBar => {
    searchBar.addEventListener("keyup", () => searchTable(searchBar.name));
})

const deleteTaskBtn = document.getElementById("delete-task-btn");
deleteTaskBtn.addEventListener("click", () => deleteTask());

const newTaskBtn = document.getElementById("new-task-btn");
newTaskBtn.addEventListener("click", () => newTask());

const resourceTable = document.getElementById("filter-table-body");
let filterDatatype

let filterBtn = document.getElementById("filter-btn");
filterBtn.addEventListener("click", () => filterTasks());

let applyBtn = document.getElementById("apply-filter-btn");
applyBtn.addEventListener("click", () => {applyFilter(filterDatatype);});

function initOrgEnv() {
    loadRoutinesIntoSelector(routines);
    loadSelectorIntoModal("routine");
    loadSelectorIntoModal("location");
    loadResourcesIntoModal("horses", "resourceuid");
    loadResourcesIntoModal("people", "resourceuid");
    loadResourcesIntoModal("inventory", "resourceuid");
}

initOrgEnv();
drawRoutine();
drawLib.scrollToTopLeftTask();

function loadRoutinesIntoSelector(routines) {
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
    let vals = orgDataObj[key.concat("s")];
    let selector = document.getElementById(key);

    vals.forEach(val => {
        let uidVal = val["uid"];
        let nameVal = val["name"];
        let option = elemBuild("option");
        option.setAttribute("value", uidVal);
        option.innerHTML = nameVal;

        selector.appendChild(option);
    })
}

function loadResourcesIntoModal(resource, dataIdentifier, targetID=resource) {
    // Load organisation's horses, people or inventory into their respective panels
    let resourceObj = orgDataObj[resource];
    let resourceTable = document.getElementById(`${targetID}-table-body`);

    resourceObj.forEach(item => {
        let uidVal = item["uid"];
        let idVal = item["id"];
        let nameVal = item["name"];
        let tagArr = item["tags"];

        let tr = elemBuild("tr", "resource-record");

        let th = elemBuild("th");
        th.setAttribute("scope", "row");

        let inputField = elemBuild("input", "form-check-input table-checkbox resource-checkbox");
        inputField.setAttribute("data-label", targetID)
        inputField.setAttribute(`data-${dataIdentifier}`, uidVal);
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

function drawRoutine() {
    let currRoutineUid = routineSelector.options[routineSelector.selectedIndex].value;
    let filterUids = getFilterUids();
    console.log(filterUids)
    if ((filterUids.length === 0)) {
        visibleTaskUids = [];
        orgTasks.forEach( task => {
            visibleTaskUids.push(task["uid"])
        });
    }
    drawTasks(currRoutineUid, visibleTaskUids);
}

function drawTasks(routineUid, taskUidList) {
    drawLib.clearRoutineTable()
    taskUidList.forEach(id => {
        orgTasks.forEach(task => {
            if ((task["uid"] === id) && (task["routine"] === routineUid)) {
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
    });
    addButtonListeners();
}

function switchRoutine() {
    drawRoutine();
    drawLib.scrollToTopLeftTask();
}


// TASK BOARD

function addButtonListeners() {
    let taskButtons = document.querySelectorAll(".task-cell");

    if (taskButtons) {
        taskButtons.forEach(btn => {
            btn.addEventListener("click", () => editTask(btn.dataset.taskuid));
        })
    }
}


function editTask(taskUid) {
    let taskData = orgTasks.find(item => item.uid === taskUid);

    // Switch footers
    switchFooters("edit")

    // Load name of task as header
    let name = taskData["name"];
    let modalHeader = document.getElementById("edit-task-title");
    modalHeader.innerHTML = `Edit "${name}"`;

    // Load uid of task into header dataset
    modalHeader.setAttribute("data-taskuidval", taskUid)

    // # General: Load task values of each input
    for (const [objKey, objValue] of Object.entries(taskData)) {
        let inputElement = document.querySelectorAll(`[data-label="${objKey}"]`)[0];
        if (inputElement && inputElement.classList.contains("general-key")) {
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
    let tableCheckboxes = document.querySelectorAll("[data-resourceuid]");

    tableCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    })

    let resourceUidsAssigned = taskData["horses"].concat(taskData["people"], taskData["inventory"]);
    resourceUidsAssigned.forEach(uid => {
        let trResourceRecord = document.querySelectorAll(`[data-resourceuid="${uid}"]`)[0];
        trResourceRecord.checked = true;
    })
}


// MODAL

function searchTable(resource) {
    // Declare variables
    let input = document.getElementById(`${resource}-search`);
    let table = document.getElementById(`${resource}-table`);
    let searchType = document.getElementById(`${resource}-search-type`).value;

    let filter = input.value.toUpperCase();
    let tableRow = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for(let i=0; i<tableRow.length; i++) {
        let row = tableRow[i]
        let tableData = row.getElementsByTagName("td")[searchType];
        if (tableData) {
            let txtValue = tableData.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }
}

function switchFooters(footer) {
    let editModalToggle, newModalToggle = false;
    switch (footer) {
        case "edit":
            editModalToggle = true;
            break;

        case "new":
            newModalToggle = true;
            break;
    }
    // Use edit-task-footer
    let editModalFooter = document.getElementById("edit-task-footer");
    editModalFooter.hidden = !editModalToggle;


    // Use new-task-footer
    let newModalFooter = document.getElementById("new-task-footer");
    newModalFooter.hidden = !newModalToggle;

}


// SAVE MODAL EDITS

async function saveTask() {
    let taskDataObj = getInputtedData();
    let currTask = orgTasks.find(task => task["uid"] === taskDataObj["uid"]);

    if (!currTask) {
        throw new Error(`Original task with uid ${taskDataObj.uid} does not exist.`);
    }

    let serverValidation = await apiCall("./post-edited-task", JSON.stringify(taskDataObj), true);

    if (serverValidation && currTask) {
        let currTaskIndex = orgTasks.indexOf(currTask);
        orgTasks[currTaskIndex] = taskDataObj;
        drawRoutine();
    }
    else {
        alert(errGet)
    }
}

// RETRIEVE TASK VALUES FROM MODAL

function getInputtedData() {
    let taskDataObj = {
        "days": [],
        "horses": [],
        "people": [],
        "inventory": []
    };

    // Add task uid to taskDataObj
    let modalHeader = document.getElementById("edit-task-title");
    taskDataObj["uid"] = modalHeader.dataset.taskuidval;

    // Add general data to taskDataObj
    let generalData = Array.from(document.getElementsByClassName("general-key"));
    generalData.forEach(field => {
        let label = field.dataset.label;
        taskDataObj[label] = field.value;
    });

    // Add days data to taskDataObj
    let allDayCheckboxes = document.querySelectorAll("[data-day]");
    for (let i=0; i<7; i++) {
        if (allDayCheckboxes[i].checked) {
            taskDataObj["days"].push(allDayCheckboxes[i].dataset.day);
        }
    }

    // Add resource data to taskDataObj
    let checkBoxData = document.querySelectorAll("[data-resourceuid]");
    checkBoxData.forEach(checkbox => {
        if (checkbox.checked) {
            let label = checkbox.dataset.label;
            let uidVal = checkbox.dataset.resourceuid;
            taskDataObj[label].push(uidVal);
        }
    });

    return taskDataObj
}


// DELETE TASK

async function deleteTask() {
    let modalHeader = document.getElementById("edit-task-title")
    let taskUid = modalHeader.dataset.taskuidval;
    let taskIndex = -1;

    for (let i=0; i<orgTasks.length; i++) {
        if (orgTasks[i]["uid"] === taskUid) {
            taskIndex = i;
        }
    }

    let serverValidation = await apiCall("./post-edited-task", taskUid, true);
    if (serverValidation && (taskIndex + 1)) {
        orgTasks.splice(taskIndex, 1);
        drawRoutine();
    }
    else {
        alert(errGet)
    }
}

// CREATE TASK


function newTask() {
    // Switch footers
    switchFooters("new")


    let modalHeader = document.getElementById("edit-task-title");
    modalHeader.innerHTML = "Create new task";
    modalHeader.dataset.taskuidval = "pending";

    let generalKeys = document.getElementsByClassName("general-key");
    for (let i=0; i<generalKeys.length; i++) {
        generalKeys[i].value = '';
    }

    let dayCheckboxes = document.querySelectorAll("[data-day]")
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    })

    let tableCheckboxes = document.querySelectorAll("[data-resourceuid]");
    for (let i=0; i<tableCheckboxes.length; i++) {
        tableCheckboxes[i].checked = false;
    }
}

let createTaskBtn = document.getElementById("create-new-task-btn");
createTaskBtn.addEventListener("click", () => createNewTask());

async function createNewTask() {
    let taskDataObj = getInputtedData();
    let assignedUid = await apiCall("./post-new-task", JSON.stringify(taskDataObj));
    if (assignedUid) {
        taskDataObj["uid"] = assignedUid.toString();
        orgTasks.push(taskDataObj);
    }
    else {
        alert(errGet)
    }
    drawRoutine();
}

// FILTER TASKS

function loadFilterResources(filterDatatype) {
    let lastResource = resourceTable.dataset.lastresource;
    if ((filterDatatype !== lastResource) && (filterDatatype !== "not-selected")) {
        console.log("change")
        resourceTable.innerHTML = '';

        let modalTitle = document.getElementById("filter-title");
        modalTitle.innerHTML = `Filter taskboard by ${filterDatatype}`;

        loadResourcesIntoModal(filterDatatype, "filteruid", "filter");
        resourceTable.setAttribute("data-lastresource", filterDatatype);
    }
}

function getFilterUids() {
    let uids;
    uids = [];
    let checkBoxData = document.querySelectorAll("[data-filteruid]");
    checkBoxData.forEach(checkbox => {
        if (checkbox.checked) {
            let uidVal = checkbox.dataset.filteruid;
            uids.push(uidVal);
        }
    });
    return uids;
}

function findVisibleTasks(datatype, uids) {
    visibleTaskUids = [];
    uids.forEach(uid => {
        orgTasks.forEach(task => {
            task[datatype].forEach(item => {
                let taskUid = task["uid"];
                if (item === uid && !visibleTaskUids.includes(taskUid)) {
                    visibleTaskUids.push(taskUid);
                }
            });
        });
    });
    return visibleTaskUids
}



function applyFilter(datatype){
    let uids = getFilterUids();
    visibleTaskUids = findVisibleTasks(datatype, uids);
    drawRoutine();
}

function filterTasks() {
    let filterDatatypeSelector = document.getElementById("filter-datatype-select");
    filterDatatype = filterDatatypeSelector.value;
    loadFilterResources(filterDatatype);
}