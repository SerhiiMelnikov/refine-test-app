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

const priorityDisplayToApi: Record<Priority, string> = {
  "Very High": "very-high",
  High: "high",
  Medium: "medium",
  Low: "low",
  Pending: "pending",
};


interface IUser {
  id: string;
  fullName: string;
}

interface EditMeetingModalProps {
  open: boolean;
  onClose: () => void;
  meeting: {
    id: string;
    title: string;
    date?: string;
    priority: Priority;
    description?: string;
    invitedUserIds: string[];
  };
  onUpdate: (updatedMeeting: {
    id: string;
    title: string;
    date?: string;
    priority: Priority;
    description?: string;
    invitedUserIds: string[];
  }) => void;
}

export default function EditMeetingModal({ open, onClose, meeting, onUpdate }: EditMeetingModalProps) {
  const [title, setTitle] = useState(meeting.title);
  const [date, setDate] = useState(meeting.date || "");
  const [priority, setPriority] = useState<Priority>(meeting.priority);
  const [description, setDescription] = useState(meeting.description || "");
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: usersData, isLoading } = useList<IUser>({ resource: "users" });
  const users = usersData?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (users.length && meeting.invitedUserIds.length) {
      setSelectedUsers(users.filter((user) => meeting.invitedUserIds.includes(user.id)));
    }
  }, [users, meeting.invitedUserIds]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(true);
      return;
    }

    const invitedUserIds = selectedUsers.map((user) => user.id);

    onUpdate({
      id: meeting.id,
      title,
      date: date || undefined,
      priority: priorityDisplayToApi[priority] as Priority,
      description: description || undefined,
      invitedUserIds,
    });

    setError(false);
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
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Modal>,
    document.body,
  );
}
