import '../stylesheets/app.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        color: "white",
    },
    button : {
        color: "white",
        "border-color": "white",
    }
}));

//a react component that is the header 
export default function Header() {
    const classes = useStyles();
    return (
        <header className="header">
            <h1>SQLiteDiff</h1>
            <div className={classes.root}>
                <Button className = {classes.button} variant="outlined" href="https://course.ccs.neu.edu/cs3200f20s2/pol.html" target="_blank">CS3200</Button>
                <Button className = {classes.button} variant="outlined" href="https://github.com/yanDavid21/SQLiteDiff-Web-App" target="_blank">Source</Button>
            </div>
        </header>
    );
}