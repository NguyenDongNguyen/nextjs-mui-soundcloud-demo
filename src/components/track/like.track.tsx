import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/toast';
import { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    padding: '16px 25px 0px',
};
interface IProps {
    track: ITrackTop | null;
    trackLiked: ITrackLike[];
    playlists: IPlaylist[];
}
const LikeTrack = (props: IProps) => {
    const { track, trackLiked, playlists } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        if (!session?.user.id) {
            toast.error(' Please log in before add track to playlist ');
            return;
        }
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const [value, setValue] = useState('1');
    const [title, setTitle] = useState<string>('');
    console.log('🚀 ~ LikeTrack ~ title:', title);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleLikeTrack = async () => {
        if (!session?.user.id) {
            toast.error(' Please log in before liking this song ');
            return;
        }

        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: 'POST',
            body: {
                track: track?.id,
                quantity: trackLiked?.some((t) => t.id === track?.id) ? -1 : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: 'GET',
            queryParams: {
                tag: 'handle-like-track',
                secret: 'justArandomString',
            },
        });

        router.refresh();
    };

    const handleAddOrRemoveTrack = async (idPlaylist: number, api: string) => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${api}`,
            method: 'PATCH',
            body: {
                idPlaylist: idPlaylist,
                idTrack: track?.id,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        if (res.data) {
            toast.success(res.message);
            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: 'POST',
                queryParams: {
                    tag: 'playlist-by-user',
                    secret: 'justArandomString',
                },
            });
            router.refresh();
        } else {
            toast.error(res.message);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!title) {
            toast.error('Title is not empty!');
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: 'POST',
            body: { title, isPublic: true },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        if (res.data) {
            toast.success('Create new playlist successfully!');
            //thêm track vào playlist sao khi tạo mới
            await handleAddOrRemoveTrack(res.data.id, 'add-track');
            setTitle('');

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: 'POST',
                queryParams: {
                    tag: 'playlist-by-user',
                    secret: 'justArandomString',
                },
            });
            router.refresh();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <>
            <div
                style={{
                    margin: '20px 10px 0 10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <Chip
                        onClick={() => handleLikeTrack()}
                        sx={{ borderRadius: '5px', marginRight: '15px' }}
                        size="medium"
                        variant="outlined"
                        color={
                            trackLiked?.some((t) => t.id === track?.id)
                                ? 'error'
                                : 'default'
                        }
                        clickable
                        icon={<FavoriteIcon />}
                        label="Yêu thích"
                    />
                    <Chip
                        onClick={handleOpen}
                        sx={{ borderRadius: '5px' }}
                        size="medium"
                        variant="outlined"
                        clickable
                        icon={<PlaylistAddIcon />}
                        label="Thêm vào danh sách phát"
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: '100px',
                        gap: '20px',
                        color: '#999',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <PlayArrowIcon sx={{ fontSize: '20px' }} /> {track?.tongLuotXem}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <FavoriteIcon sx={{ fontSize: '20px' }} /> {track?.tongYeuThich}
                    </span>
                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                                // textColor="secondary"
                                // indicatorColor="secondary"
                                sx={{
                                    '.Mui-selected': {
                                        color: `#ff5500 !important`,
                                    },
                                    '.MuiButtonBase-root': {
                                        fontWeight: '400',
                                        fontSize: '22px',
                                        color: '#333333',
                                        textTransform: 'unset',
                                    },
                                }}
                                TabIndicatorProps={{
                                    style: { background: '#ff5500' },
                                }}
                            >
                                <Tab label="Thêm vào danh sách" value="1" />
                                <Tab label="Tạo mới danh sách" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <p
                                className="title-profile"
                                style={{ paddingBottom: '10px' }}
                            >
                                Thêm bài nhạc vào bất kì danh sách nào bạn muốn
                            </p>
                            {playlists?.map((playlist) => (
                                <Grid
                                    container
                                    spacing={4}
                                    columns={24}
                                    alignItems="center"
                                    sx={{ marginBottom: '15px' }}
                                >
                                    <Grid item md={3} lg={3}>
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${playlist?.ChiTietDanhSaches[0]?.linkAnh}`}
                                            alt=""
                                            height={50}
                                            width={50}
                                        />
                                    </Grid>
                                    <Grid item md={14} lg={14}>
                                        <div>
                                            <h4
                                                style={{
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {playlist.tieuDe}
                                            </h4>
                                            <p
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#666',
                                                }}
                                            >
                                                <GraphicEqIcon
                                                    style={{
                                                        width: '16px',
                                                        height: '12px',
                                                    }}
                                                />
                                                {playlist.ChiTietDanhSaches.length}
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item md={7} lg={7}>
                                        {playlist.ChiTietDanhSaches?.some(
                                            (t) => t.BaiNhacid === track?.id
                                        ) ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    textAlign: 'center',
                                                    color: '#f50',
                                                    borderColor: '#f50',
                                                    outline: '#e5e5e5',
                                                    textTransform: 'unset',
                                                    fontWeight: '400',
                                                }}
                                                onClick={() =>
                                                    handleAddOrRemoveTrack(
                                                        playlist.id,
                                                        'remove-track'
                                                    )
                                                }
                                            >
                                                Đã thêm
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    color: '#333',
                                                    borderColor: '#e5e5e5',
                                                    outline: '#e5e5e5',
                                                    textTransform: 'unset',
                                                    fontWeight: '400',
                                                }}
                                                onClick={() =>
                                                    handleAddOrRemoveTrack(
                                                        playlist.id,
                                                        'add-track'
                                                    )
                                                }
                                            >
                                                Thêm vào
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                        </TabPanel>
                        <TabPanel value="2">
                            <p style={{ marginBottom: '8px' }}>
                                Tiêu đề danh sách<span style={{ color: '#f50' }}>*</span>
                            </p>
                            <TextField
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    '.MuiInputBase-input': { padding: '2px 7px' },
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '15px 0px 25px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                    }}
                                >
                                    <span> Chế độ: </span>
                                    <FormControl
                                        sx={{
                                            '.mui-vqmohf-MuiButtonBase-root-MuiRadio-root.Mui-checked ':
                                                { color: '#404040' },
                                        }}
                                    >
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel
                                                value="true"
                                                control={<Radio />}
                                                label="Công khai"
                                            />
                                            <FormControlLabel
                                                value="false"
                                                control={<Radio />}
                                                label="Riêng tư"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div>
                                    <Button
                                        className="button-edit"
                                        variant="contained"
                                        size="small"
                                        style={{
                                            backgroundColor: '#ff5500',
                                            color: '#fff',
                                            textTransform: 'unset',
                                        }}
                                        onClick={handleCreatePlaylist}
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: '1px solid #ebebeb',
                                }}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.linkAnh}`}
                                    alt=""
                                    height={20}
                                    width={20}
                                />
                                <span style={{ color: '#999', fontSize: '14px' }}>
                                    {track?.moTa}
                                </span>
                                -
                                <span style={{ color: '#333', fontSize: '14px' }}>
                                    {track?.tieuDe}
                                </span>
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Modal>
        </>
    );
};

export default LikeTrack;
