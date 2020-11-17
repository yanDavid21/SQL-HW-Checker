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
                return <TableCell key={header}>{header}</TableCell>
            })
        );
    }

    function renderRows(results) {
        return (results.map((result, index) => {
            let arrCells = [];
            columnHeaders.forEach(header => {
                arrCells.push(<TableCell key={index + "" + header}>{result[header]}</TableCell>);
            })
            return <TableRow key={index}>{arrCells}</TableRow>
        }));
    }

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