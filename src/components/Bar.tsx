import React from 'react';
import {AppBar, Button, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export default function Bar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton className={classes.menuButton} edge={"start"}
                    color={"inherit"} aria-label={"menu"}>
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant={"h6"}>
                        Однажды тут будет меню
                    </Typography>
                    <Button color={"inherit"}>А тут вход</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}