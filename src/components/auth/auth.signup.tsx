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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';
import dayjs from 'dayjs';

const AuthSignUp = (props: any) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPass, setComfirmPass] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');

    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
    const [isErrorConfirm, setIsErrorConfirm] = useState<boolean>(false);
    const [isErrorBirthday, setIsErrorBirthday] = useState<boolean>(false);

    const [errorUsername, setErrorUsername] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorConfirm, setErrorConfirm] = useState<string>('');
    const [errorBirthday, setErrorBirthday] = useState<string>('');

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>('');

    const handleSubmit = async () => {
        setIsErrorUsername(false);
        setIsErrorEmail(false);
        setIsErrorPassword(false);
        setIsErrorConfirm(false);
        setErrorUsername('');
        setErrorEmail('');
        setErrorPassword('');
        setErrorConfirm('');

        if (!name) {
            setIsErrorUsername(true);
            setErrorUsername('Username is not empty.');
            return;
        }
        if (!email) {
            setIsErrorUsername(true);
            setErrorUsername('Email is not empty.');
            return;
        }
        if (!password) {
            setIsErrorPassword(true);
            setErrorPassword('Password is not empty.');
            return;
        }
        if (!confirmPass) {
            setIsErrorConfirm(true);
            setErrorConfirm('Confirm Password is not empty.');
            return;
        }
        if (confirmPass !== password) {
            setIsErrorConfirm(true);
            setErrorConfirm('Confirm Password is incorrect.');
            return;
        }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: 'POST',
            body: { email, name, password, birthday },
        });
        if (res?.data) {
            //redirect to home
            router.push('/auth/signin');
            setResMessage('Create account success, please sign in !');
        } else {
            setOpenMessage(true);
            setResMessage(res?.message);
        }
    };

    return (
        <Box>
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
                                Sign up to start listening
                            </Typography>
                        </Box>

                        <TextField
                            onChange={(event) => setName(event.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="name"
                            autoFocus
                            error={isErrorUsername}
                            helperText={errorUsername}
                        />
                        <TextField
                            onChange={(event) => setEmail(event.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoFocus
                            error={isErrorEmail}
                            helperText={errorEmail}
                        />
                        <TextField
                            onChange={(event) => setPassword(event.target.value)}
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
                        <TextField
                            onChange={(event) => setComfirmPass(event.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPass"
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            error={isErrorConfirm}
                            helperText={errorConfirm}
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
                        {/* data picker */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DemoItem label={'Birthday'}>
                                    <DatePicker
                                        // value={dayjs(birthday)}
                                        onChange={(date) =>
                                            //@ts-ignore
                                            setBirthday(date?.$d.toISOString())
                                        }
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>

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
                            Sign Up
                        </Button>
                        <Divider />

                        <Box
                            sx={{
                                gap: '25px',
                                mt: 3,
                            }}
                        >
                            <div
                                className="social"
                                style={{ backgroundColor: '#3578e5' }}
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
                                onClick={() => signIn('google')}
                                style={{ border: '1px solid #ccc' }}
                            >
                                <GoogleIcon
                                    titleAccess="Login with Google"
                                    style={{ color: 'orange' }}
                                />
                                <span className="name-social" style={{ color: '#000' }}>
                                    Continue with Google
                                </span>
                            </div>
                        </Box>

                        <Divider style={{ margin: '20px 0px' }} />
                        <div style={{ textAlign: 'center', color: '#A7A7A7' }}>
                            Already have an account?
                            <Link
                                href={'/auth/signin'}
                                style={{
                                    color: '#121212',
                                    textDecoration: 'underline',
                                    paddingLeft: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Log in here.
                            </Link>
                        </div>
                    </div>
                </Grid>
            </Grid>

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

export default AuthSignUp;
