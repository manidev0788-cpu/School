/** Demo-only: who is "signed in" to the admin console (UI toggle, no backend) */

export const VIEWER_MODES = {
  super: {
    key: "super",
    label: "Super Admin",
    shortLabel: "Super",
    actorName: "Amelia Wright",
    fullAccess: true,
  },
  admin: {
    key: "admin",
    label: "Admin",
    shortLabel: "Admin",
    actorName: "James Kumar",
    fullAccess: false,
  },
};
