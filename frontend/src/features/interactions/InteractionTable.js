import React from 'react';
import { Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseTable from '../../components/tables/BaseTable';
import IconButton from '../../components/buttons/IconButton';

function InteractionTable({ interactions, onEdit, onDelete, isLoading }) {
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Helper function to get chip color based on interaction type
  const getTypeColor = (type) => {
    const colors = {
      call: 'primary',
      email: 'secondary',
      meeting: 'success',
      note: 'default'
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      id: 'customer_name',
      label: 'Customer',
      render: (row) => row.customer_name || '-'
    },
    {
      id: 'interaction_type',
      label: 'Type',
      render: (row) => (
        <Chip 
          label={row.interaction_type} 
          color={getTypeColor(row.interaction_type)}
          size="small"
        />
      )
    },
    {
      id: 'subject',
      label: 'Subject'
    },
    {
      id: 'interaction_date',
      label: 'Date & Time',
      render: (row) => formatDate(row.interaction_date)
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <IconButton 
            tooltip="Edit interaction"
            onClick={() => onEdit(row)}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            tooltip="Delete interaction"
            onClick={() => onDelete(row.id)}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <BaseTable
      columns={columns}
      data={interactions}
      loading={isLoading}
      emptyMessage="No interactions found"
    />
  );
}

export default InteractionTable;