import '../stylesheets/app.css';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function resultComponent(props) {

    let columnHeaders = new Set();
    let arrColumnHeaders = [];

    function renderColumns(results) {
        results.forEach(result => {
            for (const key in result) {
                if (!columnHeaders.has(key)) {
                    columnHeaders.add(key);
                }
            }
        })

        columnHeaders.forEach(header => {
            arrColumnHeaders.push(header);
        });

        return (
            arrColumnHeaders.map(header => {
                return <th key={header}>{header}</th>
            })
        );
    }

    function renderRows(results) {
        return (results.map((result, index) => {
            let arrCells = [];
            columnHeaders.forEach(header => {
                arrCells.push(<td key={index}>{result[header]}</td>);
            })
            return <tr key={index}>{arrCells}</tr>
        }));
    }

    return (
        <div className="table">
            <h2>{props.name}</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {renderColumns(props.results)}
                    </tr>
                </thead>
                <tbody>
                    {renderRows(props.results)}
                </tbody>
            </Table>
        </div>
    );
}