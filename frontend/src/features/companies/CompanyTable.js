import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseTable from '../../components/tables/BaseTable';
import IconButton from '../../components/buttons/IconButton';

function CompanyTable({ companies, onEdit, onDelete, isLoading }) {
  const columns = [
    {
      id: 'name',
      label: 'Company Name'
    },
    {
      id: 'subdomain',
      label: 'subdomain'
    },
    {
      id: 'created_at',
      label: 'Created',
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <IconButton 
            tooltip="Edit company"
            onClick={() => onEdit(row)}
            color="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            tooltip="Delete company"
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
      data={companies}
      loading={isLoading}
      emptyMessage="No companies found"
    />
  );
}

export default CompanyTable;