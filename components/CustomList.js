import React, { Component } from "react"
import Link from "next/link"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import FolderIcon from "@material-ui/icons/Folder"
import DescriptionIcon from "@material-ui/icons/Description"
import WorkIcon from "@material-ui/icons/Work"

class CustomList extends Component {
  icons = {
    project: <WorkIcon />,
    model: <FolderIcon />,
    document: <DescriptionIcon />
  }
  render() {
    const { items, baseURL = "#", deleteItem, icon = "project" } = this.props
    return (
      <List>
        {items.map(item => (
          <Link href={`${baseURL}/${item._id}`} key={item._id} prefetch>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>{this.icons[icon]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Delete"
                  onClick={() => deleteItem(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    )
  }
}

export default CustomList
