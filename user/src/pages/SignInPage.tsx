import { Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Slide, TextField,
  Typography, useTheme } from "@mui/material";
import { useRef, useState, useContext, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from "../../../context/UserContext";

export default function SignInPage() {
const theme = useTheme();
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
      navigate("/", { replace: true });
    }
  }, [userContext, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await signIn(signInFormData);

    if (response.success) {
      setShowPopUp(true);
      setTimeout(() => {
        setShowPopUp(false);
        setTimeout(() => navigate("/", { replace: true }), 1000);
      }, 1000);
    }
  };

  const handleBackClick = () => navigate(-1);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Alert notification */}
      <Box sx={{ 
        position: "fixed",
        top: theme.spacing(2),
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 400,
        zIndex: theme.zIndex.modal
      }}>
        <Slide in={showPopUp} direction="down">
          <Alert severity="success" sx={{ width: "100%" }}>
            Sign in successful!
          </Alert>
        </Slide>
      </Box>

      {/* Main container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* Back button */}
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "fixed",
            left: { xs: theme.spacing(1), md: theme.spacing(2) },
            top: { xs: theme.spacing(1), md: theme.spacing(2) },
            zIndex: theme.zIndex.appBar,
            color: theme.palette.text.primary
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Form container */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: { xs: '100%', sm: 400 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Email field */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            sx={{ 
              mb: 1,
              '& .MuiInputBase-root': {
                height: { xs: 48, md: 56 }
              }
            }}
            value={signInFormData.email}
            onChange={(e) => setSignInData({ ...signInFormData, email: e.target.value })}
          />

          {/* Password field */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            sx={{ 
              mb: 1,
              '& .MuiInputBase-root': {
                height: { xs: 48, md: 56 }
              }
            }}
            value={signInFormData.password}
            onChange={(e) => setSignInData({ ...signInFormData, password: e.target.value })}
          />

          {/* Checkbox */}
          <FormGroup
            sx={{ 
              width: "100%",
              mt: 1,
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" color="primary" />}
              label="Agree to terms and conditions"
            />
          </FormGroup>

          {/* Submit button */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Sign In
          </Button>

          {/* Sign up link */}
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: { xs: 2, md: 3 },
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Don't have an account?
          </Typography>

          <Button
            fullWidth
            component={Link}
            variant="outlined"
            to="/sign-up"
            sx={{
              mt: 1,
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
}