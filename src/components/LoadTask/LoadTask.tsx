//TODO: Move code to component, Markdown is overkill and styles bad!
// TODO: Move inputs to component?

import React, {useEffect, useState} from "react";
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import {FormControl, InputLabel, makeStyles, MenuItem, Paper, Select, Typography} from "@material-ui/core";
import ReactMarkdown from 'react-markdown'
import TaskTheme from "../../my_types/TaskTheme";
import Task from "../../my_types/Task";
import TaskResultDialog from "./TaskResultDialog";
import "@fontsource/roboto-mono/300.css"


const useStyles = makeStyles((styles: Theme) => ({
  paper: {
    marginTop: styles.spacing(4),
    marginBottom: styles.spacing(4),
    margin: "auto",
    padding: styles.spacing(2),
    width: "600px",
  },
  markdown: {
    fontFamily: 'Roboto Mono',
    fontSize: '1rem',
  },
  text: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  lastInput: {
    marginBottom: "1.5rem"
  }
}));

export default function LoadTask() {
  const [themes, setLessons] = useState<TaskTheme[]>([]);
  const [themeId, setLessonid] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([])
  const [taskId, setTaskId] = useState(0)

  useEffect(() => {
    fetch("/tasks")
      .then(r => r.json())
      .then(data => {
        setLessons(data[0] as TaskTheme[])
        setTasks(data[1] as Task[])
      })
  }, []);

  const handleChangeTheme = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLessonid(event.target.value as number);
  }

  const handleChangeTask = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTaskId(event.target.value as number);
  }

  const styles = useStyles();

  return (
    <Paper className={styles.paper}>
      <FormControl fullWidth>
        <InputLabel id={"theme-id-label"}>Тема</InputLabel>
        <Select
          labelId={"theme-id-label"}
          id={"theme-id-select"}
          value={themeId}
          disabled={!themes.length}
          onChange={handleChangeTheme}
        >
          {
            themes.map(theme => (
              <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>))
          }
        </Select>
      </FormControl>
      <FormControl className={styles.lastInput} fullWidth>
        <InputLabel id={"task-id-label"}>Упражнение</InputLabel>
        <Select
          labelId={"task-id-label"}
          id={"task-id-select"}
          value={taskId}
          disabled={!themeId}
          onChange={handleChangeTask}
        >
          {
            tasks.filter(task => task.theme === themeId)
              .map(task => (
                <MenuItem key={task.id} value={task.id}>{task.id}</MenuItem>))
          }
        </Select>
      </FormControl>
      {taskId
        ? (
          <React.Fragment>
            <Typography variant={"h5"}>Текст задачи:</Typography>
            <Typography className={styles.text}>{tasks[taskId - 1].text}</Typography>
            <Typography variant={"h5"}>Пример ввода:</Typography>
            <ReactMarkdown className={styles.markdown}>{"```\n" + tasks[taskId - 1].input + "\n```"}</ReactMarkdown>
            <Typography variant={"h5"}>Пример вывода:</Typography>
            <ReactMarkdown className={styles.markdown}>{"```\n" + tasks[taskId - 1].output + "\n```"}</ReactMarkdown>
          </React.Fragment>
        )
        : null}
      <TaskResultDialog taskId={taskId} />
    </Paper>
  )
}