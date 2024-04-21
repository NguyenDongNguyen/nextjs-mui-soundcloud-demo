import './profile.edit.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, TextField } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { IUser } from '@/types/next-auth';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 850,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface Iprops {
    open: boolean;
    setOpen: (v: boolean) => void;
    userInfo: IUserDetail;
}

const ProfileEdit = ({ open, setOpen, userInfo }: Iprops) => {
    const toast = useToast();
    const router = useRouter();
    const handleOpen = () => setOpen(true);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');

    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);

    const [errorUsername, setErrorUsername] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');

    useEffect(() => {
        if (userInfo?.id) {
            setName(userInfo?.ten);
            setEmail(userInfo?.email);
            setBirthday(userInfo?.ngaySinh);
        }
    }, [open]);

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userInfo.id}`,
            method: 'PATCH',
            body: { email, name, birthday },
        });

        if (res.data) {
            toast.success('Update user success !');
            setName('');
            setEmail('');
            setBirthday('');
            setOpen(false);
            router.refresh();
        } else {
            toast.error(res.message);
        }
    };

    const handleChangeAvatar = async (e: any) => {
        const formData = new FormData();
        formData.append('fileAvatar', e.target.files[0]);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/upload-avatar/${userInfo.id}`,
                formData
            );
            if (res.data) {
                toast.success(res.data.message);
            }
            router.refresh();
        } catch (error) {
            //@ts-ignore
            toast.error(error?.response?.data?.message);
        }
    };

    const handleClose = () => {
        setName('');
        setEmail('');
        setBirthday('');
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
                    <h2 className="title">Edit your Profile</h2>
                    <div>
                        <Grid container spacing={2} columns={24}>
                            <Grid item md={12} lg={9}>
                                <div className="avatar-upload">
                                    <div className="avatar-edit">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept=".png, .jpg, .jpeg"
                                            onChange={(e) => handleChangeAvatar(e)}
                                        />
                                        <label htmlFor="imageUpload">
                                            <CameraAltIcon
                                                style={{
                                                    paddingRight: '5px',
                                                }}
                                            />
                                            Updated image
                                        </label>
                                    </div>
                                    <img
                                        className="avatar-preview"
                                        src={
                                            userInfo.hinhAnh
                                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userInfo.hinhAnh}`
                                                : fetchDefaultImages(userInfo.loaiTk)
                                        }
                                        alt=""
                                    />
                                </div>
                            </Grid>
                            <Grid item md={12} lg={15}>
                                <div>Display name</div>
                                <TextField
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    autoFocus
                                    error={isErrorUsername}
                                    helperText={errorUsername}
                                />
                                <div>Email</div>
                                <TextField
                                    value={email}
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
                                    disabled
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={['DatePicker']}
                                        sx={{
                                            '.MuiStack-root': {
                                                width: '100% !important',
                                            },
                                        }}
                                    >
                                        <DemoItem label={'Birthday'}>
                                            <DatePicker
                                                value={dayjs(birthday)}
                                                onChange={(date) =>
                                                    //@ts-ignore
                                                    setBirthday(date?.$d.toISOString())
                                                }
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="action-button">
                        <Button
                            className="button-edit"
                            variant="outlined"
                            size="small"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="button-edit"
                            variant="contained"
                            size="small"
                            style={{ backgroundColor: '#ff5500', color: '#fff' }}
                            onClick={handleSubmit}
                        >
                            Save changes
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ProfileEdit;
