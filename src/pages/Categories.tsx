import { useContext, useEffect, useState } from "react";
import { ColorPicker, CustomEmojiPicker, TopBar } from "../components";
import { Category } from "../types/user";
import { useNavigate } from "react-router-dom";
import { Emoji } from "emoji-picker-react";
import styled from "@emotion/styled";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { CATEGORY_NAME_MAX_LENGTH } from "../constants";
import { getFontColorFromHex } from "../utils/getFontColorFromHex";
import { ColorPalette, DialogBtn, fadeIn } from "../styles";
import toast from "react-hot-toast";
import NotFound from "./NotFound";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";

const Categories = () => {
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useStorageState<string>("", "catName", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "catEmoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(
    ColorPalette.blueSky,
    "catColor",
    "sessionStorage"
  );

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editNameError, setEditNameError] = useState<string>("");
  const [editEmoji, setEditEmoji] = useState<string | undefined>();
  const [editColor, setEditColor] = useState<string>(ColorPalette.blueSky);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo Calendar - Catégories";
    if (!user.settings[0].enableCategories) {
      n("/");
    }
    if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Le nom est trop long maximum ${CATEGORY_NAME_MAX_LENGTH} caractères`);
    }
  }, []);

  useEffect(() => {
    setEditColor(
      user.categories.find((cat) => cat.id === selectedCategoryId)?.color || ColorPalette.blueSky
    );
    setEditName(user.categories.find((cat) => cat.id === selectedCategoryId)?.name || "");
    setEditNameError("");
  }, [selectedCategoryId]);

  const handleDelete = (categoryId: number) => {
    if (categoryId) {
      const categoryName =
        user.categories.find((category) => category.id === categoryId)?.name || "";
      const updatedCategories = user.categories.filter((category) => category.id !== categoryId);
      // Remove the category from tasks that have it associated
      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.filter((category) => category.id !== categoryId);
        return {
          ...task,
          category: updatedCategoryList,
        };
      });

      setUser({
        ...user,
        categories: updatedCategories,
        tasks: updatedTasks,
      });
      toast.success(() => (
        <div>
          Catégorie supprimée - <b>{categoryName}.</b>
        </div>
      ));
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Name is too long (maximum ${CATEGORY_NAME_MAX_LENGTH} characters)`);
    } else {
      setNameError("");
    }
  };

  const handleEditNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditName(newName);
    if (newName.length > CATEGORY_NAME_MAX_LENGTH) {
      setEditNameError(`Name is too long (maximum ${CATEGORY_NAME_MAX_LENGTH} characters)`);
    } else {
      setEditNameError("");
    }
  };

  const handleAddCategory = () => {
    if (name !== "") {
      if (name.length > CATEGORY_NAME_MAX_LENGTH) {
        return;
      }
      const newCategory: Category = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        name,
        emoji: emoji !== "" && emoji !== null ? emoji : undefined,
        color,
      };
      toast.success(() => (
        <div>
          Catégorie ajoutée - <b>{newCategory.name}</b>
        </div>
      ));
      setUser((prevUser) => ({
        ...prevUser,
        categories: [...prevUser.categories, newCategory],
      }));

      setName("");
      setColor(ColorPalette.blueSky);
      setEmoji("");
    } else {
      toast.error((t) => <div onClick={() => toast.dismiss(t.id)}>Le nom de la catégorie est obligatoire.</div>);
    }
  };

  const handleEditDimiss = () => {
    setSelectedCategoryId(0);
    setOpenEditDialog(false);
    setEditColor(ColorPalette.blueSky);
    setEditName("");
    setEditEmoji(undefined);
  };

  const handleEditCategory = () => {
    if (selectedCategoryId) {
      const updatedCategories = user.categories.map((category) => {
        if (category.id === selectedCategoryId) {
          return {
            ...category,
            name: editName,
            emoji: editEmoji || undefined,
            color: editColor,
          };
        }
        return category;
      });

      const updatedTasks = user.tasks.map((task) => {
        const updatedCategoryList = task.category?.map((category) => {
          if (category.id === selectedCategoryId) {
            return {
              id: selectedCategoryId,
              name: editName,
              emoji: editEmoji || undefined,
              color: editColor,
            };
          }
          return category;
        });

        return {
          ...task,
          category: updatedCategoryList,
        };
      });

      setUser({
        ...user,
        categories: updatedCategories,
        tasks: updatedTasks,
      });

      toast.success(() => (
        <div>
          Catégorie mise à jour - <b>{editName}</b>
        </div>
      ));
      setOpenEditDialog(false);
    }
  };

  if (!user.settings[0].enableCategories) {
    return <NotFound message="Les catégories ne sont pas activées." />;
  }

  return (
    <>
      <TopBar title="Catégories" />
      <Container>
        {user.categories.length > 0 ? (
          <CategoriesContainer>
            {user.categories.map((category) => {
              const categoryTasks = user.tasks.filter((task) =>
                task.category?.some((cat) => cat.id === category.id)
              );

              const completedTasksCount = categoryTasks.reduce(
                (count, task) => (task.done ? count + 1 : count),
                0
              );
              const totalTasksCount = categoryTasks.length;
              const completionPercentage =
                totalTasksCount > 0 ? Math.floor((completedTasksCount / totalTasksCount) * 100) : 0;

              const displayPercentage = totalTasksCount > 0 ? `(${completionPercentage}%)` : "";

              return (
                <CategoryDiv key={category.id} clr={category.color}>
                  <CategoryContent translate="no">
                    <span>
                      {category.emoji && (
                        <Emoji unified={category.emoji} emojiStyle={user.emojisStyle} />
                      )}
                    </span>
                    &nbsp;
                    <span style={{ wordBreak: "break-all", fontWeight: 600 }}>{category.name}</span>
                    <Tooltip title="Le pourcentage de réalisation des tâches assignées à cette catégorie">
                      <span style={{ opacity: 0.8, fontStyle: "italic" }}>{displayPercentage}</span>
                    </Tooltip>
                  </CategoryContent>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <ActionButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setOpenEditDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ActionButton>
                    <ActionButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          if (totalTasksCount > 0) {
                            // Open delete dialog if there are tasks associated to catagory
                            setOpenDeleteDialog(true);
                          } else {
                            // If no associated tasks, directly handle deletion
                            handleDelete(category.id);
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ActionButton>
                  </div>
                </CategoryDiv>
              );
            })}
          </CategoriesContainer>
        ) : (
          <p>Vous n'avez pas de catégories</p>
        )}
        <AddContainer>
          <h2>Ajouter une nouvelle catégorie</h2>
          <CustomEmojiPicker
            emoji={typeof emoji === "string" ? emoji : undefined}
            setEmoji={setEmoji}
            color={color}
          />
          <StyledInput
            focused
            required
            label="Nom de la catégorie"
            placeholder="Entrer le nom de la catégorie"
            value={name}
            onChange={handleNameChange}
            error={nameError !== ""}
            helperText={
              name == ""
                ? undefined
                : !nameError
                ? `${name.length}/${CATEGORY_NAME_MAX_LENGTH}`
                : nameError
            }
          />
          {/* <Typography>Color</Typography> */}
          <ColorPicker
            color={color}
            onColorChange={(color) => {
              setColor(color);
            }}
            width={360}
          />
          <AddCategoryButton
            onClick={handleAddCategory}
            disabled={name.length > CATEGORY_NAME_MAX_LENGTH}
          >
            Créer une catégorie
          </AddCategoryButton>
        </AddContainer>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            style: {
              borderRadius: "24px",
              padding: "12px",
              maxWidth: "600px",
            },
          }}
        >
          <DialogTitle>
            Confirmer la suppression de{" "}
            <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b>
          </DialogTitle>

          <DialogContent>
            La catégorie sera ainsi supprimée de votre liste et des tâches qui y sont associées.
          </DialogContent>

          <DialogActions>
            <DialogBtn onClick={() => setOpenDeleteDialog(false)}>Annuler</DialogBtn>
            <DialogBtn
              onClick={() => {
                handleDelete(selectedCategoryId);
                setOpenDeleteDialog(false);
              }}
              color="error"
            >
              Supprimer
            </DialogBtn>
          </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDimiss}
          PaperProps={{
            style: {
              borderRadius: "24px",
              padding: "12px",
              maxWidth: "600px",
            },
          }}
        >
          <DialogTitle>
            Modifier la catégorie
            {/* <b>{user.categories.find((cat) => cat.id === selectedCategoryId)?.name}</b> */}
          </DialogTitle>

          <DialogContent>
            <CustomEmojiPicker
              emoji={
                user.categories.find((cat) => cat.id === selectedCategoryId)?.emoji || undefined
              }
              setEmoji={setEditEmoji}
              width={300}
              color={editColor}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <EditNameInput
                label="Nom de la catégorie"
                placeholder="Nom de la catégorie"
                value={editName}
                error={editNameError !== ""}
                onChange={handleEditNameChange}
                helperText={
                  !editNameError ? `${editName.length}/${CATEGORY_NAME_MAX_LENGTH}` : editNameError
                }
              />
              <ColorPicker
                color={editColor}
                width={300}
                fontColor={ColorPalette.fontDark}
                onColorChange={(clr) => {
                  setEditColor(clr);
                }}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <DialogBtn onClick={handleEditDimiss}>Annuler</DialogBtn>
            <DialogBtn onClick={handleEditCategory} disabled={editNameError !== ""}>
              Enregistrer
            </DialogBtn>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Categories;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 350px;
  background: #ffffff15;
  overflow-y: auto;
  padding: 24px 18px;
  border-radius: 18px 0 0 18px;
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

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
`;

const CategoryDiv = styled.div<{ clr: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  margin: 6px 0;
  padding: 12px;
  border-radius: 18px;
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColorFromHex(clr)};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
  gap: 4px;
`;

const ActionButton = styled.div`
  background: #ffffffcd;
  border-radius: 100%;
  margin: 0 4px;
`;
const StyledInput = styled(TextField)`
  margin: 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 350px;
    color: white;
  }
  & .MuiFormHelperText-root {
    color: white;
    opacity: 0.8;
  }
`;

const EditNameInput = styled(TextField)`
  margin-top: 8px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 300px;
  }
`;

export const AddCategoryButton = styled(Button)`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: ${ColorPalette.blueSky};
  color: ${getFontColorFromHex(ColorPalette.blueSky)};
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 350px;
  text-transform: capitalize;
  &:hover {
    box-shadow: 0px 0px 24px 0px ${ColorPalette.blueSky + 80};
    background: ${ColorPalette.blueSky};
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;
