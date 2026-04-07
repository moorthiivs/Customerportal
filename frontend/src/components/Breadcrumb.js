import "./Breadcrumb.css";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export default function Breadcrumb(props) {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Typography
        key={props.breadcrumbs}
        color="textPrimary"
        className={classes.link}
      >
        {props.breadcrumbs}
      </Typography>
    </Breadcrumbs>
  );
}
