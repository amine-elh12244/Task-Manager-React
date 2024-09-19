import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApiSlice';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ClockingIn from '../assets/ClockingIn.jpg';
import Schedule from '../assets/Schedule.webp';
import ScheduleComputer from '../assets/ScheduleComputer.webp';
import ScheduleBook from '../assets/ScheduleBook.webp';
import { Grid, useTheme } from '@mui/material';
import { isAdmin } from 'utils/Roles';

const Login = () => {

  //Images Functionality
  const images = [ClockingIn, Schedule, ScheduleComputer, ScheduleBook];
  const [imageLogin, setImageLogin] = useState(0);

  //Login Functionality
  const theme = useTheme();
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const [remember, setRemember] = useState(false);

  const handleRememberMeChange = (e) => setRemember(e.target.checked);

  useEffect(() => {
    userRef.current && userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ user, pwd }).unwrap();
      dispatch(setCredentials({ ...userData, remember }));
      setUser('');
      setPwd('');
      navigate(isAdmin(userData?.user) ? '/utilisateurs' : '/clients');
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg('Aucune réponse du serveur');
      } else if (err.originalStatus === 400) {
        setErrMsg('Nom d\'utilisateur ou mot de passe manquant');
      } else if (err.originalStatus === 401) {
        setErrMsg('Nom d\'utilisateur ou mot de passe incorrect');
      } else {
        setErrMsg('Échec de la connexion');
      }
      errRef.current && errRef.current.focus();
    }
  };


  const handleUserInput = (e) => setUser(e.target.value);

  const handlePwdInput = (e) => setPwd(e.target.value);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageLogin((prev) => (prev + 1) % images?.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={0} sx={{
      height: "100vh",
      overflow: "hidden",
      '@media (max-width: 900px)': {
        overflow: 'inherit'
      }
    }}>
      
      <Grid item md={7} xs={12} sx={{
        '@media (max-width: 900px)': {
          display: "none"
        }
      }}>
        <img src={images[imageLogin]} alt={imageLogin} width={"100%"} height={"100%"} style={{ objectFit: "cover" }} />
      </Grid>
      <Grid item md={5} xs={12} sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Typography component="h1" variant="h5" sx={{
          fontWeight: "bold",
          fontSize: "clamp(32px, 4vw, 40px)",
          color: theme.palette.blue.first,
          textAlign: "center"
        }}>
          Task Manager
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit} sx={{ ml: 4, mr: 4, mt: 10 }}>
          <TextField
            variant="outlined"
            required
            fullWidth
            type="tel"
            id="matricule"
            label="Matricule"
            name="matricule"
            ref={userRef}
            value={user}
            onChange={handleUserInput}
            inputProps={{
              maxLength: 6
            }}
            sx={{ mb: 4 }}
          />

          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            id="password"
            label="Mot de passe"
            type="password"
            onChange={handlePwdInput}
            value={pwd}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" onChange={handleRememberMeChange} />}
            label="Se souvenir de moi"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="error">
            {errMsg}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: theme.palette.blue.first,
              height: 45,
              mb: 10
            }}
          >
            Se connecter
          </Button>
          <Typography component="h5" variant="h5" textAlign={"center"} color={theme.palette.gray.second}>Créée par Louizi 2024.</Typography>
        </Box>
      </Grid>
    </Grid >
  );
};

export default Login;
