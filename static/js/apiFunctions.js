// Main API calling functionality

function fetchInit(jsonData) {
    return {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };
}


export function apiCall(url, jsInput, validationCall= false) {
    return fetch(url, fetchInit(jsInput))
        .then(result=> {
            if (result.ok) {
                if (!validationCall) {
                    return result.json();
                }
                else {
                    return true
                }
            } else {
                const message = 'An error has occurred: '.concat(result.status.toString());
                throw new Error(message)
            }
        })
        .then(pyOutput=>{
            return pyOutput
        })
        .catch((err) => console.error(err));
}



