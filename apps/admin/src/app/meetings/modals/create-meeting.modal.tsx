import {
  Modal,
  TextField,
  MenuItem,
  Stack,
  Paper,
  Box,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useList } from "@refinedev/core";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const PRIORITIES = ["Very High", "High", "Medium", "Low", "Pending"] as const;
type Priority = typeof PRIORITIES[number];

interface IUser {
  id: string;
  fullName: string;
}

export default function CreateMeetingModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (meeting: {
    title: string;
    date?: string;
    priority: Priority;
    description?: string;
    invitedUserIds: string[];
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");  
  const [priority, setPriority] = useState<Priority>("Pending");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);


  const { data: usersData, isLoading } = useList<IUser>({
    resource: "users", 
  });

  const users = usersData?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const emptyState = () => {
    setTitle("");
    setError(false);
    setDate("");
    setTime("");
    setPriority("Pending");
    setDescription("");
    setSelectedUsers([]);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(true);
      return;
    }

    const invitedUserIds = selectedUsers.map((user) => user.id);

    const dateTime =
    date && time
      ? new Date(`${date}T${time}`).toISOString()
      : date
        ? new Date(`${date}T00:00:00`).toISOString()
        : undefined;

    onCreate({
      title,
      date: dateTime,
      priority,
      description: description || undefined,
      invitedUserIds,
    });

    emptyState();
    onClose();
  };


  if (!mounted) return null;

  return ReactDOM.createPortal(
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          p: 4,
          outline: "none",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error && e.target.value.trim()) {
                setError(false);
              }
            }}
            error={error}
            helperText={error ? "Title is required" : ""}
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.fullName}
            value={selectedUsers}
            onChange={(_, newValue) => setSelectedUsers(newValue)}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Invite Users"
                placeholder="Select users"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            fullWidth
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={() => {emptyState(); onClose();}}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Modal>,
    document.body,
  );
}
