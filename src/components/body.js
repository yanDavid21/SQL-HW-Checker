import '../stylesheets/app.css';
import Form from 'react-bootstrap/Form';
import ResultComponent from './resultComponent.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import SqliteDiffResult from './sqliteDiffResult.js'

export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            alertMessage: "",
            loading: false,
            sqlFile: null,
            csvFile: null,
            queryResults: [{ header: "pee" }, { header: "hey" }],
            csvResults: [],
            sqliteDiffResult: "result"
        }
        this.serverAddress = 'http://localhost:8080/';
        this.uploadFile = this.uploadFile.bind(this);
        this.submiteButton = this.submitButton.bind(this);
        this.communicateWithBackEnd = this.submitButton.bind(this);
    }

    uploadFile(e, string) {
        try {
            let target = e.target;
            let file = target.files[0];
            let extension = file.name.split('.').pop();
            if (extension === "sql" && string === ".sql") {
                this.setState(state => ({
                    sqlFile: file,
                }))
            } else if (extension === "csv" && string === ".csv") {
                this.setState(state => ({
                    csvFile: file,
                }));

            } else {
                this.setState(state => ({
                    alertMessage: "Please input only sql and csv files in the correct slot! Thank you. :)",
                    alert:true
                }))
            }
        } catch (err) {
            this.setState(state => ({
                alertMessage: "Please input only sql and csv files in the correct slot! Thank you. :)",
                alert:true
            }))
        }
    }

    communicateWithBackEnd(contentType, file) {
        fetch(this.serverAddress, {
            method: 'POST',
            headers: {
                'Content-Type': contentType
            },
            body: file
        }).then(response => {
            console.log(file);
            //return response.json();
        }).then(data => {
            /*
            if(contentType === 'text/plain') {
                this.setState(state => ({
                    sqlFile: data
                }))
            } else {
                this.setState(state => ({
                    sqlFile: data
                }))
            }
            */
        }).catch(err => {
            this.setState(state => ({
                alertMessage: "There appears to be some trouble communicating with the server. Please check your connection and try again.",
                alert:true
            }))
        })
    }

    submitButton() {
        if (this.state.sqlFile != null && this.state.csvFile != null) {
            this.communicateWithBackEnd('text/plain', this.state.sqlFile);
            this.communicateWithBackEnd('text/csv', this.state.csvFile);
        } else {
            this.setState(state => ({
                alertMessage: "Are you sure you have both .sql and .csv files in the correct place?",
                alert:true
            }))
        }
    }

    render() {
        let content = this.state.loading ? <Spinner animation="border" /> : <SqliteDiffResult content ={this.state.sqliteDiffResult}></SqliteDiffResult>
        return (
            <div className="main-body">
                <Modal show={this.state.alert} onHide={() => { this.setState(state => ({ alert: false })) }} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Oops!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.alertMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { this.setState(state => ({ alert: false })) }}>
                            Close </Button>
                    </Modal.Footer>
                </Modal>
                <div className="left-panel">
                    <Form>
                        <Form.Group className="form-group">
                            <Form.File id="sql-input" label="Input your .sql file here." onChange={(e) => this.uploadFile(e, ".sql")} />
                            <Form.File id="csv-input" label="Input your .csv file here." onChange={(e) => this.uploadFile(e, ".csv")} />
                        </Form.Group>
                    </Form>
                    <Button variant="success" onClick={this.submiteButton}>Compare</Button>
                </div>
                <div className="right-panel">
                    <div className="results">
                        <ResultComponent name="Query results" results={this.state.queryResults} />
                        <ResultComponent name="CSV results" results={this.state.csvResults} />
                    </div>
                    {content}
                </div>
            </div>
        );
    };
}