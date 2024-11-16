import React from 'react';
import { Box, CssBaseline, Sheet } from '@mui/joy';
import Sidebar from './Sidebar'; // Assurez-vous que Sidebar est fonctionnel

export function MessagingPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, display: 'flex', paddingTop: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <Sheet sx={{ flex: '0 0 25%', padding: 2 }}>
            <Sidebar />
          </Sheet>
          <Sheet
            sx={{
              flex: '1',
              paddingLeft: 2,
              backgroundColor: 'background.level1',
              borderRadius: '8px',
              boxShadow: 'sm',
              height: 'calc(100vh - 100px)',
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2>Message Section</h2>
            </Box>
          </Sheet>
        </Box>
      </Box>
    </Box>
  );
}
