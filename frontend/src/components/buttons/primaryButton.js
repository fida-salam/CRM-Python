import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const PrimaryButton = ({ 
  children, 
  loading = false, 
  startIcon, 
  endIcon,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <Button
      variant="contained"
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;