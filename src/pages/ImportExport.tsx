import { useContext, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Category, Task } from "../types/user";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import { Emoji } from "emoji-picker-react";
import { FileDownload, FileUpload, Info, Link } from "@mui/icons-material";
import { exportTasksToJson } from "../utils/exportTasksToJson";
import { IconButton, Tooltip } from "@mui/material";
import {
  CATEGORY_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TASK_NAME_MAX_LENGTH,
} from "../constants";
import toast from "react-hot-toast";
import { ColorPalette } from "../styles";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useCtrlS } from "../hooks/useCtrlS";

const ImportExport = () => {
  const { user, setUser } = useContext(UserContext);
  const [selectedTasks, setSelectedTasks] = useStorageState<number[]>(
    [],
    "tasksToExport",
    "sessionStorage"
  ); // Array of selected task IDs

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useCtrlS();

  useEffect(() => {
    document.title = "Todo Calendar - Transférer des tâches";
  }, []);

  const handleTaskClick = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImport(file);
    console.log(file);
  };
  const handleExport = () => {
    const tasksToExport = user.tasks.filter((task: Task) => selectedTasks.includes(task.id));
    exportTasksToJson(tasksToExport);
    toast(
      (t) => (
        <div>
          Tâches exportées:{" "}
          <ul>
            {tasksToExport.map((task) => (
              <li key={task.id}>
                <ListContent>
                  <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                  <span>{task.name}</span>
                </ListContent>
              </li>
            ))}
          </ul>
          <Button
            variant="outlined"
            sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
            onClick={() => toast.dismiss(t.id)}
          >
            Rejeter
          </Button>
        </div>
      )
    );
  };

  const handleExportAll = () => {
    exportTasksToJson(user.tasks);
    toast.success(`Exportation de toutes les tâches (${user.tasks.length})`);
  };
  const handleImport = (taskFile: File) => {
    //TODO: add is hex color statemant
    const file = taskFile;

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string) as Task[];

          if (!Array.isArray(importedTasks)) {
            toast.error("Le fichier importé a une structure non valide.");
            return;
          }

          // Check if any imported task property exceeds the maximum length

          const invalidTasks = importedTasks.filter((task) => {
            const isInvalid =
              (task.name && task.name.length > TASK_NAME_MAX_LENGTH) ||
              (task.description && task.description.length > DESCRIPTION_MAX_LENGTH) ||
              (task.category &&
                task.category.some((cat) => cat.name.length > CATEGORY_NAME_MAX_LENGTH));

            return isInvalid;
          });

          if (invalidTasks.length > 0) {
            const invalidTaskNames = invalidTasks.map((task) => task.name).join(", ");
            console.error(
              `Ces tâches ne peuvent pas être importées car elles dépassent la longueur maximale des caractères.: ${invalidTaskNames}`
            );
            toast.error(`Certaines tâches ne peuvent pas être importées en raison du dépassement de la longueur maximale des caractères.`);
            return;
          }

          const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);
          const isCategoryColorValid = (category: Category) =>
            category.color && isHexColor(category.color);

          const hasInvalidColors = importedTasks.some((task) => {
            return (
              (task.color && !isHexColor(task.color)) ||
              (task.category && !task.category.every((cat) => isCategoryColorValid(cat)))
            );
          });

          if (hasInvalidColors) {
            toast.error("Le fichier importé contient des tâches dont le format de couleur n'est pas valide..");
            return;
          }

          // Update user.categories if imported categories don't exist
          const updatedCategories = user.categories.slice(); // Create a copy of the existing categories

          importedTasks.forEach((task) => {
            task.category !== undefined &&
              task.category.forEach((importedCat) => {
                const existingCategory = updatedCategories.find((cat) => cat.id === importedCat.id);

                if (!existingCategory) {
                  updatedCategories.push(importedCat);
                } else {
                  // Replace the existing category with the imported one if the ID matches
                  Object.assign(existingCategory, importedCat);
                }
              });
          });

          setUser((prevUser) => ({
            ...prevUser,
            categories: updatedCategories,
          }));
          // Proceed with merging the imported tasks as before
          const mergedTasks = [...user.tasks, ...importedTasks];

          const uniqueTasks = mergedTasks.reduce((acc, task) => {
            const existingTask = acc.find((t) => t.id === task.id);
            if (existingTask) {
              return acc.map((t) => (t.id === task.id ? task : t));
            } else {
              return [...acc, task];
            }
          }, [] as Task[]);

          setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

          // Prepare the list of imported task names
          const importedTaskNames = importedTasks.map((task) => task.name).join(", ");

          // Display the alert with the list of imported task names
          console.log(`Imported Tasks: ${importedTaskNames}`);
          toast((t) => (
            <div>
              Tâches importées avec succès de <br />
              <i style={{ wordBreak: "break-all" }}>{file.name}</i>
              <ul>
                {importedTasks.map((task) => (
                  <li key={task.id}>
                    <ListContent>
                      <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                      <span>{task.name}</span>
                    </ListContent>
                  </li>
                ))}
              </ul>
              <Button
                variant="outlined"
                sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
                onClick={() => toast.dismiss(t.id)}
              >
                Rejeter
              </Button>
            </div>
          ));
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          console.error(`Erreur d'analyse du fichier importé ${file.name}:`, error);
          toast.error(
            <div style={{ wordBreak: "break-all" }}>
              Erreur d'analyse du fichier importé: <br /> <i>{file.name}</i>
            </div>
          );
        }
      };

      reader.readAsText(file);
    }
  };

  const handleImportFromLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log(`${location.protocol}//${location.hostname}/share`);

      if (text.startsWith(`${location.protocol}//${location.hostname}`)) {
        window.open(text, "_self");
      } else {
        toast.error((t) => (
          <div onClick={() => toast.dismiss(t.id)}>
            Échec de l'importation de la tâche à partir du lien fourni. Veuillez vous assurer que le lien est copié
            correctement.
          </div>
        ));
      }
    } catch (err) {
      console.error("Échec de la lecture du contenu du presse-papiers: ", err);
    }
  };

  // clear file input after logout
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user.createdAt]);

  return (
    <>
      <TopBar title="Import/Export" />
      <h2
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Sélectionner les tâches à exporter&nbsp;
        <Tooltip title="Les doublons seront supprimés lors de l'importation">
          <IconButton style={{ color: "#ffffff" }}>
            <Info />
          </IconButton>
        </Tooltip>
      </h2>

      <Container>
        {user.tasks.length > 0 ? (
          user.tasks.map((task: Task) => (
            <TaskContainer
              key={task.id}
              backgroundclr={task.color}
              onClick={() => handleTaskClick(task.id)}
              selected={selectedTasks.includes(task.id)}
              translate="no"
            >
              <Checkbox size="medium" checked={selectedTasks.includes(task.id)} />
              <Typography
                variant="body1"
                component="span"
                sx={{ display: "flex", alignItems: "center", gap: "6px", wordBreak: "break-word" }}
              >
                <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
                {task.name}
              </Typography>
            </TaskContainer>
          ))
        ) : (
          <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>Vous n'avez pas de tâches à exporter</h3>
        )}
      </Container>

      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <StyledButton
          onClick={handleExport}
          disabled={selectedTasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Exporter la sélection vers JSON{" "}
          {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
        </StyledButton>

        <StyledButton
          onClick={handleExportAll}
          disabled={user.tasks.length === 0}
          variant="outlined"
        >
          <FileDownload /> &nbsp; Exporter toutes les tâches au format JSON
        </StyledButton>

        <h2 style={{ textAlign: "center" }}>Importer des tâches à partir de JSON</h2>

        {/Windows|Linux|Macintosh/i.test(navigator.userAgent) && (
          <div style={{ width: "300px" }}>
            <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
              <FileUpload fontSize="large" color="primary" />
              <p style={{ fontWeight: 500, fontSize: "16px", margin: 0 }}>
                Déposez un fichier JSON ici pour importer des tâches{" "}
              </p>
            </DropZone>
          </div>
        )}

        <input
          accept=".json"
          id="import-file"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            file && handleImport(file);
          }}
        />
        <label htmlFor="import-file">
          <Button
            component="span"
            variant="outlined"
            sx={{
              padding: "12px 18px",
              borderRadius: "14px",
              width: "300px",
            }}
          >
            <FileUpload /> &nbsp; Sélectionner le fichier JSON
          </Button>
        </label>
        {/* Fix for PWA on iOS: */}
        <StyledButton variant="outlined" onClick={handleImportFromLink}>
          <Link /> &nbsp; Importer à partir d'un lien
        </StyledButton>
      </Box>
    </>
  );
};

export default ImportExport;

const TaskContainer = styled(Box)<{ backgroundclr: string; selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 8px;
  padding: 10px 4px;
  border-radius: 16px;
  background: #19172b94;
  border: 2px solid ${(props) => props.backgroundclr};
  box-shadow: ${(props) => props.selected && `0 0 8px 1px ${props.backgroundclr}`};
  transition: 0.3s all;
  width: 300px;
  cursor: "pointer";
`;

const ListContent = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 6px;
`;

const DropZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  border: 2px dashed ${ColorPalette.blueSky};
  border-radius: 16px;
  padding: 32px 64px;
  text-align: center;
  max-width: 300px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  max-height: 350px;

  overflow-y: auto;

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #ffffff15;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff30;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #ffffff50;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #ffffff15;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 18px;
  border-radius: 14px;
  width: 300px;

  &:disabled {
    color: #ffffff58;
    border-color: #ffffff58;
  }
`;
