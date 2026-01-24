import React from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FormDialog = ({ 
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  loading = false,
  onCancel,
  maxWidth = 'sm',
  fullWidth = true,
  submitColor = 'primary',
  PaperProps = {},
  ...props 
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("FormDialog - Form submitted");
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          ...PaperProps.sx
        },
        ...PaperProps
      }}
      {...props}
    >
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'white' }}
            disabled={loading}
            type="button"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {children}
        </Box>
        
        {/* Actions */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Button
            onClick={onCancel || onClose}
            disabled={loading}
            variant="outlined"
            size="small"
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            size="small"
            color={submitColor}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            {loading ? 'Saving...' : submitLabel}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default FormDialog;