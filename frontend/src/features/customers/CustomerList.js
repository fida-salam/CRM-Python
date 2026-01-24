// CustomerList.js - FIXED VERSION
import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Alert as MuiAlert, 
  Snackbar as MuiSnackbar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useCustomers } from '../../hooks/useCustomers';
import PageHeader from '../shared/pageHeader';
import CustomerTable from './CustomerTable';
import CustomerForm from './CustomerForm';



function CustomerList() {
  const [openForm, setOpenForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const {
    customers,
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isCreating,
    isUpdating
  } = useCustomers();

  const handleOpenForm = () => {
    setEditingCustomer(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (data) => {
    if (editingCustomer) {
      updateCustomer(
        { id: editingCustomer.id, data },
        {
          onSuccess: () => {
            setSnackbar({ 
              open: true, 
              message: 'Customer updated successfully!', 
              severity: 'success' 
            });
            handleCloseForm();
          },
          onError: () => {
            setSnackbar({ 
              open: true, 
              message: 'Failed to update customer', 
              severity: 'error' 
            });
          }
        }
      );
    } else {
      createCustomer(data, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Customer added successfully!', 
            severity: 'success' 
          });
          handleCloseForm();
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to add customer', 
            severity: 'error' 
          });
        }
      });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Customer deleted successfully!', 
            severity: 'success' 
          });
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to delete customer', 
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
          Error loading customers: {error.message}
        </MuiAlert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Customers"
        subtitle={`Total Customers: ${customers.length}`}
        actionLabel="Add Customer"
        onAction={handleOpenForm}
        actionIcon={<AddIcon />}
      />

      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <CustomerForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingCustomer}
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

export default CustomerList;