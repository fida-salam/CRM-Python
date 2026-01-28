import React, { useState } from 'react';
import { 
  Container, 
  Alert as MuiAlert, 
  Snackbar as MuiSnackbar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useCompanies } from '../../hooks/useCompanies';
import PageHeader from '../shared/pageHeader';
import CompanyTable from './CompanyTable';
import CompanyForm from './CompanyForm';

function CompanyList() {
  const [openForm, setOpenForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating
  } = useCompanies();

  const handleOpenForm = () => {
    setEditingCompany(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCompany(null);
  };

  const handleSubmit = (data) => {
    if (editingCompany) {
      updateCompany(
        { id: editingCompany.id, data },
        {
          onSuccess: () => {
            setSnackbar({ 
              open: true, 
              message: 'Company updated successfully!', 
              severity: 'success' 
            });
            handleCloseForm();
          },
          onError: () => {
            setSnackbar({ 
              open: true, 
              message: 'Failed to update company', 
              severity: 'error' 
            });
          }
        }
      );
    } else {
      createCompany(data, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Company added successfully!', 
            severity: 'success' 
          });
          handleCloseForm();
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to add company', 
            severity: 'error' 
          });
        }
      });
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company? All associated data will be removed.')) {
      deleteCompany(id, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Company deleted successfully!', 
            severity: 'success' 
          });
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to delete company', 
            severity: 'error' 
          });
        }
      });
    }
  };

  if (error) {
    return (
      <Container>
        <MuiAlert 
          severity="error" 
          sx={{ mt: 4 }}
        >
          Error loading companies: {error.message}
        </MuiAlert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Companies"
        subtitle={`Total Companies: ${companies.length}`}
        actionLabel="Add Company"
        onAction={handleOpenForm}
        actionIcon={<AddIcon />}
      />

      <CompanyTable
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <CompanyForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingCompany}
        isLoading={isCreating || isUpdating}
      />

      <MuiSnackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </MuiAlert>
      </MuiSnackbar>
    </Container>
  );
}

export default CompanyList;
