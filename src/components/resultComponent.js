import '../stylesheets/app.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

//react component that holds tables, the tables will be automatically populated when data 
//in the format of an array of objects, and every key of an object will be made into a column header
export default function resultComponent(props) {

    let columnHeaders = new Set();
    let arrColumnHeaders = [];

    //renders the column headers for the table by extracting all keys from all objects
    //returns an array of table cells containing the column header
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
                return <TableCell key={header}>{header}</TableCell>
            })
        );
    }

    //renders the rows, return a row of table cells for every header return the value where the object's key matches the header
    function renderRows(results) {
        return (results.map((result, index) => {
            let arrCells = [];
            columnHeaders.forEach(header => {
                arrCells.push(<TableCell key={index + "" + header}>{result[header]}</TableCell>);
            })
            return <TableRow key={index}>{arrCells}</TableRow>
        }));
    }

    //if the props.loading returns true, then have a loading animation, otherwise have a table there
    let content = props.loading ? <div className="spin-Container"><CircularProgress /> </div>:
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {renderColumns(props.results)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderRows(props.results)}
                </TableBody>
            </Table>
        </TableContainer>
    return (
        <div className="table" id={props.id}>
            <h2>{props.name}</h2>
            <Divider />
            {content}
        </div>
    );
}