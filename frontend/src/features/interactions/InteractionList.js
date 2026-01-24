import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Alert as MuiAlert, 
  Snackbar as MuiSnackbar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useInteractions } from '../../hooks/useInteractions';
import { useCustomers } from '../../hooks/useCustomers';
import PageHeader from '../shared/pageHeader';
import InteractionTable from './InteractionTable';
import InteractionForm from './InteractionForm';

function InteractionList() {
  const [openForm, setOpenForm] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const {
    interactions,
    isLoading,
    error,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    isCreating,
    isUpdating
  } = useInteractions();

  // Get customers for the dropdown in form
  const { customers } = useCustomers();

  const handleOpenForm = () => {
    setEditingInteraction(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingInteraction(null);
  };

  const handleSubmit = (data) => {
    if (editingInteraction) {
      updateInteraction(
        { id: editingInteraction.id, data },
        {
          onSuccess: () => {
            setSnackbar({ 
              open: true, 
              message: 'Interaction updated successfully!', 
              severity: 'success' 
            });
            handleCloseForm();
          },
          onError: () => {
            setSnackbar({ 
              open: true, 
              message: 'Failed to update interaction', 
              severity: 'error' 
            });
          }
        }
      );
    } else {
      createInteraction(data, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Interaction added successfully!', 
            severity: 'success' 
          });
          handleCloseForm();
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to add interaction', 
            severity: 'error' 
          });
        }
      });
    }
  };

  const handleEdit = (interaction) => {
    setEditingInteraction(interaction);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      deleteInteraction(id, {
        onSuccess: () => {
          setSnackbar({ 
            open: true, 
            message: 'Interaction deleted successfully!', 
            severity: 'success' 
          });
        },
        onError: () => {
          setSnackbar({ 
            open: true, 
            message: 'Failed to delete interaction', 
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
          Error loading interactions: {error.message}
        </MuiAlert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Interactions"
        subtitle={`Total Interactions: ${interactions.length}`}
        actionLabel="Add Interaction"
        onAction={handleOpenForm}
        actionIcon={<AddIcon />}
      />

      <InteractionTable
        interactions={interactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <InteractionForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingInteraction}
        isLoading={isCreating || isUpdating}
        customers={customers}
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

export default InteractionList;