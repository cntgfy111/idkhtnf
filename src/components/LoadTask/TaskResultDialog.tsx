import React, {useState} from "react";
import ReactMarkdown from 'react-markdown'
import {
  Button, CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Paper,
  Typography
} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import {SentimentVeryDissatisfied} from "@material-ui/icons";
import TaskResult from "../../my_types/TaskResult";

export default function TaskResultDialog(props: {taskId: number}) {
  const [open, setOpen ] = useState(false);
  const [ dialogText, setDialogText] = useState("");
  const [ taskResult, setTasResult ] = useState(<React.Fragment/>);

  const handleClose = () => setOpen(false);

  const loadTaskAndGetResult = (event: React.ChangeEvent<{ files: unknown }>) => {
    setDialogText("Загружаем..")
    setTasResult(<CircularProgress />)
    setOpen(true)

    const file = (event.target.files as FileList)[0];
    fetch(`/tasks/${props.taskId}`, {
      method: "POST",
      body: file
    }).then(r => r.json())
      .then(res => {
        setTasResult(proccesRequst(res))
        setDialogText("")
        console.log(res)
        console.log(typeof res)
      })

    setDialogText("Проверяем...")
  }

  const proccesRequst = (raw_result: TaskResult | string) => {
    if (typeof raw_result === "string") {
      return (
        <React.Fragment>
          <DoneIcon />
          <Typography>Все тесты пройдены!</Typography>
        </React.Fragment>
      )
    }


    if (raw_result.WA) {
      return (
        <React.Fragment>
          <ErrorIcon />
          <Typography>Неправильный ответ в тесте {raw_result.WA[0]}</Typography>
          <Typography>Правильный ответ:</Typography>
          <ReactMarkdown>{"```\n" + raw_result.WA[1] + "\n```"}</ReactMarkdown>
          <Typography>Твой ответ:</Typography>
          <ReactMarkdown>{"```\n" + raw_result.WA[2] + "\n```"}</ReactMarkdown>
        </React.Fragment>
      )
    }

    if (raw_result.RE) {
      return (
        <React.Fragment>
          <SentimentVeryDissatisfied />
          <Typography>Программа завершилась с ошибкой на тесте {raw_result.RE[0]}</Typography>
          <Typography>Текст ошибки:</Typography>
          <ReactMarkdown>{"```\n" + raw_result.RE[1] + "\n```"}</ReactMarkdown>
        </React.Fragment>
      )
    }

    return <React.Fragment />
  };

  return (
    <React.Fragment>
      <input
        accept="text/x-lua"
        hidden
        id="load-file-button"
        type="file"
        onChange={loadTaskAndGetResult}
      />
      <label htmlFor="load-file-button">
        <Button color="primary" variant="contained" component="span">
          Загрузить
        </Button>
      </label>
      <Dialog
        open={open}
        onClose={handleClose}
      >
      <DialogTitle id={"result-dialog-title"}>Результаты</DialogTitle>
      <DialogContent>
        {taskResult}
      </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}