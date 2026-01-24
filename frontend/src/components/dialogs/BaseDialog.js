import React from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BaseDialog = ({ 
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  headerColor = 'primary.main',
  ...props 
}) => {
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
          ...props.PaperProps?.sx
        }
      }}
      {...props}
    >
      {/* Header */}
      {title && (
        <Box
          sx={{
            bgcolor: headerColor,
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
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      )}
      
      {/* Content */}
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
      
      {/* Actions */}
      {actions && (
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: 'grey.50',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}
        >
          {actions}
        </Box>
      )}
    </Dialog>
  );
};

export default BaseDialog;