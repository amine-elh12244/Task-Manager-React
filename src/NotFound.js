import { useTheme } from "@mui/material";

const NotFound = () => {

    const theme = useTheme();

    const style = {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '150px',
        fontSize: '50px',
        color: theme.palette.blue.first
    }

    return <p style={style}>Page non trouvée</p>
}

export default NotFound;