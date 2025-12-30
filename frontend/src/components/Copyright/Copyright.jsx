import { Typography } from "@mui/material";
import { Link as RouteLink } from "react-router-dom";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <RouteLink to="/" color="inherit">
        Campest
      </RouteLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
