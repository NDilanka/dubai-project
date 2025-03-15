import { Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, Slide, TextField, Select, 
         MenuItem, InputLabel, FormControl, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  const containerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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
          navigate("/", { replace: true });
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
          <Alert severity="success">Sign up successful!</Alert>
        </Slide>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          position: "relative",
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

        <Box component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "40rem",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="First Name"
            variant="outlined"
            type="text"
            value={signUpFormData.firstName}
            onChange={(e) =>
              setSignInFormData({ ...signUpFormData, firstName: e.target.value })
            }
          />

          <TextField
            label="Last Name"
            variant="outlined"
            type="text"
            value={signUpFormData.lastName}
            onChange={(e) =>
              setSignInFormData({ ...signUpFormData, lastName: e.target.value })
            }
          />

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={signUpFormData.email}
            onChange={(e) =>
              setSignInFormData({ ...signUpFormData, email: e.target.value })
            }
          />

          <TextField
            label="Phone No"
            variant="outlined"
            type="tel"
            value={signUpFormData.phoneNo}
            onChange={(e) =>
              setSignInFormData({ ...signUpFormData, phoneNo: e.target.value })
            }
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={signUpFormData.password}
            onChange={(e) =>
              setSignInFormData({ ...signUpFormData, password: e.target.value })
            }
          />

          <FormControl variant="outlined" fullWidth>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              value={signUpFormData.currency}
              onChange={(e) =>
                setSignInFormData({ ...signUpFormData, currency: e.target.value })
              }
              label="Currency"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="CAD">CAD</MenuItem>
              <MenuItem value="INR">CAD</MenuItem>
            </Select>
          </FormControl>

          <FormGroup sx={{ marginLeft: "auto" }}>
            <FormControlLabel
              required
              control={<Checkbox />}
              label="Agree to terms and conditions"
            />
          </FormGroup>

          <Button variant="contained" type="submit">
            Sign Up
          </Button>

          <Typography mx="auto">Already have an account?</Typography>

          <Button variant="outlined">
            Sign In
          </Button>
        </Box>
      </Box>
    </>
  );
}
