import '../stylesheets/app.css';
import { withStyles } from '@material-ui/core/styles';
import ResultComponent from './resultComponent.js'
import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Modal from '@material-ui/core/Modal';
import SqliteDiffResult from './sqliteDiffResult.js';
import Divider from '@material-ui/core/Divider';
import csvToTable from '../javascripts/csvFileToTable.js';
import communicateWithBackEnd from '../javascripts/sqlFileToTable.js';

//styles used for the material UI components
const useStyles = theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    color: {
        color: "white",
        "background-color": "rgb(44, 161, 40)",
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        transform: `translate(50%, 50%)`,
    },
});

//React component that holds the main content : results tables, sqlitediff results, and input buttons
//This component maintains the state of its children such as the current files stored and its results, state of the alert etc.
class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false, //whether the alert should be shown
            alertMessage: "",
            sqlLoading: false, 
            csvLoading: false,
            loading: false, //this and previous two states determine whether the boxes need a loading animation
            sqlFile: null,
            csvFile: null, // the sql and csv files that are currently uploaded (in memory)
            queryResults: [],
            csvResults: [], //the sql and csv results after parsing, to be put in the tables
            sqliteDiffResult: "", // the response on whether the results have any differences
            sqlFileName: "No file selected",
            csvFileName: "No file selected", //The file name to be displayed under the file buttons
            diffBgColor: "black" //the color of the text of the sqlite diff results
        }
        this.serverAddress = 'https://warm-sea-15269.herokuapp.com/';
        this.uploadFile = this.uploadFile.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    //the function to handle both buttons to upload sql and csv files (should separate logic, will do in future update)
    //csv file is parsed locally while sql query is sent to server and the results are processed
    uploadFile(e, string) {
        try {
            let target = e.target;
            let file = target.files[0];
            let extension = file.name.split('.').pop();

            //checks for sql button press and if the given button was supplied a file with .sql extension
            if (extension === "sql" && string === ".sql") {
                this.setState(state => ({
                    sqlFile: file,
                    sqlLoading: true,
                    sqlFileName: file.name,
                    sqliteDiffResult: "",
                    diffBgColor: "black"
                }))
                //server query api url 
                let apiURL = this.serverAddress + "chinook"

                //make read only requests to sqlite database, if the response is a success, update the state with the results
                //else throw an error and have an alert message be displayed 
                communicateWithBackEnd(apiURL + "", file)
                    .then(data => {
                        if (data.status === "success") {
                            this.setState(state => ({
                                sqlLoading: false,
                                queryResults: data.response
                            }))
                        } else {
                            throw Error(data.response);
                        }
                    }).catch(err => {
                        this.setState(state => ({
                            alertMessage: err.toString(),
                            alert: true,
                            sqlLoading: false
                        }))
                    })
            //checks for the csv button press and if the given button was supplied a file with .csv extension
            } else if (extension === "csv" && string === ".csv") {
                this.setState(state => ({
                    csvFile: file,
                    csvLoading: true,
                    csvFileName: file.name,
                    sqliteDiffResult: "",
                    diffBgColor: "black"
                }));

                //method to parse the given file, returning a promise that resolves into an array of results
                csvToTable(file).then(output => {
                    this.setState(state => ({
                        csvLoading: false,
                        csvResults: output
                    }))
                }).catch(err => {
                    this.setState(state => ({
                        alertMessage: err.toString(),
                        alert: true,
                        csvLoading: false
                    }))
                })
            //if the buttons were pressed and aren't given their proper files (or null), reset the value displayed
            } else {
                if (string === ".csv") {
                    this.setState(state => ({
                        csvFile: null,
                        csvFileName: "No file selected"
                    }))
                } else if (string === ".sql") {
                    this.setState(state => ({
                        sqlFile: null,
                        sqlFileName: "No file selected"
                    }))
                }
                throw Error('Please input only sql and csv files in the correct slot! Thank you. :)');
            }
        } catch (err) { //catch any overall errors and display an error message
            this.setState(state => ({
                alertMessage: err.toString(),
                alert: true,
                sqlLoading: false,
                csvLoading: false,
                sqliteDiffResult: "",
                diffBgColor: "black"
            }))
        }
    }

    //handles button press to compare the sql query results and csv results
    //uses the JSON stringify method and compares the strings produced per row
    submitButton() {
        let validSQL = !(this.state.queryResults === undefined || this.state.queryResults.length === 0);
        let validCSV = !(this.state.csvResults === undefined || this.state.csvResults.length === 0);

        if (validSQL && validCSV) {
            this.setState(state => ({
                loading: true //let the loading animation run
            }))

            let result = ""; //string to be returned

            //compare results and output result
            let csvTableString = this.state.csvResults;
            let sqlTableString = this.state.queryResults;
            
            let failed = false; //boolean denoting if there was a mismatch

            //if the lengths are different... reject
            if (csvTableString.length !== sqlTableString.length) {
                result += "Different lengths of results. Check the csv and sql results for differences.\r\n"
                + "The csv results have " + csvTableString.length +" row(s). While sql results have " + sqlTableString.length + " row(s).\r\n";
                failed = true;
            }
            
            let i; 
            //iterate through the tables and check for mismatches, JSON stringify is used to compare, returns the row with an infraction if any
            for (i = 0; i < csvTableString.length && !failed; i++) {
                if (JSON.stringify(sqlTableString[i]) !== JSON.stringify(csvTableString[i])) {
                    failed = true;
                    result += "Different results at row " + i + ". Check the csv and sql results for differences.\r\n";
                    break;
                }
            }

            //if failed is false, then its good to go! Mark the text green, otherwise mark it red.
            if (failed === false) {
                result += "Query correctly reproduces answer files. Checked " + i + " rows. (Check for manual ordering!)\r\n";
                this.setState(state => ({
                    diffBgColor : "rgb(44, 161, 40)"
                }))
            } else {
                this.setState(state => ({
                    diffBgColor : "rgb(170, 17, 17)"
                }))
            }

            this.setState(state => ({
                loading: false,
                sqliteDiffResult: result
            }))
        } else {
            this.setState(state => ({
                alertMessage: "Are you sure you have uploaded both .sql and .csv files in the correct place?",
                alert: true
            }))
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="main-body">
                <Modal
                    open={this.state.alert}
                    onClose={() => { this.setState(state => ({ alert: false })) }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description">
                    <div className={classes.paper}>
                        <h2 id="simple-modal-title">Oops!</h2>
                        <Divider />
                        <p id="simple-modal-description">
                            {this.state.alertMessage} </p>
                        <Button variant="contained" className={classes.color} onClick={() => { this.setState(state => ({ alert: false })) }}>
                            Close </Button>
                    </div>
                </Modal>
                <div className="left-panel">
                    <div className="form-group">

                        <h5>Input your .sql file please </h5>
                        <input
                            className={classes.input}
                            id="sql-button"
                            multiple
                            type="file"
                            onChange={(e) => this.uploadFile(e, ".sql")}
                        />
                        <label htmlFor="sql-button">
                            <Button
                                variant="contained"
                                color="default"
                                className={classes.button}
                                component="span"
                                startIcon={<CloudUploadIcon />}>
                                Upload
                        </Button>
                        </label>
                        <p>{this.state.sqlFileName}</p>

                        <Divider />
                        <h5>Input your .csv file please </h5>
                        <input
                            className={classes.input}
                            id="csv-button"
                            multiple
                            type="file"
                            onChange={(e) => this.uploadFile(e, ".csv")}
                        />
                        <label htmlFor="csv-button">
                            <Button
                                variant="contained"
                                color="default"
                                className={classes.button}
                                component="span"
                                startIcon={<CloudUploadIcon />}>
                                Upload
                            </Button>
                        </label>
                        <p>{this.state.csvFileName}</p>
                    </div>
                    <Button variant="contained" className={classes.color} onClick={this.submitButton}>
                        Compare
                    </Button>
                </div>
                <div className="right-panel">
                    <div className="results">
                        <ResultComponent id="#query-results" name="Query results" results={this.state.queryResults} loading={this.state.sqlLoading} />
                        <ResultComponent id="csv-results" name="CSV results" results={this.state.csvResults} loading={this.state.csvLoading} />
                    </div>
                    <SqliteDiffResult content={this.state.sqliteDiffResult} loading={this.state.loading} bgColor={this.state.diffBgColor}></SqliteDiffResult>
                </div>
            </div>
        );
    };
}

export default withStyles(useStyles)(Body);