import React, { Component, Fragment } from "react"
import Link from "next/link"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import FolderIcon from "@material-ui/icons/Folder"
import DescriptionIcon from "@material-ui/icons/Description"
import WorkIcon from "@material-ui/icons/Work"
import { withStyles } from "@material-ui/core/styles"

import { cleanName } from "../lib/helpers.js"
const styles = theme => ({})

class CustomList extends Component {
  icons = {
    project: <WorkIcon />,
    model: <FolderIcon />,
    document: <DescriptionIcon />
  }
  render() {
    const {
      classes,
      items,
      baseURL = "#",
      deleteItem,
      edit,
      icon = "project",
      entry
    } = this.props
    return (
      <List>
        {items.map(item => (
          <Link href={`${baseURL}/${item._id}`} key={item._id} prefetch>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>{this.icons[icon]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={cleanName(item[entry] || item.name)} />
              <ListItemSecondaryAction>
                {edit && (
                  <Link
                    href={`${baseURL}/${item._id}/edit`}
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
    )
  }
}

export default withStyles(styles)(CustomList)
