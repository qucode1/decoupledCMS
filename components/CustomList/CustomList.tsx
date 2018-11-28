import React, { Component, Fragment } from "react";
import Link from "next/link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import WorkIcon from "@material-ui/icons/Work";
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";

import { cleanName } from "../../lib/helpers.js";

const styles = (theme: Theme) => createStyles({});

interface Project {
  __v: number;
  _id: string;
  models: Array<any>;
  name: string;
  owner: string;
  validOrigins: Array<any>;
}

interface Props extends WithStyles<typeof styles> {
  baseURL: string;
  deleteItem: any;
  edit: boolean;
  itemName: string;
  items: Project[];
  params?: any;
  icon?: string;
  entry?: string;
}

interface State {
  params: string;
}

interface Icons {
  project: JSX.Element;
  model: JSX.Element;
  document: JSX.Element;
}

class CustomList extends Component<Props, State> {
  state = {
    params: ""
  };
  icons: Icons = {
    project: <WorkIcon />,
    model: <FolderIcon />,
    document: <DescriptionIcon />
  };
  componentDidMount() {
    const { params } = this.props;
    if (params) {
      let temp = "";
      for (let name in params) {
        temp += `&${name}=${params[name]}`;
      }
      this.setState({
        params: temp
      });
    }
  }
  render() {
    const {
      classes,
      items,
      itemName = "",
      params,
      baseURL = "#",
      deleteItem,
      edit,
      icon = "project",
      entry
    } = this.props;
    return (
      <List>
        {items.map(item => (
          <Link
            href={`/${itemName}s/?${itemName}Id=${item._id}${this.state
              .params || ""}`}
            as={`${baseURL}/${item._id}`}
            key={item._id}
            prefetch
          >
            <ListItem button>
              <ListItemAvatar>
                <Avatar>{this.icons[icon as keyof Icons]}</Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={cleanName(item[entry as keyof Project] || item.name)}
              />

              <ListItemSecondaryAction>
                {edit && (
                  <Link
                    href={`/${itemName}s/edit?${itemName}Id=${item._id}${this
                      .state.params || ""}`}
                    as={`${baseURL}/${item._id}/edit`}
                    key={item._id}
                    prefetch
                  >
                    <IconButton aria-label="Delete">
                      <EditIcon color="secondary" />
                    </IconButton>
                  </Link>
                )}
                <IconButton
                  aria-label="Delete"
                  onClick={() => deleteItem(item._id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(CustomList);
