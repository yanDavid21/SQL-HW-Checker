
export default function communicateWithBackEnd(serverAddress, file) {
    const sqlPromise = new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (evt) {
            let sqlString = evt.target.result;
            let selectParam = getSelectParam(sqlString);
            let fromParam = getFromParam(sqlString);
            let 
            fetch(serverAddress, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            })
        }
    })
    return sqlPromise;
}