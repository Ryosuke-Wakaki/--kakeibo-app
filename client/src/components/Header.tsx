import { AppBar, Toolbar, Typography } from "@mui/material";

export const Header = () => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6">家計簿</Typography>
            </Toolbar>
        </AppBar>
    );
};
