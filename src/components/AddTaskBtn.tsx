import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AddRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ColorPalette, pulseAnimation } from "../styles";
import { Button, Tooltip } from "@mui/material";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { getFontColorFromHex } from "../utils/getFontColorFromHex";

interface AddTaskBtnProps {
  animate: boolean
}

export const AddTaskBtn = ({ animate }: AddTaskBtnProps): JSX.Element | null => {
  const { user } = useContext(UserContext);
  const { tasks, settings } = user;
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  if (isMobile) {
    return null;
  }

  return (
    <Tooltip title={tasks.length > 0 ? "Ajouter une nouvelle tâche" : "Ajouter la tâche"} placement="left">
      <Btn
        animate={animate}
        glow={settings[0].enableGlow}
        onClick={() => n("add")}
        aria-label="Add Task"
      >
        <AddRounded style={{ fontSize: "44px" }} />
      </Btn>
    </Tooltip>
  );
};

const Btn = styled(Button) <{ animate: boolean; glow: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  width: 72px;
  height: 72px;
  border-radius: 100%;
  background-color: ${ColorPalette.blueSky};
  color: ${getFontColorFromHex(ColorPalette.blueSky)};
  right: 16vw;
  box-shadow: ${({ glow }) => (glow ? `0px 0px 32px -8px ${ColorPalette.blueSky}` : "none")};
  transition: background-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;

  &:hover {
    box-shadow: none;
    background-color: ${ColorPalette.blueSky};
    backdrop-filter: blur(6px);
  }

  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}

  @media (max-width: 1024px) {
    right: 24px;
  }
`;
