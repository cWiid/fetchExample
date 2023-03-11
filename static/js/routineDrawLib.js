import {elemBuild} from "./elemBuild.js"

const pixelPerMin = 1;

function minToTime (min) {
    let timeHour = Math.trunc(min / 60).toString().padStart(2, '0');
    let timeMin = (min % 60).toString().padStart(2, '0');
    return (timeHour + ":" + timeMin);
}

function timeToMin (time) {
    let hourMin = (parseInt(time[0]) * 10 + parseInt(time[1])) * 60
    let minuteMin = parseInt(time[3]) * 10 + parseInt(time[4])
    return hourMin + minuteMin
}

export function clearRoutineTable () {
    let allTaskCells = document.getElementsByClassName('task-cell');

    while(allTaskCells[0]) {
        allTaskCells[0].parentNode.removeChild(allTaskCells[0]);
    }
}

export function addTaskCell(key, days, start, end, name, colour) {
    for (let i=0; i<days.length; i++) {
        let day = days[i]
        let taskContainer = document.getElementById("routine-table").children[parseInt(day)].lastChild;
        let startTime = timeToMin(start);
        let endTime = timeToMin(end);
        let duration = endTime - startTime;

        let taskCell = elemBuild("button", "btn col task-cell")
        taskCell.setAttribute("data-taskuid", key)
        taskCell.setAttribute("type", "button")
        taskCell.setAttribute("data-bs-toggle", "modal")
        taskCell.setAttribute("data-bs-target", "#edit-task")
        taskCell.setAttribute("style",
            `background-color: ${colour};
                    height: ${duration * pixelPerMin}px;
                    top: ${startTime * pixelPerMin}px;`
        );
        taskCell.innerHTML = `${name}<br>${start}<br>↓<br>${end}`

        taskContainer.appendChild(taskCell)
    }
}

export function scrollToTopLeftTask() {
    let taskButtons = document.querySelectorAll(".task-cell");
    if (taskButtons) {
        let topPixel = taskButtons[0].offsetTop;
        let leftPixel = 0
        taskButtons.forEach(function (btn) {
            if (btn.offsetTop < topPixel) {
                topPixel = btn.offsetTop;
            }
            if (btn.offsetLeft < leftPixel) {
                leftPixel = btn.offsetLeft;
                console.log(leftPixel)
            }
        })

        let routineContainer = document.getElementById("routine-app")
        routineContainer.scrollTop = topPixel - 120 * pixelPerMin;
        routineContainer.scrollLeft = leftPixel;
    }
}

