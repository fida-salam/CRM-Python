import React, { useState } from 'react';
import { 
  Container, 
  Alert as MuiAlert, 
  Snackbar as MuiSnackbar 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useUsers } from '../../hooks/UseUsers ';
import PageHeader from '../shared/pageHeader';
import UserTable from './UserTable';
import UserForm from './UserForm';
import {useCompanies} from '../../hooks/useCompanies';

function UserList() {
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating
  } = useUsers();

    const { companies: companyList, isLoading: companiesLoading } = useCompanies();

  const handleOpenForm = () => {
    setEditingUser(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingUser(null);
  };

  const handleSubmit = (data) => {
    if (editingUser) {
      // Update existing user
      updateUser(
        { id: editingUser.id, data },
        {
          onSuccess: () => {
            setSnackbar({ 
              open: true, 
              message: 'User updated successfully!', 
              severity: 'success' 
            });
            handleCloseForm();
          },
          onError: (error) => {
            setSnackbar({ 
              open: true, 
              message: error?.response?.data?.error || 'Failed to update user', 
              severity: 'error' 
            });
          }
        }
      );
    } else {
      // Create new user
      createUser(data, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'User created successfully!', 
            severity: 'success' 
          });
          handleCloseForm();
        },
        onError: (error) => {
          setSnackbar({ 
            open: true, 
            message: error?.response?.data?.error || 'Failed to create user', 
            severity: 'error' 
          });
        }
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deleteUser(id, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'User deactivated successfully!', 
            severity: 'success' 
          });
        },
        onError: (error) => {
          setSnackbar({ 
            open: true, 
            message: error?.response?.data?.error || 'Failed to deactivate user', 
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
          Error loading users: {error.message}
        </MuiAlert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Users"
        subtitle={`Total Users: ${users.length}`}
        actionLabel="Add User"
        onAction={handleOpenForm}
        actionIcon={<PersonAddIcon />}
      />

      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <UserForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingUser}
        isLoading={isCreating || isUpdating}
        companies={companyList}
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

export default UserList;