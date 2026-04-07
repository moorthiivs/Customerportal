import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Avatar } from "react-rainbow-components";

import "./Dashboard.css";
import SidebarItems from "../components/SidebarItems";
import bg from "../images/sea-bg.jpg";
import BodyContent from "../components/BodyContent";
import { AuthContext } from "../context/auth-context";
import { useContext } from "react";
import config from "../utils/config.json";
import packageconfig from '../../package.json'

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [certificateslist, setCertificatesList] = useState();

  let frontEndVersion = packageconfig?.version || '0.0.0';
  const [backEndVersion, setBackEndVersion] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const listcertificatesHandler = (value) => {

    const requestBody = {
      companyId: auth.companyId,
      labId: auth.labId,
      message: "hello",
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify(requestBody),
    };

    fetch(config.CustomerPortal.URL + "/api/certificate/list", requestOptions)
      .then(async (response) => {
        const data = await response.json();
        setCertificatesList(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(config.CustomerPortal.URL + "/api/heartbeat/check", requestOptions)
      .then(async (response) => {
        const data = await response.json();
        setBackEndVersion(data?.version || '0.0.0');
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          {/*<Breadcrumb breadcrumbs={breadcrumb} setpath={sbitemHandler} />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {/*<div className="tablist">
            <TabList tabcontrol={tabitemHandler} />
          </div>
          {/*<Typography variant="h6" noWrap>
              Mini variant drawer
            </Typography>*/}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className="inline-flex" style={{ backgroundImage: `url(${bg})` }}>
          <div className="user-info">
            <Avatar
              src={auth.lab_logo_filename ? `${config.CustomerPortal.URL}/images/${auth.lab_logo_filename}` : "images/CalibMaster_Logo2.png"}
              assistiveText="iviewsense"
              title={`iviewsense\nversion ${frontEndVersion}/${backEndVersion}`}
              size="large"
            />
            <div className="wrapped">
              <h1>{auth.name}</h1>
              <h2>{auth.role}</h2>
            </div>
          </div>
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
        </div>
        <Divider />
        <SidebarItems listcertificates={() => listcertificatesHandler()} />
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <BodyContent certificateslist={certificateslist} />
      </main>
    </div>
  );
}
