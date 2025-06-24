"use client";

import { PlusIcon } from "@components/icons/plus.icon";
import { SearchIcon } from "@components/icons/search.icon";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreVert } from "@mui/icons-material";
import { Box, Card, CardContent, Typography, Paper, Button, Grid2, DialogTitle, Dialog, DialogActions, Menu, MenuItem, IconButton ,
} from "@mui/material";
import { useCreate, useDelete, useList, useUpdate } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import CreateMeetingModal from "./modals/create-meeting.modal";
import EditMeetingModal from "./modals/edit-meeting.modal"; 

const PRIORITIES = ["Very High", "High", "Medium", "Low", "Pending"] as const;
type Priority = typeof PRIORITIES[number];

interface IMeeting {
  id: string;
  title: string;
  priority: Priority;
  description?: string;
  date?: Date;
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  }
  invitedUserIds: string[];
}

const priorityDisplayToApi: Record<Priority, string> = {
  "Very High": "very-high",
  High: "high",
  Medium: "medium",
  Low: "low",
  Pending: "pending",
};

const priorityApiToDisplay: Record<string, Priority> = {
  "very-high": "Very High",
  "high": "High",
  "medium": "Medium",
  "low": "Low",
  "pending": "Pending",
};

export default function MeetingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, refetch } = useList<IMeeting>({ resource: "meetings" });
  const { mutate: updateMeeting } = useUpdate<IMeeting>();
  const { mutate: createMeeting } = useCreate<IMeeting>();

  const [meetingsByPriority, setMeetingsByPriority] = useState<
    Record<Priority, IMeeting[]>
  >({
    "Very High": [],
    High: [],
    Medium: [],
    Low: [],
    Pending: [],
  });

  useEffect(() => {
    if (data?.data) {
      const grouped: Record<Priority, IMeeting[]> = {
        "Very High": [],
        High: [],
        Medium: [],
        Low: [],
        Pending: [],
      };

      data.data.forEach((m) => {
        const displayPriority = priorityApiToDisplay[
          String(m.priority).toLowerCase()
        ];
        if (displayPriority) {
          grouped[displayPriority].push({ ...m, priority: displayPriority });
        }
      });

      setMeetingsByPriority(grouped);
    }
  }, [data]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<Priority | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
    const container = PRIORITIES.find((p) =>
      meetingsByPriority[p].some((m) => m.id === id),
    );
    setActiveContainer(container ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const source = PRIORITIES.find((p) =>
      meetingsByPriority[p].some((m) => m.id === activeId),
    );
    if (!source) return;

    const isOverColumn = PRIORITIES.includes(overId as Priority);
    const destContainer = isOverColumn
      ? (overId as Priority)
      : PRIORITIES.find((p) =>
        meetingsByPriority[p].some((m) => m.id === overId),
      );
    if (!destContainer) return;

    const sourceItems = meetingsByPriority[source];
    const destItems = meetingsByPriority[destContainer];
    const sourceIndex = sourceItems.findIndex((m) => m.id === activeId);

    if (sourceIndex !== -1 && source !== destContainer) {
      setMeetingsByPriority((prev) => {
        const next = { ...prev };
        next[source] = next[source].filter((m) => m.id !== activeId);

        let insertAt = next[destContainer].length;
        if (!isOverColumn) {
          const idx = destItems.findIndex((m) => m.id === overId);
          if (idx !== -1) insertAt = idx;
        }

        next[destContainer] = [
          ...next[destContainer].slice(0, insertAt),
          prev[source].find((m) => m.id === activeId)!,
          ...next[destContainer].slice(insertAt),
        ];

        return next;
      });
      setActiveContainer(destContainer);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveContainer(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const destContainer =
      PRIORITIES.find((p) =>
        meetingsByPriority[p].some((m) => m.id === overId),
      ) ?? (PRIORITIES.includes(overId as Priority) ? (overId as Priority) : undefined);
    if (!destContainer) return;

    const originalContainer = PRIORITIES.find((p) =>
      data?.data?.some(
        (m) =>
          m.id === activeId &&
          priorityApiToDisplay[String(m.priority).toLowerCase()] === p,
      ),
    );

    if (originalContainer !== destContainer) {
      updateMeeting({
        resource: "meetings",
        id: activeId,
        values: { priority: priorityDisplayToApi[destContainer] },
      });
    }

    setMeetingsByPriority((prev) => {
      const next = { ...prev };
      PRIORITIES.forEach((p) => {
        next[p] = next[p].filter((m) => m.id !== activeId);
      });
      const dropIndex = next[destContainer].findIndex((m) => m.id === overId);
      const moved =
        data?.data?.find((m) => m.id === activeId) || {
          id: activeId,
          title: "",
          priority: destContainer,
          invitedUserIds: [],
        };
      if (dropIndex === -1) {
        next[destContainer] = [
          ...next[destContainer],
          { ...moved, priority: destContainer },
        ];
      } else {
        next[destContainer] = [
          ...next[destContainer].slice(0, dropIndex),
          { ...moved, priority: destContainer },
          ...next[destContainer].slice(dropIndex),
        ];
      }
      return next;
    });
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveContainer(null);
  };

  const handleCreateMeeting = (newMeeting: {
    title: string;
    date?: string;
    priority: Priority;
    description?: string;
    invitedUserIds: string[];
  }) => {
    createMeeting(
      {
        resource: "meetings",
        values: {
          title: newMeeting.title,
          date: newMeeting.date,
          priority: priorityDisplayToApi[newMeeting.priority],
          description: newMeeting.description,
          invitedUserIds: newMeeting.invitedUserIds,
        },
      },
      {
        onSuccess: () => {
          refetch?.();
          setIsModalOpen(false);
        },
      },
    );
  };

  const activeMeeting = activeId
    ? PRIORITIES.reduce<IMeeting | undefined>((found, priority) => {
      return (
        found ?? meetingsByPriority[priority].find((m) => m.id === activeId)
      );
    }, undefined)
    : undefined;

  return (
    <Box p={2} height="calc(100vh - 80px)" display="flex" flexDirection="column">
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button sx={{ minWidth: 15, borderRadius: "50%" }} onClick={() => setIsModalOpen(true)}>
          <SearchIcon />
        </Button>
        <Button sx={{ minWidth: 15, borderRadius: "50%" }} onClick={() => setIsModalOpen(true)}>
          <PlusIcon />
        </Button>
      </Box>

      <Box flexGrow={1} overflow="hidden" sx={{}}>
        <DndContext  
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          
        >
          <Grid2 container sx={{ height: "100%", margin: 0, display: "flex", gap: "8px" }}>
            {PRIORITIES.map((priority) => (
              <Grid2
                key={priority}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Column
                  id={priority}
                  title={priority}
                  meetings={meetingsByPriority[priority]}
                  isOver={activeContainer === priority}
                  isEmpty={meetingsByPriority[priority].length === 0}
                />
              </Grid2>
            ))}
          </Grid2>

          <DragOverlay>
            {activeMeeting ? (
              <Card
                sx={{
                  backgroundColor: "rgb(244, 244, 244)",
                  borderRadius: 2,
                  boxShadow: 6,
                  cursor: "grabbing",
                  pointerEvents: "none",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{activeMeeting.title}</Typography>
                  <Box py={2} px={1} mt={1} borderRadius={1} sx={{ backgroundColor: "#fff" }}>
                    <Typography>{activeMeeting.description}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="caption">
                      {activeMeeting.date ? new Date(activeMeeting.date).toDateString() : ""}
                    </Typography>
                    <Typography variant="caption">{activeMeeting.createdBy?.fullName}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>
      <CreateMeetingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateMeeting}
      />
    </Box>
    
  );
}

function Column({
  id,
  title,
  meetings,
  isOver,
}: {
  id: string;
  title: string;
  meetings: IMeeting[];
  isOver: boolean;
  isEmpty: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        p: 1,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        backgroundColor: isOver ? "rgba(0, 0, 0, 0.04)" : undefined,
        border: isOver ? "2px dashed #1976d2" : undefined,
        position: "relative",
      }}
    >
      <Typography variant="h6" align="center" sx={{ borderColor: "rgba(0, 0, 0, 0.24)" }} borderBottom={1} gutterBottom>
        {title}
      </Typography>
      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        {meetings.length === 0 ? (
          <Box 
            sx={{ 
              height: "100%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px dashed #ccc",
              borderRadius: 1,
              backgroundColor: isOver ? "rgba(25, 118, 210, 0.1)" : "transparent",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {isOver ? "Drop here" : "No meetings"}
            </Typography>
          </Box>
        ) : (
          <SortableContext
            items={meetings.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {meetings.map((meeting) => (
              <SortableMeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </SortableContext>
        )}
      </Box>
    </Paper>
  );
}

function SortableMeetingCard({ meeting }: { meeting: IMeeting }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: meeting.id });
  const { mutate: deleteMeeting } = useDelete();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { mutate: updateMeeting } = useUpdate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setEditOpen(true);
    handleMenuClose();
  };


  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleUpdate = (updatedData: {
    title: string;
    date?: string;
    priority: Priority;
    description?: string;
    invitedUserIds: string[];
  }) => {
    updateMeeting({
      resource: "meetings",
      id: meeting.id,
      values: updatedData,
      successNotification: () => ({
        message: "Meeting updated successfully",
        type: "success",
      }),
    });
    setEditOpen(false);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          backgroundColor: "rgb(244, 244, 244)",
          borderRadius: 2,
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <MoreVert />
          </IconButton>

          <Typography variant="h6">{meeting.title}</Typography>
          <Box py={2} px={1} mt={1} borderRadius={1} sx={{ backgroundColor: "#fff" }}>
            <Typography>{meeting.description}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="caption">
              {meeting.date ? new Date(meeting.date).toLocaleString() : ""}
            </Typography>
            <Typography variant="caption">{meeting.createdBy?.fullName}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <EditMeetingModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        meeting={{
          ...meeting,
          date: meeting.date ? new Date(meeting.date).toLocaleString() : "",
        }}
        onUpdate={handleUpdate}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this meeting?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteMeeting(
                {
                  resource: "meetings",
                  id: meeting.id,
                },
                {
                  onSuccess: () => {
                    setDeleteConfirmOpen(false);
                  },
                },
              );
            }}
          >
          Delete
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}


