import '../stylesheets/app.css';
import Form from 'react-bootstrap/Form';
import ResultComponent from './resultComponent.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            sqlFile: null,
            csvFile: null,
            queryResults: [{ header: "pee" }, { header: "hey" }],
            csvResults: []
        }
        const serverAddress = 'http://localhost:8080/';
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
                alert("Please input only sql and csv files in the correct slot! Thank you. :)")
            }
        } catch (err) {
            alert("Please input only sql and csv files in the correct slot! Thank you. :)")
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
            alert("Oops! There appears to be some trouble communicating with the server. Please check your connection and try again.");
        })
    }

    submitButton() {
        if (this.state.sqlFile != null && this.state.csvFile != null) {
            this.communicateWithBackEnd('text/plain', this.state.sqlFile);
            this.communicateWithBackEnd('text/csv', this.state.csvFile);
        } else {
            alert("Are you sure you have both .sql and .csv files in the correct place?");
        }
    }

    render() {
        let content = this.state.loading ? <Spinner animation="border" /> : <div></div>
        return (
            <div className="main-body">
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
                    <div className="sql-diff">
                        {content}
                    </div>
                </div>
            </div>
        );
    };
}