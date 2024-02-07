import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import ProfileAvatar from './components/ProfileAvatar';
import Tasks from './components/Tasks';


function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in event && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <div className="App">
      <ProfileAvatar src="/path-to-image.jpg" name="Nom d'utilisateur" onClick={toggleDrawer(true)} />
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <img src="logo.svg" alt="Logo" style={{ marginRight: '10px' }} />
          <h1>Calendrier</h1>
          <style>
            {`
              h1 {
                color: rgb(119, 100, 232);
                font-size: 1.5rem
              }
            `}
          </style>
        </div>
        <Tasks />

      </Drawer>
    </div>
  );
}

export default App;