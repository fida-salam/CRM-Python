import React from 'react';
import { Box } from '@mui/material';
import IconButton from '../buttons/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TableActions = ({ 
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = false,
  size = 'small'
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
      {showView && (
        <IconButton
          tooltip="View"
          color="info"
          size={size}
          onClick={onView}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      )}
      {showEdit && (
        <IconButton
          tooltip="Edit"
          color="primary"
          size={size}
          onClick={onEdit}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
      {showDelete && (
        <IconButton
          tooltip="Delete"
          color="error"
          size={size}
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default TableActions;