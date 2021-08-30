import React, {
  createContext,
  ReactNode,
  useState,
  VFC,
  useEffect,
} from "react";
import firebase from "firebase/app";

import { auth, db } from "../firebase";
import { LoginUser } from "../types/LoginUser";

type LoginUserContextType = {
  loginUser: LoginUser | null;
};

export const LoginUserContext = createContext({} as LoginUserContextType);

export const LoginUserProvider: VFC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    //firestoreにもつユーザー情報の取得
    const getUserData = async (user: firebase.User) => {
      const userDoc = await db.collection("users").doc(user.uid).get();
      const userData = userDoc.data() as LoginUser;
      return userData;
    };

    const unSub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const loginUser = await getUserData(user);
        setLoginUser(loginUser);
      }
    });
    return () => unSub();
  }, []);

  return (
    <LoginUserContext.Provider value={{ loginUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};