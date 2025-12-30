import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import GoogleLogo from "../../assets/google-icon.svg";
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
import Copyright from "../../components/Copyright";
import Alert from "@mui/material/Alert";
import { login } from "../../services/authService";
import { Divider } from "@mui/material";
import { Link as RouteLink } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState(true);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setVerify(false);
      return;
    }

    try {
      const res = await login({
        email: email,
        password: password,
      });

      console.log(res);

      if (remember) {
        setCookie("token", res.data, {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // The token's expiration date is 1 week
        });
      } else {
        setCookie("token", res.data, {
          path: "/",
          maxAge: 24 * 60 * 60, // The token's expiration date is 1 day
        });
      }
      navigateTo("/");
    } catch (error) {
      setVerify(false);
    }
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
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {!verify && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Email or password is incorrect
            </Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Button
            disabled={!email || !password}
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
          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <img
                src={GoogleLogo}
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
            }
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: 16,
              borderColor: "#ddd",
              color: "#444",
              py: 1,
              "&:hover": {
                borderColor: "#aaa",
                backgroundColor: "#f5f5f5",
              },
              mb: 3,
            }}
            onClick={() => {
              window.location.href = `${url}/oauth2/authorization/google`;
            }}
          >
            Sign in with Google
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
