import React, {useEffect, useState} from "react";
import {Button, FormControl, InputLabel, makeStyles, MenuItem, Paper, Select, Typography} from "@material-ui/core";
import ReactMarkdown from 'react-markdown'
import Theme from "../../my_types/Theme";
import Task from "../../my_types/Task";
import TaskResultDialog from "./TaskResultDialog";

export default function LoadTask() {
  const [themes, setLessons] = useState<Theme[]>([]);
  const [themeId, setLessonid] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([])
  const [taskId, setTaskId] = useState(0)

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/tasks")
      .then(r => r.json())
      .then(data => {
        setLessons(data[0] as Theme[])
        setTasks(data[1] as Task[])
      })
  }, []);

  const handleChangeTheme = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLessonid(event.target.value as number);
  }

  const handleChangeTask = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTaskId(event.target.value as number);
  }

  return (
    <Paper>
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
      <FormControl fullWidth>
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
            <Typography>{tasks[taskId - 1].text}</Typography>
            <Typography variant={"h5"}>Пример ввода:</Typography>
            <ReactMarkdown>{"```\n" + tasks[taskId - 1].input + "\n```"}</ReactMarkdown>
            <Typography variant={"h5"}>Пример вывода:</Typography>
            <ReactMarkdown>{"```\n" + tasks[taskId - 1].output + "\n```"}</ReactMarkdown>
          </React.Fragment>
        )
        : null}
        <TaskResultDialog taskId={taskId} />
    </Paper>
  )
}