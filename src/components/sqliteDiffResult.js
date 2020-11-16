import '../stylesheets/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function sqliteDiffResult(props) {
    return(
        <div className = "sql-diff">
            <h2>SQLite Diff Result</h2>
            <p>{props.content}</p>
        </div>
    );
}