"use client";

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

export default function UserCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({});

  const roles = ["admin", "user"];

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box display={"flex"} gap={4}>
        <TextField
          {...register("firstName", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.firstName}
          helperText={(errors as any)?.firstName?.message}
          margin="normal"
          fullWidth
          type="text"
          label={"First Name"}
          name="firstName"
        />
        <TextField
          {...register("lastName", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.lastName}
          helperText={(errors as any)?.lastName?.message}
          margin="normal"
          fullWidth
          type="text"
          label={"Last Name"}
          name="lastName"
        />
      </Box>
      <Box display={"flex"} gap={4}>
        <TextField
          {...register("email", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.email}
          helperText={(errors as any)?.email?.message}
          margin="normal"
          fullWidth
          type="text"
          label={"Email"}
          name="email"
        />
        <TextField
          {...register("phone", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.phone}
          helperText={(errors as any)?.phone?.message}
          margin="normal"
          fullWidth
          type="text"
          label={"Phone"}
          name="phone"
        />
      </Box>
      <Box display={"flex"} gap={4}>
        <FormControl fullWidth margin="normal" error={!!(errors as any)?.role}>
          <InputLabel id="role-label">Role</InputLabel>
          <Controller
            name="role"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="role-label"
                label="Role"
                defaultValue=""
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{(errors as any)?.role?.message}</FormHelperText>
        </FormControl>
        <TextField
          {...register("password", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.password}
          helperText={(errors as any)?.password?.message}
          margin="normal"
          fullWidth
          type="text"
          label={"Password"}
          name="password"
        />
      </Box>
    </Create>
  );
}
