import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download';

const ProfileAvatar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Tooltip title="Profile">
                <IconButton onClick={handleClick}>
                    <Avatar src="/broken-image.jpg" />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => alert('Mes tâches')}>
                    <TaskAltIcon style={{ marginRight: '10px' }} />
                    Mes tâches
                </MenuItem>
                <MenuItem onClick={() => alert('Ajouter des tâches')}>
                    <AddIcon style={{ marginRight: '10px' }} />
                    Ajouter des tâches
                </MenuItem>
                <MenuItem onClick={() => alert('Afficher les catégories')}>
                    <CategoryIcon style={{ marginRight: '10px' }} />
                    Afficher les catégories
                </MenuItem>
                <MenuItem onClick={() => alert('Import/Export')}>
                    <DownloadIcon style={{ marginRight: '10px' }} />
                    Import/Export
                </MenuItem>
            </Menu>
        </div>
    );
};

export default ProfileAvatar;
