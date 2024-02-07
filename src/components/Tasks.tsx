import { useState } from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download';

function Tasks() {
    const [isHovered, setIsHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);

    const handleTaskClick = () => {
        alert('Mes tâches');
        // Remplacez cette ligne par la logique d'affichage des tâches
    };

    const handleAddClick = () => {
        alert('Ajouter des tâches');
        // Remplacez cette ligne par la logique d'ajout des tâches
    };

    const handleCategoryClick = () => {
        alert('Afficher les catégories');
        // Remplacez cette ligne par la logique d'affichage des catégories
    };

    return (
        <div>
            <div
                onClick={handleTaskClick}
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
                onClick={handleAddClick}
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
                onClick={handleCategoryClick}
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
                onClick={handleAddClick}
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
                onClick={handleAddClick}
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

export default Tasks;