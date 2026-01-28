import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Tab,
  Tabs,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useDashboard } from '../../hooks/useDashboard';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const {
    stats,
    activities,
    insights,
    isLoading,
    error,
    refetch
  } = useDashboard();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call':
        return <PhoneIcon />;
      case 'email':
        return <EmailIcon />;
      case 'meeting':
        return <EventIcon />;
      case 'note':
        return <DescriptionIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'call':
        return 'primary';
      case 'email':
        return 'secondary';
      case 'meeting':
        return 'success';
      case 'note':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          Error loading dashboard: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {stats?.company_name || 'Welcome to your CRM Dashboard'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refetch}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats?.total_customers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Interactions
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats?.total_interactions || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Recent (7 days)
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats?.recent_interactions || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    New Customers (30d)
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats?.recent_customers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, boxShadow: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Insights" />
          <Tab label="Recent Activities" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Overview Tab - Interaction Types */}
        {stats?.interaction_types && stats.interaction_types.length > 0 && (
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Interaction Types Breakdown
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {stats.interaction_types.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: getInteractionColor(item.interaction_type) + '.main',
                          mr: 2 
                        }}
                      >
                        {getInteractionIcon(item.interaction_type)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.interaction_type}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {item.count}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Additional Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Team Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Active Users</Typography>
                  <Chip 
                    label={stats?.active_users || 0} 
                    color="success" 
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, height: '100%', bgcolor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
                  Quick Tip
                </Typography>
                <Typography variant="body2" color="white">
                  Keep your customer data up to date and engage regularly to maintain strong relationships.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Insights Tab */}
        {insights && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Customer Analytics
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Customers
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {insights.total_customers}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interactions
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                      {insights.total_interactions}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Avg Interactions per Customer
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {insights.avg_interactions_per_customer}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, bgcolor: 'info.light', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
                    💡 Recommendations
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: 'white' }} />
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Re-engage inactive customers"
                        secondary="Focus on customers who haven't been contacted recently"
                        primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ color: 'white', opacity: 0.9 }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Diversify interaction types"
                        secondary="Use multiple channels to connect with customers"
                        primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ color: 'white', opacity: 0.9 }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Recent Activities Tab */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activities
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {activities && activities.length > 0 ? (
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getInteractionColor(activity.type) + '.main' }}>
                          {getInteractionIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {activity.subject}
                            </Typography>
                            <Chip 
                              label={activity.type_display} 
                              size="small"
                              color={getInteractionColor(activity.type)}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Customer: <strong>{activity.customer_name}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {activity.notes}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                              {new Date(activity.date).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activities found
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>
    </Container>
  );
}

export default Dashboard;