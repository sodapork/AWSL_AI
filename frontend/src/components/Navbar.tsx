import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const contentTypes = [
  'Website Events',
  'Blog Posts',
  'Email Campaigns',
  'Email Reminders',
  'Marketing Flyers'
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Senior Living Content Generator
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {contentTypes.map((type) => (
            <Button
              key={type}
              color="inherit"
              onClick={() => navigate(`/${type.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {type}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 