import { FolderOpen, FolderPlus, ListMusic, Music2 } from "lucide-react";

export const menuItems = [
  { label: "Add Song", path: "/add-song", icon: Music2 },
  { label: "List Songs", path: "/list-songs", icon: ListMusic },
  { label: "Add Album", path: "/add-album", icon: FolderPlus },
  { label: "List Album", path: "/list-album", icon: FolderOpen },
];
