import styled from "@emotion/styled";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColorPalette, PathName } from "../styles";
import { ReactNode, useEffect } from "react";

interface NotFoundProps {
  message?: string | ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo Calendar - Cette page est introuvable.";
  }, []);

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Description>
        {message ? (
          message
        ) : (
          <div>
            Cette page{" "}
            <PathName>
              {location.pathname.length > 32
                ? location.pathname.substring(0, 29) + "..."
                : location.pathname}
            </PathName>{" "}
            est introuvable.
          </div>
        )}
      </Description>
      <BackButton variant="outlined" onClick={() => n("/")}>
        <ArrowBackIosNew /> &nbsp; Retourner aux tâches
      </BackButton>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100vw;
  line-height: 2em;
`;

const ErrorCode = styled.h1`
  font-size: 128px;
  color: ${ColorPalette.blueSky};
`;

const Description = styled.p`
  font-size: 22px;
  line-height: 1.8em;
  margin: 32px;
`;

const BackButton = styled(Button)`
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 16px;
  margin: 16px;
`;
