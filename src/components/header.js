import '../stylesheets/app.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        color: "white",
        ['@media (max-width:500px)']: {
            '& > *': {
                "font-size": ".2em",
            },
            display: "flex",
            "flex-direction": "column"
        },
        ['@media (min-width:500px)']: {
            '& > *': {
                margin: theme.spacing(1),
            },
            display: "flex",
            "flex-direction": "row",
            margin: theme.spacing(1),
        }
    },
    button: {
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
                <Button className={classes.button} variant="outlined" href="https://course.ccs.neu.edu/cs3200f20s2/pol.html" target="_blank">CS3200</Button>
                <Button className={classes.button} variant="outlined" href="https://github.com/yanDavid21/SQLiteDiff-Web-App" target="_blank">Source</Button>
            </div>
        </header>
    );
}