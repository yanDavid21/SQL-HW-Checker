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

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            alertMessage: "",
            sqlLoading: false,
            csvLoading: false,
            loading: false,
            sqlFile: null,
            csvFile: null,
            queryResults: [{ "sample-header": 1, "header-2": "David Yan" }, { "sample-header": 2, "header-2": "Saahil Kumar" }],
            csvResults: [],
            sqliteDiffResult: "",
            sqlFileName: "No file selected",
            csvFileName: "No file selected"
        }
        this.serverAddress = 'http://localhost:8080/';
        this.uploadFile = this.uploadFile.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    uploadFile(e, string) {
        try {
            let target = e.target;
            let file = target.files[0];
            let extension = file.name.split('.').pop();

            if (extension === "sql" && string === ".sql") {
                this.setState(state => ({
                    sqlFile: file,
                    sqlLoading: true,
                    sqlFileName: file.name
                }))
                //make read only requests to sqlite database
                communicateWithBackEnd(this.serverAddress, file)
                .then(response => {
                    this.setState(state => ({
                        sqlLoading: false,
                        queryResults: response,
                    }))
                }).catch(err => {
                    this.setState(state => ({
                        alertMessage: err.toString(),
                        alert: true
                    }))
                })
            } else if (extension === "csv" && string === ".csv") {
                this.setState(state => ({
                    csvFile: file,
                    csvLoading: true,
                    csvFileName: file.name
                }));
                csvToTable(file).then(output => {
                    this.setState(state => ({
                        csvLoading: false,
                        csvResults: output
                    }))
                }).catch(err => {
                    this.setState(state => ({
                        alertMessage: err.toString(),
                        alert: true
                    }))
                })
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
        } catch (err) {
            this.setState(state => ({
                alertMessage: err.toString(),
                alert: true
            }))
        }
    }

    submitButton() {
        let validSQL = !(this.state.queryResults === undefined || this.state.queryResults.length === 0);
        let validCSV = !(this.state.csvResults === undefined || this.state.csvResults.length === 0);
        if (validSQL && validCSV) {
            this.setState(state => ({
                loading: true
            }))
           //compare results
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
                    <SqliteDiffResult content={this.state.sqliteDiffResult} loading={this.state.loading}></SqliteDiffResult>
                </div>
            </div>
        );
    };
}

export default withStyles(useStyles)(Body);