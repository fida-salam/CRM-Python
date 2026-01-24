import React from 'react';
import { Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseTable from '../../components/tables/BaseTable';
import IconButton from '../../components/buttons/IconButton';

function BasicCustomerTable({ customers, onEdit, onDelete, isLoading }) {
  const columns = [
    {
      id: 'name',
      label: 'Name',
      render: (row) => `${row.first_name} ${row.last_name}`
    },
    {
      id: 'email',
      label: 'Email'
    },
    {
      id: 'phone',
      label: 'Phone',
      render: (row) => row.phone || '-'
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <IconButton 
            tooltip="Edit customer"
            onClick={() => onEdit(row)}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            tooltip="Delete customer"
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
      data={customers}
      loading={isLoading}
      emptyMessage="No customers found"
    />
  );
}

export default BasicCustomerTable;