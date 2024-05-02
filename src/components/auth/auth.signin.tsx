'use client';
import './auth.signin.scss';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ForgotPassword from './forgot.password';

const AuthSignIn = (props: any) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

    const [errorUsername, setErrorUsername] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>('');

    const handleSubmit = async () => {
        setIsErrorUsername(false);
        setIsErrorPassword(false);
        setErrorUsername('');
        setErrorPassword('');

        if (!username) {
            setIsErrorUsername(true);
            setErrorUsername('Username is not empty.');
            return;
        }
        if (!password) {
            setIsErrorPassword(true);
            setErrorPassword('Password is not empty.');
            return;
        }

        const res = await signIn('credentials', {
            username: username,
            password: password,
            redirect: false,
        });
        if (!res?.error) {
            //redirect to home
            router.push('/discover');
        } else {
            setOpenMessage(true);
            setResMessage(res.error);
        }
    };

    return (
        <Box
            sx={
                {
                    // backgroundImage:
                    //     'linear-gradient(to bottom, #ff9aef, #fedac1, #d5e1cf, #b7e6d9)',
                    // backgroundColor: '#b7e6d9',
                    // backgroundRepeat: 'no-repeat',
                }
            }
        >
            <Grid
                container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                }}
            >
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    lg={4}
                    sx={{
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        margin: '40px 0',
                    }}
                >
                    <div style={{ margin: '20px' }}>
                        <Link href="/">
                            <ArrowBackIcon />
                        </Link>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                width: '100%',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: 'orange',
                                    width: '50px',
                                    height: '50px',
                                }}
                            >
                                <LockIcon />
                            </Avatar>

                            <Typography
                                component="h1"
                                style={{ padding: '8px 0px', fontWeight: '500' }}
                            >
                                To continue, login to Music Cloud
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                gap: '25px',
                                mt: 3,
                            }}
                        >
                            <div
                                className="social"
                                style={{ backgroundColor: '#3578e5' }}
                                onClick={() => signIn('facebook')}
                            >
                                <FacebookOutlinedIcon
                                    titleAccess="Login with Facebook"
                                    style={{ color: '#fff' }}
                                />
                                <span className="name-social">
                                    Continue with Facebook
                                </span>
                            </div>

                            <div
                                className="social"
                                onClick={() => signIn('github')}
                                style={{ backgroundColor: '#000' }}
                            >
                                <GitHubIcon
                                    titleAccess="Login with Github"
                                    style={{ color: '#fff' }}
                                />
                                <span className="name-social">Continue with Github</span>
                            </div>

                            <div
                                className="social"
                                onClick={() => signIn('google')}
                                style={{ border: '1px solid #ccc' }}
                            >
                                <GoogleIcon
                                    titleAccess="Login with Google"
                                    style={{ color: '#f93f2d' }}
                                />
                                <span className="name-social" style={{ color: '#000' }}>
                                    Continue with Google
                                </span>
                            </div>
                        </Box>
                        <Divider>Or using</Divider>

                        <TextField
                            onChange={(event) => setUsername(event.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            autoFocus
                            error={isErrorUsername}
                            helperText={errorUsername}
                        />
                        <TextField
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            error={isErrorPassword}
                            helperText={errorPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword === false ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            sx={{
                                my: 3,
                            }}
                            style={{ backgroundColor: '#f50' }}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                        <p
                            style={{
                                textAlign: 'center',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                            onClick={() => setOpen(true)}
                        >
                            Forgot your password?
                        </p>
                        <Divider style={{ margin: '10px 0px' }} />
                        <div style={{ textAlign: 'center', color: '#A7A7A7' }}>
                            Don't have an account?
                            <Link
                                href={'/auth/signup'}
                                style={{
                                    color: '#121212',
                                    textDecoration: 'underline',
                                    paddingLeft: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Sign up for Music Cloud
                            </Link>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <ForgotPassword open={open} setOpen={setOpen} />

            <Snackbar
                open={openMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenMessage(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AuthSignIn;
