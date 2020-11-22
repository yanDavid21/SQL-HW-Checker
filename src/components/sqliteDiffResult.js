import '../stylesheets/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function sqliteDiffResult(props) {
    let content = props.loading ? <div className="spin-Container"> <CircularProgress /></div>
        : <p>{props.content}</p>
    return (
        <div className="sql-diff" style = {{color: props.bgColor}}>
            <h2>SQLite Diff Result</h2>
            <Divider />
            <div>
               {content}
            </div>
        </div>
    );
}