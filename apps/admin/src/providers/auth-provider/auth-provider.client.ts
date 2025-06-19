"use client";

import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import Cookies from "js-cookie";

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-admin`, {
        email,
        password,
      });

      const { user, accessToken } = response.data;

      if (!user || !accessToken) {
        throw new Error("Invalid response from server");
      }

      Cookies.set("auth", JSON.stringify({ user, accessToken }), {
        expires: 30,
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message:
          error.response?.data?.message ||
          error.message ||
          "Login failed",
        },
      };
    }
  },

  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
