import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { useToast } from '@/utils/toast';
import { TextField } from '@mui/material';
import { sendRequest } from '@/utils/api';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    outline: 'none !important',
    boxShadow: 24,
    p: 4,
    padding: '25px',
};

interface Iprops {
    open: boolean;
    setOpen: (v: boolean) => void;
}

const ForgotPassword = ({ open, setOpen }: Iprops) => {
    const toast = useToast();
    const handleOpen = () => setOpen(true);
    const [email, setEmail] = useState<string>('');
    const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<string>('');

    const handleSubmit = async () => {
        if (!email) {
            setIsErrorEmail(true);
            setErrorEmail('Email is not empty.');
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
            method: 'POST',
            body: { email },
        });
        if (res.data) {
            toast.success(res.message);
            setEmail('');
            setOpen(false);
        } else {
            toast.error(res.message);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '500px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '34px',
                                textAlign: 'center',
                                marginBottom: '32px',
                                fontWeight: '600',
                            }}
                        >
                            Don’t know your password?
                        </h2>
                        <div>Your email address or profile URL</div>
                        <TextField
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            label="Your email address or profile URL"
                            name="email"
                            margin="dense"
                            autoFocus
                            error={isErrorEmail}
                            helperText={errorEmail}
                        />
                        <p
                            style={{
                                fontSize: '13px',
                                color: '#999',
                                margin: '15px 0 12px',
                            }}
                        >
                            We’ll send you a link to change your password. If you still
                            need help,{' '}
                            <span style={{ color: '#044dd2', cursor: 'pointer' }}>
                                visit our Help Center
                            </span>
                            .
                        </p>
                        <Button
                            className="button-edit"
                            variant="contained"
                            size="small"
                            style={{
                                backgroundColor: '#ff5500',
                                color: '#fff',
                                textTransform: 'unset',
                                fontSize: '16px',
                                padding: '6px 15px',
                                marginBottom: '10px',
                            }}
                            onClick={handleSubmit}
                        >
                            Request a password reset
                        </Button>
                        <div>
                            <Button
                                className="button-edit"
                                variant="text"
                                size="small"
                                fullWidth
                                onClick={handleClose}
                                style={{
                                    color: '#333',
                                    textTransform: 'unset',
                                    fontSize: '16px',
                                    padding: '6px 15px',
                                    textAlign: 'center',
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ForgotPassword;
