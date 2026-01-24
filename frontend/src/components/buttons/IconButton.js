import React from 'react';
import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

const IconButton = ({ 
  children, 
  tooltip = '',
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props 
}) => {
  const button = (
    <MuiIconButton
      color={color}
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiIconButton>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      {button}
    </Tooltip>
  ) : button;
};

export default IconButton;