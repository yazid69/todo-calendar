import { ReactNode, useEffect, useState, useContext, useMemo } from "react";
import { AddTaskBtn } from "../components/AddTaskBtn";
import { Tasks } from "../components/Tasks";
import { getRandomGreetings } from "../utils/getRandomGreetings";
import { TodayRounded, WifiOff } from "@mui/icons-material";
import { displayGreetings } from "../utils/displayGreetings";
import { Emoji } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import {
  GreetingHeader,
  GreetingText,
  Offline,
  ProgressPercentageContainer,
  StyledProgress,
  TaskCompletionText,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer,
} from "../styles/home.styled";
import { UserContext } from "../contexts/UserContext";
import { Box, Typography } from "@mui/material";
import { ColorPalette } from "../styles";
import { getTaskCompletionText } from "../utils/getTaskCompletionText";

const Home = () => {
  const [randomGreetings, setRandomGreetings] = useState<string | ReactNode>(
    ""
  );
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const { user } = useContext(UserContext);
  const { tasks, emojisStyle, name, settings } = user;
  const [greetingKey, setGreetingKey] = useState<number>(0);

  const [tasksWithDeadlineTodayCount, setTasksWithDeadlineTodayCount] =
    useState<number>(0);
  const [tasksDueTodayNames, setTasksDueTodayNames] = useState<string[]>([]);

  const completedTaskPercentage = useMemo<number>(
    () => (completedTasksCount / tasks.length) * 100,
    [completedTasksCount, tasks.length]
  );

  const isOnline = useOnlineStatus();

  useEffect(() => {
    setRandomGreetings(getRandomGreetings());
    document.title = "Todo App";

    const interval = setInterval(() => {
      setRandomGreetings(getRandomGreetings());
      setGreetingKey((prevKey) => prevKey + 1); // Update the key on each interval
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completedCount = tasks.filter((task) => task.done).length;
    setCompletedTasksCount(completedCount);

    const today = new Date().setHours(0, 0, 0, 0);

    const dueTodayTasks = tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
        return taskDeadline === today && !task.done;
      }
      return false;
    });

    setTasksWithDeadlineTodayCount(dueTodayTasks.length);

    // Use Intl to format and display task names due today
    const taskNamesDueToday = dueTodayTasks.map((task) => task.name);
    setTasksDueTodayNames(taskNamesDueToday);
  }, [tasks]);

  const replaceEmojiCodes = (text: string): ReactNode[] => {
    const emojiRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // It's an emoji code, render Emoji component
        const emojiCode = part.trim();
        return (
          <Emoji
            key={index}
            size={20}
            unified={emojiCode}
            emojiStyle={emojisStyle}
          />
        );
      } else {
        // It's regular text
        return part;
      }
    });
  };

  const renderGreetingWithEmojis = (text: string | ReactNode) => {
    if (typeof text === "string") {
      return replaceEmojiCodes(text);
    } else {
      // It's already a ReactNode, no need to process
      return text;
    }
  };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={emojisStyle} /> &nbsp;{" "}
        {displayGreetings()}
        {name && <span translate="no">, {name}</span>}
      </GreetingHeader>
      <GreetingText key={greetingKey}>
        {renderGreetingWithEmojis(randomGreetings)}
      </GreetingText>
      {!isOnline && (
        <Offline>
          <WifiOff /> Vous êtes hors ligne mais vous pouvez toujours utiliser l'application.
        </Offline>
      )}
      {tasks.length > 0 && (
        <TasksCountContainer>
          <TasksCount glow={settings[0].enableGlow}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <StyledProgress
                variant="determinate"
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                aria-label="Progress"
                style={{
                  filter: settings[0].enableGlow
                    ? `drop-shadow(0 0 6px ${ColorPalette.blueSky + "C8"})`
                    : "none",
                }}
              />

              <ProgressPercentageContainer>
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px", fontWeight: 600 }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                {completedTasksCount === 0
                  ? `You have ${tasks.length} task${
                      tasks.length > 1 ? "s" : ""
                    } to complete.`
                  : `You've completed ${completedTasksCount} out of ${tasks.length} tasks.`}
              </TaskCountHeader>
              <TaskCompletionText>
                {getTaskCompletionText(completedTaskPercentage)}
              </TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span
                  style={{
                    opacity: 0.8,
                    display: "inline-block",
                  }}
                >
                  <TodayRounded
                    sx={{ fontSize: "20px", verticalAlign: "middle" }}
                  />
                  &nbsp;Tasks due today:&nbsp;
                  <span translate="no">
                    {new Intl.ListFormat("fr", { style: "long" }).format(
                      tasksDueTodayNames
                    )}
                  </span>
                </span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}
      <Tasks />

      <AddTaskBtn animate={tasks.length === 0} />
    </>
  );
};

export default Home;
