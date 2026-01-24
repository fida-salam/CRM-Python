import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../components/buttons/primaryButton';

const PageHeader = ({ 
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  actionLoading = false
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4,
      pb: 2,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && (
        <PrimaryButton
          startIcon={actionIcon}
          onClick={onAction}
          loading={actionLoading}
        >
          {actionLabel}
        </PrimaryButton>
      )}
    </Box>
  );
};

// Make sure this line exists:
export default PageHeader;