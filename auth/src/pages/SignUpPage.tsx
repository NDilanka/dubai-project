import {
  Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, Slide, TextField,
  Select, MenuItem, InputLabel, FormControl, IconButton, Typography
} from "@mui/material";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [signUpFormData, setSignInFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    currency: "",
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const result = await signUp({
      firstName: signUpFormData.firstName,
      lastName: signUpFormData.lastName,
      email: signUpFormData.email,
      password: signUpFormData.password,
      phoneNo: signUpFormData.phoneNo,
      currency: signUpFormData.currency
    });

    if (result.success) {
      setShowPopUp(true);
      setTimeout(() => {
        setShowPopUp(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }, 1000);
    } else {
      setLoading(false);
      alert(result.message);
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
          p: 2,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "absolute",
            left: { xs: 1, sm: 2 },
            top: { xs: 1, sm: 2 },
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
            width: { xs: "100%", sm: "90%", md: "40rem" },
            maxWidth: "40rem",
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            boxShadow: { xs: 0, sm: 3 },
          }}
          onSubmit={handleSubmit}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.4rem' },
              mb: { xs: 2, sm: 4 }
            }}
          >
            Create New UCoin account
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="First Name"
              variant="outlined"
              type="text"
              size="small"
              fullWidth
              sx={{ '& .MuiInputBase-root': { height: { xs: 48, sm: 56 } } }}
              value={signUpFormData.firstName}
              onChange={(e) => setSignInFormData({ ...signUpFormData, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              size="small"
              fullWidth
              sx={{ '& .MuiInputBase-root': { height: { xs: 48, sm: 56 } } }}
              value={signUpFormData.lastName}
              onChange={(e) => setSignInFormData({ ...signUpFormData, lastName: e.target.value })}
            />
          </Box>

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { height: { xs: 48, sm: 56 } } }}
            value={signUpFormData.email}
            onChange={(e) => setSignInFormData({ ...signUpFormData, email: e.target.value })}
          />

          <TextField
            label="Phone No"
            variant="outlined"
            type="tel"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { height: { xs: 48, sm: 56 } } }}
            value={signUpFormData.phoneNo}
            onChange={(e) => setSignInFormData({ ...signUpFormData, phoneNo: e.target.value })}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { height: { xs: 48, sm: 56 } } }}
            value={signUpFormData.password}
            onChange={(e) => setSignInFormData({ ...signUpFormData, password: e.target.value })}
          />

          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              value={signUpFormData.currency}
              onChange={(e) => setSignInFormData({ ...signUpFormData, currency: e.target.value })}
              label="Currency"
              sx={{ '& .MuiSelect-select': { height: { xs: '48px !important', sm: '56px !important' } } }}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="CAD">CAD</MenuItem>
              <MenuItem value="CAD">INR</MenuItem>
            </Select>
          </FormControl>

          <FormGroup sx={{ my: 1 }}>
            <FormControlLabel
              required
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Agree to terms and conditions
                </Typography>
              }
            />
          </FormGroup>

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              height: { xs: 48, sm: 56 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <Box textAlign="center" mt={1}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Already have an account?
            </Typography>
            <Button
              component={Link}
              to="/sign-in"
              variant="outlined"
              fullWidth
              sx={{
                height: { xs: 48, sm: 56 },
                mt: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}