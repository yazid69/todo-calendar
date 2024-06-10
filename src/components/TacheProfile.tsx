import { useState } from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download';

function Tache() {
    const [isHovered, setIsHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);



    return (
        <div>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isHovered ? 'lightgray' : 'transparent',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '90%',
                    margin: 'auto',
                    borderRadius: '10px'
                }}
            >
                <TaskAltIcon style={{ marginRight: '20px' }} />
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Mes tâches</span>
            </div>
            <div
                onMouseEnter={() => setIsAddHovered(true)}
                onMouseLeave={() => setIsAddHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isAddHovered ? 'lightgray' : 'transparent',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '90%',
                    margin: 'auto',
                    borderRadius: '10px'
                }}
            >
                <AddIcon style={{ marginRight: '20px' }} />
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Ajouter des tâches</span>
            </div>
            <div
                onMouseEnter={() => setIsCategoryHovered(true)}
                onMouseLeave={() => setIsCategoryHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isCategoryHovered ? 'lightgray' : 'transparent',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '90%',
                    margin: 'auto',
                    borderRadius: '10px'

                }}
            >
                <CategoryIcon style={{ marginRight: '20px' }} />
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Mes tâches</span>
            </div>
            <div
                onMouseEnter={() => setIsAddHovered(true)}
                onMouseLeave={() => setIsAddHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isAddHovered ? 'lightgray' : 'transparent',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '90%',
                    margin: 'auto',
                    borderRadius: '10px'
                }}
            >
                <DownloadIcon style={{ marginRight: '20px' }} />
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Import/Export</span>
            </div >
            <div
                onMouseEnter={() => setIsAddHovered(true)}
                onMouseLeave={() => setIsAddHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isAddHovered ? 'lightgray' : 'transparent',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '90%',
                    margin: 'auto',
                    borderRadius: '10px'
                }}
            >
            </div >
        </div >

    );
}

export default Tache;