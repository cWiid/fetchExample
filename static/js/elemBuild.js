// Element Build: this is just a function that will speed up making elements
export function elemBuild(type, classField, idField) {
    let div = document.createElement(type);
    if (classField) {
        div.setAttribute("class", classField);
    }
    if (idField) {
        div.setAttribute("id", idField);
    }

    return div
}