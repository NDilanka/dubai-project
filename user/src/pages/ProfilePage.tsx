import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../auth/src/context/UserContext";

export default function ProfilePage() {
  const userContext = useContext(UserContext);
  const [userData, setUserData] = useState({
    autoFXId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: ""
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    if (userContext?.user) {
      fetchUser(userContext.user._id);
    }
  }, [userContext?.user]);

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);

      if (response.ok) {
        const data = await response.json();

        setUserData({
          autoFXId: data.autoFXId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNo: data.phoneNumber,
        });
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Display an error message.
    }
  };

  const handleClickSaveChanges = async () => {
    if (!userContext?.user) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userContext.user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNo
        }),
        credentials: "include",
      });

      if (response.ok) {
        // TODO: Make a new route for updating one user - it should be like sign in
      } else {
        // TODO: Display an error.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Display an error.
    }
  };

  const handleClickChangePassword = async () => {
    if (!userContext?.user) {
      return;
    }

    try {
      const response = await fetch(`/api/change-password`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: userContext.user._id,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("////////////////");
        console.log(data);
        console.log("////////////////");
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);

      // TODO: Display an error.
    }
  };

  return (
    <Stack gap={4}>
      <Stack>
        <Typography variant="h5" alignSelf="center" mb={4}>
          <Box component="span" fontWeight="bold">AutoFX ID:</Box> {userData.autoFXId}
        </Typography>

        <TextField 
          type="text"
          margin="dense" 
          label="First Name" 
          value={userData.firstName}
          onChange={(e) => setUserData({...userData, firstName: e.target.value})}
        />

        <TextField 
          type="text"
          margin="dense" 
          label="Last Name" 
          value={userData.lastName}
          onChange={(e) => setUserData({...userData, lastName: e.target.value})}
        />

        <TextField 
          type="email"
          margin="dense" 
          label="Email" 
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
        />

        <TextField 
          type="tel"
          margin="dense" 
          label="Phone No" 
          value={userData.phoneNo}
          onChange={(e) => setUserData({...userData, phoneNo: e.target.value})}
        />


        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={handleClickSaveChanges}
        >
          Save Changes
        </Button>
      </Stack>

      <Stack>
        <TextField
          type="password"
          margin="dense"
          label="Old Password"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />

        <TextField
          type="password"
          margin="dense"
          label="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={handleClickChangePassword}
        >
          Change Password
        </Button>
      </Stack>
    </Stack>
  );
}
function ueState(arg0: {}): [any, any] {
    throw new Error("Function not implemented.");
}

