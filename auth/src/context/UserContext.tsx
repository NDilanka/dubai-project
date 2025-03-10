import { createContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction} from "react";
import { checkAuth } from "../services/authService";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string; // TODO: Assign data to this. It has a bug.
  role: string;     // TODO: Add the role id as well. Maybe add other role data too.
  loaded: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkIfAlreadySignedIn();
  }, []);

  const checkIfAlreadySignedIn = async () => {
    const result = await checkAuth();

    setUser({
      _id: result.userData._id,
      firstName: result.userData.firstName,
      lastName: result.userData.lastName,
      email: result.userData.email,
      mobileNo: result.userData.mobileNo,
      loaded: true
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
