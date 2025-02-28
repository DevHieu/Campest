import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAuth } from "../../context/AuthProvider";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import { Link as RouteLink } from "react-router-dom";
import Alert from "@mui/material/Alert";

function Copyright() {
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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginPage() {
  const [cookies, setCookie] = useCookies(["token"]);
  const classes = useStyles();
  const url = import.meta.env.VITE_BACKEND_API;
  const navigateTo = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState(true);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (user !== null) {
      navigateTo("/");
    }
  }, []);

  const handleLogin = () => {
    if (email === "" || password === "") {
      setVerify(false);
      return;
    }

    axios
      .post(`${url}/signin`, {
        email: email,
        password: password,
      })
      .then(
        (response) => {
          if (remember) {
            setCookie("token", response.data.token, {
              path: "/",
              maxAge: 7 * 24 * 60 * 60, // The token's expiration date is 1 week
            });
          } else {
            setCookie("token", response.data.token, {
              path: "/",
              maxAge: 24 * 60 * 60, // The token's expiration date is 1 day
            });
          }
          navigateTo("/");
        },
        (error) => {
          setVerify(false);
        }
      );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          {!verify && (
            <Alert severity="error">Incorrect username or password.</Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            checked={remember}
            onChange={(e) => {
              setRemember(e.target.checked);
            }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
            sx={{ mt: 2, mb: 2 }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs sx={{ fontSize: 14 }}>
              <RouteLink to="/forgot" variant="body2">
                Forgot password?
              </RouteLink>
            </Grid>
            <Grid item sx={{ fontSize: 14 }}>
              <RouteLink to="/signup" variant="body2">
                Don't have an account? Sign Up
              </RouteLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
