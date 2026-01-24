import React from 'react';
import { TextField } from '@mui/material';

const FormTextField = ({ 
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  size = 'small',
  fullWidth = true,
  placeholder = '',
  multiline = false,
  rows = 1,
  startAdornment,
  endAdornment,
  ...props 
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      size={size}
      fullWidth={fullWidth}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      InputProps={{
        startAdornment,
        endAdornment
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        ...props.sx
      }}
      {...props}
    />
  );
};

export default FormTextField;