'use client';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { redirect, useRouter } from 'next/navigation';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Iprops {
    userVip: IUserVip;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UploadTabs = ({ userVip }: Iprops) => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [trackUpload, setTrackUpload] = React.useState({
        fileName: '',
        percent: 0,
        uploadedTrackName: '',
    });

    React.useEffect(() => {
        if (!userVip.trangThai) {
            setOpen(true);
        }
    }, []);

    const handleClose = (event: any, reason: any) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
            console.log('okeee');
            router.push('/next-pro');
        }
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Container
                sx={{
                    marginTop: '50px',
                    border: '1px solid #ddd',
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="Bài nhạc" disabled={value !== 0} />
                            <Tab label="Thông tin bài nhạc" disabled={value !== 1} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Step1
                            setValue={setValue}
                            setTrackUpload={setTrackUpload}
                            trackUpload={trackUpload}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Step2 trackUpload={trackUpload} setValue={setValue} />
                    </CustomTabPanel>
                </Box>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ color: '#d32f2f' }}>
                    {'Bạn không phải là thành viên VIP?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Hãy đăng ký trở thành thành viên vip của chúng tôi, bạn có thể
                        trải nghiệm nhiều tiện ích hơn như upload bài hát của mình,...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            margin: '0px 10px 10px 0px',
                            padding: '3px 0px',
                            borderColor: '#e5e5e5',
                            color: '#333',
                            fontSize: '16px',
                            fontWeight: '400',
                            textTransform: 'unset',
                            ':hover': { color: '#f50', borderColor: '#f50' },
                        }}
                        onClick={handleClose}
                    >
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadTabs;
