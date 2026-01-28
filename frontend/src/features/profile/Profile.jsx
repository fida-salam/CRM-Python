import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Chip,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();

  // Get avatar initials
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  // Get role color
  const getRoleColor = () => {
    switch(user?.role) {
      case 'super_admin': return 'primary.main';
      case 'admin': return 'secondary.main';
      case 'manager': return 'success.main';
      default: return 'grey.600';
    }
  };

  // Calculate days active
  const getDaysActive = () => {
    if (!user?.date_joined) return 0;
    const joinedDate = new Date(user.date_joined);
    const today = new Date();
    const diffTime = Math.abs(today - joinedDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account information and preferences
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<EditIcon />}
          size="small"
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Personal Info */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ boxShadow: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Avatar & Basic Info */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: '2rem',
                    bgcolor: getRoleColor(),
                    mb: 2
                  }}
                >
                  {getInitials()}
                </Avatar>
                
                <Typography variant="h6" fontWeight="bold" align="center">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username || 'User'
                  }
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom align="center">
                  @{user?.username}
                </Typography>
                
                <Chip 
                  label={user?.role ? user.role.replace('_', ' ').toUpperCase() : 'USER'}
                  sx={{
                    bgcolor: getRoleColor(),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                  CONTACT INFORMATION
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: 'grey.500', width: 20 }} />
                  <Box>
                    <Typography variant="body2">
                      {user?.email || 'No email'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'grey.500', width: 20 }} />
                  <Box>
                    <Typography variant="body2">
                      {user?.phone || 'No phone number'}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                  CURRENT COMPANY
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 2, color: 'primary.main', width: 20 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {user?.default_company?.name || 'No company'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column - Account Details */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Account Details
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarIcon sx={{ mr: 1, fontSize: 'small', verticalAlign: 'middle' }} />
                      Joined Date
                    </Typography>
                    <Typography variant="body1">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Login
                    </Typography>
                    <Typography variant="body1">
                      {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Account Status
                </Typography>
                <Chip 
                  label={user?.is_active ? 'ACTIVE' : 'INACTIVE'}
                  color={user?.is_active ? 'success' : 'error'}
                  size="small"
                  icon={user?.is_active ? <CheckCircleIcon /> : null}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Days Active
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {getDaysActive()} days
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Account Actions */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    startIcon={<LockIcon />}
                    fullWidth
                    size="small"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    startIcon={<NotificationsIcon />}
                    fullWidth
                    size="small"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Notifications
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    startIcon={<SettingsIcon />}
                    fullWidth
                    size="small"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Preferences
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<PersonIcon />}
                    fullWidth
                    size="small"
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Deactivate
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Companies */}
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ mr: 1 }} />
                My Companies
                <Chip 
                  label={user?.companies?.length || 0}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>

              {user?.companies && user.companies.length > 0 ? (
                <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {user.companies.map((company) => (
                    <ListItem 
                      key={company.id}
                      sx={{ 
                        bgcolor: company.id === user.default_company?.id ? 'primary.50' : 'transparent',
                        borderRadius: 1,
                        mb: 1,
                        py: 1,
                        border: company.id === user.default_company?.id ? '1px solid' : 'none',
                        borderColor: 'primary.light'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <BusinessIcon 
                          fontSize="small" 
                          color={company.id === user.default_company?.id ? "primary" : "action"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {company.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              label={company.role}
                              size="small"
                              variant="outlined"
                              color={
                                company.role === 'super_admin' ? 'primary' :
                                company.role === 'admin' ? 'secondary' :
                                company.role === 'manager' ? 'success' : 'default'
                              }
                            />
                            {company.id === user.default_company?.id && (
                              <CheckCircleIcon fontSize="small" color="success" />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No companies assigned
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;