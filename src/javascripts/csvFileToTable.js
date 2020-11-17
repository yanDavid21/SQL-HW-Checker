const parse = require('csv-parse')


export default function parseCSV(file) {
    const csvPromise = new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (evt) {
            let csvString = evt.target.result;
            parse(csvString,{columns: true}, function (err, records) {
                if(err) {
                    reject(Error(err));
                } else {
                    if (records.length > 0) {
                        resolve(records);
                    } else {
                        reject(Error("Your csv file was empty."))
                    }
                }
            })
        }
    })
    return csvPromise;
}

