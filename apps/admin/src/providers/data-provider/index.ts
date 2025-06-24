"use client";

import type { DataProvider } from "@refinedev/core";
import dataProviderNestjsxCrud from "@refinedev/nestjsx-crud";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const baseProvider = dataProviderNestjsxCrud(API_URL);

const getAuthHeader = () => {
  const auth = Cookies.get("auth");
  if (auth) {
    const parsed = JSON.parse(auth);
    if (parsed.accessToken) {
      return {
        Authorization: `Bearer ${parsed.accessToken}`,
      };
    }
  }
  return {};
};

export const dataProvider: DataProvider = {
  ...baseProvider,

  create: async ({ resource, variables }) => {
    const response = await axios.post(
      `${API_URL}/${resource}/create`,
      variables,
      {
        headers: getAuthHeader(),
      },
    );
    return {
      data: response.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const response = await axios.put(
      `${API_URL}/${resource}/update/${id}`,
      variables,
      {
        headers: getAuthHeader(),
      },
    );
    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await axios.delete(`${API_URL}/${resource}/delete/${id}`, {
      headers: getAuthHeader(),
    });
    return { data: response.data };
  },
};
