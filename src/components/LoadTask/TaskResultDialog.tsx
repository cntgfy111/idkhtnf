import React, {useState} from "react";
import ReactMarkdown from 'react-markdown'
import {Button, CircularProgress, Dialog, DialogContent, DialogTitle, makeStyles, Typography} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import {CloudOff, SentimentVeryDissatisfied} from "@material-ui/icons";
import TaskResult from "../../my_types/TaskResult";
import {Theme} from '@material-ui/core/styles/createMuiTheme';

const useStyles = makeStyles((styles: Theme) => ({
  markdown: {
    fontFamily: 'Roboto Mono',
    fontSize: '1rem',
  },
  icon: {
    margin: "auto",
    display: "flex",
    fontSize: "3rem",
    color: styles.palette.primary.main
  },
  text: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
}));


export default function TaskResultDialog(props: { taskId: number }) {
  const styles = useStyles();


  const [open, setOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [taskResult, setTasResult] = useState(<React.Fragment/>);

  const handleClose = () => setOpen(false);

  const loadTaskAndGetResult = (event: React.ChangeEvent<{ files: unknown }>) => {
    setDialogText("Загружаем..")
    setTasResult(<CircularProgress/>)
    setOpen(true)

    const file = (event.target.files as FileList)[0];
    fetch(`/tasks/${props.taskId}`, {
      method: "POST",
      body: file
    }).then(r => r.ok ? r.json() : "err")
      .then(res => {
        setTasResult(processRequest(res))
        setDialogText("")
      })

    setDialogText("Проверяем...")
  }

  const processRequest = (raw_result: TaskResult | string) => {
    if (typeof raw_result === "string") {
      if (raw_result === "OK") {
        return (
          <React.Fragment>
            <DoneIcon className={styles.icon}/>
            <Typography>Все тесты пройдены!</Typography>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <CloudOff className={styles.icon}/>
            <Typography>Сервер, видимо, обиделся. Попросите Степана его прибодрить.</Typography>
          </React.Fragment>
        )
      }
    }


    if (raw_result.WA) {
      return (
        <React.Fragment>
          <ErrorIcon className={styles.icon}/>
          <Typography className={styles.text}>Неправильный ответ в тесте {raw_result.WA[0]}</Typography>
          <Typography>Правильный ответ:</Typography>
          <ReactMarkdown className={styles.markdown}>{"```\n" + raw_result.WA[1] + "\n```"}</ReactMarkdown>
          <Typography>Твой ответ:</Typography>
          <ReactMarkdown className={styles.markdown}>{"```\n" + raw_result.WA[2] + "\n```"}</ReactMarkdown>
        </React.Fragment>
      )
    }

    if (raw_result.RE) {
      return (
        <React.Fragment>
          <SentimentVeryDissatisfied className={styles.icon}/>
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
        <Typography variant={"h4"}>{dialogText}</Typography>
        {taskResult}
      </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}