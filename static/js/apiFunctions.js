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


export function apiCall(url, jsInput) {
    return fetch(url, fetchInit(jsInput))
        .then(res=> {
            if (res.ok) {
                return res.json();
            } else {
                const message = 'An error has occurred: '.concat(res.status.toString());
                throw new Error(message)
            }
        })
        .then(pyOutput=>{
            return pyOutput
        })
        .catch((err) => console.error(err));
}



