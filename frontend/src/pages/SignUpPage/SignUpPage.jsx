import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { useAuth } from "../../context/AuthProvider";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const [cookies, setCookie] = useCookies(["token"]);
  const navigateTo = useNavigate();
  const { user } = useAuth();
  const classes = useStyles();
  const url = import.meta.env.VITE_BACKEND_API;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyUser, setVerifyUser] = useState(true); //Check username is invalid or not
  const [verifyEmail, setVerifyEmail] = useState(true); //Check email is invalid or not
  const [verifyPassword, setVerifyPassword] = useState(true); //Check password is invalid or not
  const debouncedEmail = useDebounce(email, 700);

  useEffect(() => {
    if (user !== null) {
      navigateTo("/");
    }
  }, []);

  useEffect(() => {
    if (email === "") {
      setVerifyEmail(true);
    }

    if (debouncedEmail) {
      if (emailRegex.test(email)) {
        setVerifyEmail(true);
      } else {
        setVerifyEmail(false);
      }
    }
  }, [debouncedEmail]);

  const handleResponse = (res) => {
    setCookie("token", res.data.token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // The token's expiration date is 1 week
    });
    navigateTo("/");
  };

  const sendSignUp = () => {
    setVerifyUser(true);
    setVerifyEmail(true);
    setVerifyPassword(true);
    if (username === "" || email === "" || password === "" || !verifyEmail) {
      setVerifyUser(!username === "");
      setVerifyEmail(!email === "");
      setVerifyPassword(!password === "");
      return 0;
    }

    axios
      .post(`${url}/signup`, {
        username: username,
        email: email,
        password: password,
      })
      .then(
        (response) => {
          handleResponse(response);
        },
        (error) => {
          setVerifyEmail(false);
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
          Sign up
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="User name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="User name"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                error={!verifyUser}
                helperText={verifyUser ? "" : "Username is invalid"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={!verifyEmail}
                helperText={
                  verifyEmail ? "" : "Email is invalid or already taken"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
                error={!verifyPassword}
                helperText={verifyPassword ? "" : "Password is invalid"}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              /> */}
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            sx={{ mt: 3, mb: 2 }}
            onClick={sendSignUp}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouteLink to="/login" variant="body2">
                Already have an account? Sign in?
              </RouteLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
