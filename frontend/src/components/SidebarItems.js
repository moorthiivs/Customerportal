import "./SidebarItems.css";

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import {
  PowerSettingsNew,
  FileCopyRounded,
} from "@material-ui/icons";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function SidebarItems(props) {
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const signoutHandler = () => {
    auth.logout();
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <>
        <ListItem button onClick={props.listcertificates}>
          <ListItemIcon>
            <FileCopyRounded />
          </ListItemIcon>
          <ListItemText primary="Certificates" />
        </ListItem>
      </>
      <ListItem button onClick={signoutHandler}>
        <ListItemIcon>
          <PowerSettingsNew />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
}
