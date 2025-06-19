"use client";

import type { DataProvider } from "@refinedev/core";
import dataProviderNestjsxCrud from "@refinedev/nestjsx-crud";
import axios from "axios";

const baseProvider = dataProviderNestjsxCrud(process.env.NEXT_PUBLIC_API_URL || "");

export const dataProvider: DataProvider = {
  ...baseProvider,

  create: async ({ resource, variables }) => {
    if (resource === "users") {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/create`, variables);
      return {
        data: response.data,
      };
    }

    return baseProvider.create!({ resource, variables });
  },

  update: async ({ resource, id, variables }) => {
    if (resource === "users") {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`,
        variables,
      );
      return { data: response.data };
    }

    return baseProvider.update!({ resource, id, variables });
  },

  deleteOne: async ({ resource, id, meta }) => {
    if (resource === "users") {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/delete/${id}`);
      return { data: response.data };
    }

    return baseProvider.deleteOne!({ resource, id, meta });
  },
};
