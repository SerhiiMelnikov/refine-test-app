"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

interface IUser {
  id: number;
  role: string;
  fullName: string;
  email: string;
  phone: string;
}

export default function UsersList() {
  const { dataGridProps } = useDataGrid<IUser>();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 300,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "fullName",
        flex: 1,
        headerName: "Name",
        minWidth: 50,
        display: "flex",
      },
      {
        field: "email",
        flex: 1,
        headerName: "Email",
        minWidth: 50,
        display: "flex",
      },
      {
        field: "phone",
        flex: 1,
        headerName: "Phone",
        minWidth: 50,
        display: "flex",
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    [],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
}
