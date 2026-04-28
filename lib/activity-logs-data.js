/** Dummy activity stream — appended client-side on admin actions */

export const ACTIVITY_ACTIONS = ["Add", "Edit", "Delete", "Restore", "Reset"];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "log-1",
    userName: "Amelia Wright",
    action: "Reset",
    target: "vihaan.mehta",
    at: "2026-04-28T09:12:00",
  },
  {
    id: "log-2",
    userName: "James Kumar",
    action: "Edit",
    target: "neha.krishnan",
    at: "2026-04-27T14:40:00",
  },
  {
    id: "log-3",
    userName: "Amelia Wright",
    action: "Delete",
    target: "david.fernandes",
    at: "2026-04-26T11:05:00",
  },
  {
    id: "log-4",
    userName: "Amelia Wright",
    action: "Restore",
    target: "arjun.desai",
    at: "2026-04-25T16:22:00",
  },
  {
    id: "log-5",
    userName: "Amelia Wright",
    action: "Add",
    target: "priya.mehta",
    at: "2026-04-24T08:30:00",
  },
];
