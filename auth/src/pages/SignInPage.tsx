import { Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Slide, TextField,
         Typography } from "@mui/material";
import {  useRef, useState, useContext, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from "../../../auth/src/context/UserContext";

export default function SignInPage() {
  const navigate = useNavigate();
  const [signInFormData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext && userContext.user) {
      window.location.href = "/";
    }
  }, [userContext]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await signIn(signInFormData);

    if (response.success) {
      setShowPopUp(true);

      setTimeout(() => {
        setShowPopUp(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }, 1000);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <Slide in={showPopUp} container={containerRef.current}>
          <Alert severity="success">Sign up successfull!</Alert>
        </Slide>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "absolute",
            left: "16px",
            top: "16px",
            zIndex: 1,
            color: "white",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "40rem",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={signInFormData.email}
            onChange={(e) => setSignInData({ ...signInFormData, email: e.target.value })}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={signInFormData.password}
            onChange={(e) => setSignInData({ ...signInFormData, password: e.target.value })}
          />

          <Button variant="contained" type="submit">
            Sign In
          </Button>

          <Typography mx="auto">Don't have an account?</Typography>

          <Button component={Link} variant="outlined" to="/sign-up">
            Sign Up
          </Button>
        </form>
      </Box>
    </>
  );
}
