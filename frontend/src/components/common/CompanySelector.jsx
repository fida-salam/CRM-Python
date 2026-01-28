// frontend/src/components/common/CompanySelector.jsx
import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const CompanySelector = () => {
  const { user, switchCompany } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCompanyChange = async (event) => {
    const companyId = event.target.value;
    if (!companyId || companyId === user?.default_company?.id) {
      return;
    }

    setLoading(true);
    try {
      await switchCompany(companyId);
      // Refresh the page to update all data
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.companies || user.companies.length <= 1) {
    return null;
  }

  const currentCompany = user.companies.find(
    (company) => company.id === user.default_company?.id
  );

  return (
    <Box sx={{ minWidth: 200, mx: 2 }}>
      <FormControl fullWidth size="small">
        <Select
          value={user.default_company?.id || ''}
          onChange={handleCompanyChange}
          disabled={loading}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2">Select Company</Typography>
                </Box>
              );
            }
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: 'primary.main',
                    fontSize: '0.75rem'
                  }}
                >
                  {currentCompany?.name?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {currentCompany?.name || 'Company'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentCompany?.role ? `(${currentCompany.role})` : ''}
                  </Typography>
                </Box>
              </Box>
            );
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              py: 1,
            }
          }}
        >
          {user.companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: company.id === user.default_company?.id ? 'primary.main' : 'grey.400',
                    fontSize: '0.75rem'
                  }}
                >
                  {company.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    {company.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {company.role}
                  </Typography>
                </Box>
                {company.id === user.default_company?.id && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {loading && (
          <CircularProgress 
            size={20} 
            sx={{ 
              position: 'absolute', 
              right: 40, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }} 
          />
        )}
      </FormControl>
    </Box>
  );
};

export default CompanySelector;