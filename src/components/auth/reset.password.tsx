'use client';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';

const ResetPassword = ({ id, token }: { id: string; token: string }) => {
    const toast = useToast();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPass, setComfirmPass] = useState<string>('');

    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
    const [isErrorConfirm, setIsErrorConfirm] = useState<boolean>(false);

    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorConfirm, setErrorConfirm] = useState<string>('');

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [resMessage, setResMessage] = useState<string>('');

    const handleSubmit = async () => {
        setIsErrorPassword(false);
        setIsErrorConfirm(false);
        setErrorPassword('');
        setErrorConfirm('');

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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password/${id}/${token}`,
            method: 'POST',
            body: { password },
        });
        console.log('🚀 ~ handleSubmit ~ res:', res);
        if (res?.data) {
            //redirect to home
            toast.success(res.message);
            router.push('/auth/signin');
        } else {
            setOpenMessage(true);
            toast.error(res?.message);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100vh',
            }}
        >
            <div
                style={{
                    height: 'auto',
                    maxWidth: '660px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '2px',
                }}
            >
                <div style={{ padding: '86px 56px' }}>
                    <h1
                        style={{
                            textAlign: 'center',
                            fontSize: '32px',
                            color: '#333',
                            fontWeight: '500',
                        }}
                    >
                        Thay đổi mật khẩu của bạn
                    </h1>
                    <p
                        style={{
                            fontSize: '17px',
                            color: '#999',
                            margin: '18px 0',
                            textAlign: 'center',
                        }}
                    >
                        Chọn một mật khẩu mạnh và duy nhất. <br /> các mẹo chọn mật khẩu
                        an toàn,{' '}
                        <span style={{ color: '#38d' }}>
                            truy cập Trung tâm trợ giúpr
                        </span>
                        .
                    </p>
                    <div>Nhập mật khẩu mới của bạn</div>
                    <TextField
                        onChange={(event) => setPassword(event.target.value)}
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
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

                    <div>Nhập lại mật khẩu mới của bạn để xác nhận</div>
                    <TextField
                        onChange={(event) => setComfirmPass(event.target.value)}
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        name="confirmPass"
                        label="Nhập lại mật khẩu"
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
                        Lưu
                    </Button>
                </div>
            </div>

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

export default ResetPassword;
