import React from "react";
import { Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BaseTable from "../../components/tables/BaseTable";
import IconButton from "../../components/buttons/IconButton";

function UserTable({ users, onEdit, onDelete, isLoading }) {
  const getRoleColor = (role) => {
    const colors = {
      super_admin: "error",
      admin: "warning",
      manager: "info",
      user: "default",
    };
    return colors[role] || "default";
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      manager: "Manager",
      user: "User",
    };
    return labels[role] || role;
  };

  const columns = [
    {
      id: "username",
      label: "Username",
    },
    {
      id: "name",
      label: "Name",
      render: (row) => {
        const fullName =
          `${row.first_name || ""} ${row.last_name || ""}`.trim();
        return fullName || "-";
      },
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <Chip
          // label={getRoleLabel(row.role)}
          // color={getRoleColor(row.role)}
          label={getRoleLabel(row.current_role || row.role)} 
          color={getRoleColor(row.current_role || row.role)} 
          size="small"
        />
      ),
    },
    {
      id: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      id: "is_active",
      label: "Status",
      render: (row) => (
        <Chip
          icon={row.is_active ? <CheckCircleIcon /> : <CancelIcon />}
          label={row.is_active ? "Active" : "Inactive"}
          color={row.is_active ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <IconButton
            tooltip="Edit user"
            onClick={() => onEdit(row)}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            tooltip={row.is_active ? "Deactivate user" : "User is inactive"}
            onClick={() => onDelete(row.id)}
            color="error"
            size="small"
            disabled={!row.is_active}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={users}
      loading={isLoading}
      emptyMessage="No users found"
    />
  );
}

export default UserTable;
