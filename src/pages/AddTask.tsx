import { Category, Task } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, ColorPalette, Container, StyledInput } from "../styles";
import { CancelRounded, Edit } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect } from "../components/CategorySelect";
import { TopBar } from "../components/TopBar";
import { ColorPicker } from "../components/ColorPicker";
import { CustomEmojiPicker } from "../components/CustomEmojiPicker";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";

const AddTask = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useStorageState<string>("", "name", "sessionStorage");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "emoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(ColorPalette.blueSky, "color", "sessionStorage");
  const [description, setDescription] = useStorageState<string>(
    "",
    "description",
    "sessionStorage"
  );
  const [deadline, setDeadline] = useStorageState<string>("", "deadline", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage"
  );

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Add Task";
    if (name.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`
      );
    } else {
      setDescriptionError("");
    }
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name !== "") {
      if (name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        return; // Do not add the task if the name or description exceeds the maximum length
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategories ? selectedCategories : [],
      };

      setUser((prevUser) => ({
        ...prevUser,
        tasks: [...prevUser.tasks, newTask],
      }));

      n("/");
      toast.success((t) => (
        <div onClick={() => toast.dismiss(t.id)}>
          Tâche ajoutée - <b>{newTask.name}</b>
        </div>
      ));
    } else {
      toast.error((t) => <div onClick={() => toast.dismiss(t.id)}>Task name is required.</div>);
    }
  };

  return (
    <>
      <TopBar title="Ajouter une nouvelle tâche" />
      <Container>
        <CustomEmojiPicker
          emoji={typeof emoji === "string" ? emoji : undefined}
          setEmoji={setEmoji}
          color={color}
        />
        <StyledInput
          label="Nom de la tâche"
          name="name"
          placeholder="Saisir le nom de la tâche"
          value={name}
          onChange={handleNameChange}
          focused
          required
          error={nameError !== ""}
          helpercolor={nameError && ColorPalette.red}
          helperText={
            name === ""
              ? undefined
              : !nameError
                ? `${name.length}/${TASK_NAME_MAX_LENGTH}`
                : nameError
          }
        />
        <StyledInput
          label="Description de la tâche (facultatif)"
          name="name"
          placeholder="Saisir la description de la tâche"
          value={description}
          onChange={handleDescriptionChange}
          multiline
          rows={4}
          focused
          error={descriptionError !== ""}
          helpercolor={descriptionError && ColorPalette.red}
          helperText={
            description === ""
              ? undefined
              : !descriptionError
                ? `${description.length}/${DESCRIPTION_MAX_LENGTH}`
                : descriptionError
          }
        />
        <StyledInput
          label="Date limite d'exécution de la tâche (facultatif)"
          name="name"
          placeholder="Saisir la date limite"
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
          defaultValue=""
          focused
          sx={{ colorScheme: "dark" }}
          InputProps={{
            startAdornment:
              deadline && deadline !== "" ? (
                <InputAdornment position="start">
                  <Tooltip title="Clear">
                    <IconButton color="error" onClick={() => setDeadline("")}>
                      <CancelRounded />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : undefined,
          }}
        />
        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <br />
            {/* <Typography sx={{ fontWeight: 500 }}>Category (optional)</Typography> */}

            <CategorySelect
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              width="400px"
            />
            <Link to="/categories">
              <Button
                sx={{
                  margin: "8px 0 24px 0 ",
                  padding: "12px 24px",
                  borderRadius: "12px",
                }}
              >
                <Edit /> &nbsp; Modifier les catégories
              </Button>
            </Link>
          </>
        )}
        <ColorPicker
          color={color}
          width="400px"
          onColorChange={(color) => {
            setColor(color);
          }}
        />
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH
          }
        >
          Créer une tâche
        </AddTaskButton>
      </Container>
    </>
  );
};

export default AddTask;
