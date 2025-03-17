import {
  Alert, Box, Button, IconButton, Slide, TextField,
  Typography
} from "@mui/material";
import { useRef, useState, useContext, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const response = await signIn(signInFormData);

    if (response.success) {
      setShowPopUp(true);

      setTimeout(() => {
        setShowPopUp(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }, 1000);
    } else {
      setLoading(false);
      alert(response.message);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <Slide in={showPopUp} container={containerRef.current}>
          <Alert severity="success">Sign up successful!</Alert>
        </Slide>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2, // Added padding for mobile
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "absolute",
            left: { xs: 1, sm: 2 }, // Responsive left positioning
            top: { xs: 1, sm: 2 },  // Responsive top positioning
            zIndex: 1,
            color: "text.primary",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: { xs: "100%", sm: "90%", md: "40rem" }, // Responsive width
            maxWidth: "40rem",
            p: { xs: 2, sm: 4 }, // Responsive padding
            borderRadius: 2,
            boxShadow: { xs: 0, sm: 3 }, // Shadow only on larger screens
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.4rem' }, // Responsive font size
              mb: { xs: 2, sm: 4 }
            }}
          >
            Sign Into UCoin
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: 48, sm: 56 } // Responsive input height
              }
            }}
            value={signInFormData.email}
            onChange={(e) => setSignInData({ ...signInFormData, email: e.target.value })}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: 48, sm: 56 } // Consistent height with email field
              }
            }}
            value={signInFormData.password}
            onChange={(e) => setSignInData({ ...signInFormData, password: e.target.value })}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              height: { xs: 48, sm: 56 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>

          <Typography mx="auto" textAlign="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Don't have an account?
          </Typography>

          <Button
            component={Link}
            variant="outlined"
            to="/sign-up"
            sx={{
              height: { xs: 48, sm: 56 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </>
  );
}