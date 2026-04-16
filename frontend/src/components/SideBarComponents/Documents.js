import { useEffect, useState } from "react";
import "./Documents.css";
import config from "../../utils/config";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import { PeopleAltOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { AuthContext } from "../../context/auth-context";
import { useContext } from "react";
import {
  PersonOutlineOutlined,
  PictureAsPdfOutlined,
} from "@material-ui/icons";

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
const Documents = ({ currentItemHandler }) => {
  //console.log(props.menu);
  const [menu, setMenu] = useState();
  const [open, setOpen] = useState([false, false]);
  const [copen, setcOpen] = useState();
  const [current, setCurrent] = useState("Home");
  const classes = useStyles();
  const auth = useContext(AuthContext);
  let icons = {
    PeopleAltOutlined: PeopleAltOutlined,
    InboxIcon: InboxIcon,
    DraftsIcon: DraftsIcon,
    StarBorder: StarBorder,
    PersonOutlineOutlined: PersonOutlineOutlined,
    PictureAsPdfOutlined: PictureAsPdfOutlined,
  };

  useEffect(() => {
    currentItemHandler(current);
  }, [current, currentItemHandler]);

  useEffect(() => {
    let opens = [...open];
    if (copen) {
      const spliter = copen.split("/");
      const index = parseInt(spliter[0]);
      let openitem = opens[index];
      openitem = !openitem;
      opens[index] = openitem;
      setOpen(opens);
    }
  }, [copen, open]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(config.CustomerPortal.URL + "/api/resources/getMenu", requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
        setMenu(data.menu);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let items;
  if (menu) {
    items = menu.menuStructure.menuList.map((v, i) => {
      let Enclass = "disabled";
      let menuEnabled = false;

      if (v.menuStatus === "E") {
        Enclass = "enabled";
        menuEnabled = true;
      } else {
        Enclass = "disabled";
        menuEnabled = false;
      }
      var colitems = v.menuDtls.map((val, ind) => {
        let subEnclass = "disabled";
        let submenuEnabled = false;
        if (val.subMenuStatus === "E") {
          subEnclass = "enabled";
          submenuEnabled = true;
        } else {
          subEnclass = "disabled";
          submenuEnabled = false;
        }
        let subiconName = val.subMenuIcon;
        let SubIcon = icons[subiconName];
        return (
          <div className={subEnclass} key={ind}>
            <ListItem
              button
              key={ind}
              className={classes.nested}
              onClick={
                submenuEnabled
                  ? () =>
                    setCurrent(
                      v.menuName +
                      "/" +
                      val.subMenuName +
                      "," +
                      val.subMenuComponent
                    )
                  : () => { }
              }
            >
              <ListItemIcon>
                <SubIcon />
              </ListItemIcon>
              <ListItemText primary={val.subMenuName} />
            </ListItem>
          </div>
        );
      });
      let menuIconname = v.menuIcon;
      let MenuIcon = icons[menuIconname];

      return (
        <div key={i} className={Enclass}>
          <ListItem key={i}
            button
            onClick={
              menuEnabled
                ? () => setcOpen(i.toString() + "/" + open[i])
                : () => { }
            }
          >
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary={v.menuName} />
            {open[i] ? (
              <ExpandLess
                onClick={
                  menuEnabled
                    ? () => setcOpen(i.toString() + "/" + open[i])
                    : () => { }
                }
              />
            ) : (
              <ExpandMore
                onClick={
                  menuEnabled
                    ? () => setcOpen(i.toString() + "/" + open[i])
                    : () => { }
                }
              />
            )}
          </ListItem>
          <Collapse in={open[i]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {colitems}
            </List>
          </Collapse>
        </div>
      );
    });
  }
  return (
    <>
      {menu ? items[0] : null}
      {menu && auth.role === 'admin' ? items[1] : null}

    </>
  );
};

export default Documents;
