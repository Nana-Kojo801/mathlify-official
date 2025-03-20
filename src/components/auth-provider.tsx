/* eslint-disable react-refresh/only-export-components */
import type { AuthContext, User } from "@/lib/types";
import { authSchema } from "@/lib/validators";
import { useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import { toast } from "sonner";
import { addUser, updateUser } from "@/lib/api/users";
import { useLocation, useNavigate } from "react-router";
import { db } from "@/lib/dexie";
import { refereshFriends } from "@/lib/api/friends";
import { useNetworkState } from "react-use"

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const convex = useConvex();
  const navigate = useNavigate();
  const network = useNetworkState()
  const initCalled = useRef(false);

  const signup = async (values: z.infer<typeof authSchema>) => {
    try {
      const existingUser = await convex.query(api.users.getUserByUsername, {
        username: values.username,
      });

      if (existingUser) {
        toast.error("Username is not available");
      } else {
        const newUser = (await convex.mutation(
          api.users.createUser,
          values
        )) as User;

        setUser(newUser);
        setAuthenticated(true);
        await addUser(newUser);
        navigate("/app");
      }
    } catch (error) {
      toast.error("Error signing up");
      console.error(error);
    }
  };

  const login = async (values: z.infer<typeof authSchema>) => {
    try {
      const user = await convex.query(api.users.getUserByUsername, {
        username: values.username,
      });

      if (!user) {
        toast.error("Username does not exist");
      } else if (user.password === values.password) {
        setUser(user);
        setAuthenticated(true);
        await addUser(user);
        navigate("/app");
      } else {
        toast.error("Invalid user credentials");
      }
    } catch (error) {
      toast.error("Error logging in");
      console.error(error);
    }
  };

  const logout = async () => {
    setAuthenticated(false);
    setUser(null);
    await db.users.clear(); // Clear local user data
    navigate("/");
  };

  const updateAuthUser = async (patch: Partial<User>) => {
    try {
      if (!user) return;
      const updatedAt = new Date().toISOString();
      const updatedUser = { ...user, ...patch, updatedAt };

      setUser(updatedUser);
      await Promise.all([
        updateUser(user._id, updatedUser),
        convex.mutation(api.users.updateUser, {
          id: user._id,
          ...patch,
          updatedAt,
        }),
      ]);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const syncFriends = async (user: User) => {
    try {
      if(!network.online) return
      const friends = await convex.query(api.users.getFriends, {
        userId: user._id,
      });
      await refereshFriends(friends);
    } catch (error) {
      console.error("Error syncing friends:", error);
    }
  };

  const syncUser = async (): Promise<User | null> => {
    try {
      const localUser = (await db.users.toArray())[0];
      if (!localUser) return null;

      if(!network.online) return localUser

      const onlineUser = (await convex.query(api.users.getUser, {
        id: localUser._id,
      })) as User | null;

      if (!onlineUser) {
        console.warn("User missing from Convex, keeping local data.");
        return localUser;
      }

      const isLocalNewer =
        new Date(localUser.updatedAt).getTime() >
        new Date(onlineUser.updatedAt).getTime();

      if (isLocalNewer) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, _creationTime, ...patch } = localUser;
        await convex.mutation(api.users.updateUser, {
          id: localUser._id,
          ...patch,
        });
        return localUser;
      } else {
        await updateUser(onlineUser._id, onlineUser);
        return onlineUser;
      }
    } catch (error) {
      console.error("Error syncing user:", error);
      return null;
    }
  };

  const init = useCallback(async () => {
    if (initCalled.current) return;
    initCalled.current = true;
    setLoading(true);
    const user = await syncUser();
    if (user) {
      await syncFriends(user);
      setUser(user);
      setAuthenticated(true);
      if (location.pathname === "/") navigate("/app");
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;

    let interval: NodeJS.Timeout;

    const updatePresence = async () => {
      await convex.mutation(api.users.updateUser, {
        id: user._id,
        isOnline: true,
      });
    };

    const setOffline = async () => {
      await convex.mutation(api.users.updateUser, {
        id: user._id,
        isOnline: false,
      });
    };

    // Send presence update every 15 seconds
    updatePresence();
    interval = setInterval(updatePresence, 15000); // 15s polling

    // Set offline when the user leaves
    window.addEventListener("beforeunload", setOffline);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", setOffline);
      setOffline(); // Mark offline when component unmounts
    };
  }, [convex, user]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user: user as User,
        updateAuthUser,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;

export default AuthProvider;
