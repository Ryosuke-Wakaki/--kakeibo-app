import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import * as Icons from "@mui/icons-material";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
<div style={{ width: 200, background: "#f5f5f5", height: "100vh"}}>
    <ListItemButton component={Link} to="/">
      <ListItemIcon><Icons.Home /></ListItemIcon>
      <ListItemText primary="Home" />
    </ListItemButton>

    <ListItemButton component={Link} to="/report">
      <ListItemIcon><Icons.BarChart /></ListItemIcon>
      <ListItemText primary="Report" />
    </ListItemButton>
  </div>
  )
  
};
