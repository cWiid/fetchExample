import {elemBuild} from "./elemBuild.js"
import {apiCall} from "./apiFunctions.js"
import * as drawLib from "./routineDrawLib.js"

const orgDataObj = await apiCall("./get-org-data", "org-placeholder");
const orgRoutines = orgDataObj["routines"];
let currRoutineKey = 0;

// Loading routine names into selector
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

routineSelector.addEventListener("change",  () => {
    drawSelectedRoutine();
})


// Visualise routine data into table
function drawSelectedRoutine() {
    drawLib.clearRoutineTable()
    currRoutineKey = routineSelector.options[routineSelector.selectedIndex].value;
    let routineData = orgRoutines.find(item => item.key === currRoutineKey)
    let routineTasks = routineData["tasks"]
    for (let i=0; i<routineTasks.length; i++) {
        let rT = routineTasks[i]
        drawLib.addTaskCell(
            rT["key"],
            rT["day"],
            rT["start"],
            rT["end"],
            rT["name"],
            rT["colour"]
        )
    }
    addButtonListeners();
}

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

    // Load organisation locations into general panel
    let locations = orgDataObj["locations"]
    let locationSelector = document.getElementById("location")
    locationSelector.innerHTML = ''

    for (let i=0; i<locations.length; i++) {
        // Remember, for now, index position = the record key
        let locationOption = elemBuild("option");
        locationOption.setAttribute("value", (i).toString());
        locationOption.innerHTML = locations[i];

        locationSelector.appendChild(locationOption);
        console.log(locationSelector)
    }


    // Load default values of each input
    for (const [objKey, objValue] of Object.entries(taskData)) {
        let inputElement = document.getElementById(objKey);
        if (inputElement) {
            inputElement.value = objValue;
        }

    }
}


loadRoutinesIntoSelector()
drawSelectedRoutine()