import { elemBuild } from "./elemBuild.js"

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let routineApp = document.getElementById("routine-app");

function initTimeStampCol () {
    let timestampCol = elemBuild("div", "col-2", "timestamp-col");
    let timestampRow = elemBuild("div", "row sticky-top timestamp-row", "empty-timestamp-row");
    timestampCol.appendChild(timestampRow)

    for (let i=0; i<24; i++) {
        let timestampRow = elemBuild("div", "row timestamp-row");
        timestampRow.innerHTML = `${i.toString().padStart(2, '0')}:00`
        timestampCol.appendChild(timestampRow)
    }

    return timestampCol
}

function initDayHeader(weekIndex) {
    let dayTitleDiv = elemBuild("div",
        "col day-title border border-primary rounded row-xs center-block text-center sticky-top",
        (weekIndex+1).toString().toLowerCase().concat("-title"));
    dayTitleDiv.innerHTML = weekdays[weekIndex];

    return(dayTitleDiv)
}

function initDayCol(weekIndex) {
    let day = weekdays[weekIndex];

    let cellsDiv = elemBuild("div", "cells-div");
    let dayCol = elemBuild("div", "col day-col", day);
    dayCol.appendChild(initDayHeader(weekIndex))


    for (let i=0; i<24; i++) {
        let timestampIdCode = (weekIndex + 1).toString().concat("-").concat(i.toString());
        let cell = document.createElement("div");
        cell.setAttribute("id", timestampIdCode);
        if (i % 2 === 0) {
            cell.setAttribute("class", "row cell border-bottom light-cell");
        }
        else {
            cell.setAttribute("class", "row cell border-bottom dark-cell");
        }
        // cell.innerHTML = timestampIdCode;

        cellsDiv.appendChild(cell);
        dayCol.appendChild(cellsDiv);
    }

    let taskContainer = elemBuild("div", "row task-container")
    dayCol.append(taskContainer)

    return(dayCol);
}

function initRoutineBuilder() {
    let routineTable = elemBuild("div", "row", "routine-table")
    routineTable.appendChild(initTimeStampCol())

    for (let i=0; i<7; i++) {

        let dayCol = initDayCol(i);
        routineTable.appendChild(dayCol);
    }
    routineApp.appendChild(routineTable);
}

initRoutineBuilder();