import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    Stack,
    InputAdornment,
    IconButton,
    TextField,
    useTheme,
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { API_logIn } from '../../api/log-in';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/user/userSlice.js';
import { useNavigate } from 'react-router-dom'

const formStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    padding: '3em 0',
};

const passwordProps = (inputRef, showPassword) => ({
    inputRef,
    type: showPassword ? 'text' : 'password',
    label: 'Password',
    variant: 'outlined',
    id: 'password',
    sx: { '& .MuiInputBase-root ': { pr: '4px' } },
    autoComplete: 'new-password'
});

const usernameProps = (inputRef) => ({
    inputRef,
    type: 'email',
    id: 'username',
    label: 'E-mail',
    variant: 'outlined',
    autoComplete: 'off'
});

const getStackStyle = () => {
    const theme = useTheme();
    return {
        maxWidth: '500px',
        padding: '20px',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.grey.border}`,
        background: theme.palette.grey[50],
    };
};

const sendLogin = async (user, pass, dispatch, navigate) => {
    const result = await API_logIn(user, pass);
    console.error('LOGGED IN!', result);
    if (result.status === 200 && result.json) {
        console.log('DISPATCH', setCredentials);
        dispatch(setCredentials(result.json));
        navigate('/main', { replace: true });
    }
};

function Login() {
    const email = useRef(null);
    const password = useRef(null);
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        const user = email.current.value.replace(/\s+/g, '');
        const pwd = password.current.value.replace(/\s+/g, '');
        if (user === '') {
            // Please enter your email.
            email.current.focus();
        } else if (pwd === '') {
            // 'Please enter your password.'
            password.current.focus();
        } else {
            sendLogin(user, pwd, dispatch, navigate);
        }
    };

    const handleKeyPress = e => { 
        if (e.key === 'Enter') { loginHandler(e); }
    };

    /** Focus email input when component mounted. */
    useEffect(() => {
        email.current.focus();
    }, []);



    return (
        <div style={formStyle}>
            <Stack gap={3} sx={getStackStyle()} >

                <TextField {...usernameProps(email)} />

                <Stack gap={1}>

                    <TextField
                        {...passwordProps(password, showPassword)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            endAdornment: <ShowPassword 
                                handleClick={handleClickShowPassword}
                                handleMouseDown={handleMouseDownPassword}
                                showPassword={showPassword} />
                        }}
                    />

                    <Button variant="contained" onClick={loginHandler}>
                        Sign in
                    </Button>

                </Stack>

            </Stack>
        </div>
    );
}

export default Login;


const ShowPassword = (props) => {
    return (
        <InputAdornment position="end">
            <IconButton
                aria-label="toggle password visibility"
                onClick={props.handleClick}
                onMouseDown={props.handleMouseDown} >
                {props.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon /> }
            </IconButton>
        </InputAdornment>
    );
};
