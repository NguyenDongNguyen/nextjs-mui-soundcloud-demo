import Box from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment, useState } from 'react';
import NewPlaylist from '@/components/playlist/new.playlist';
import AddPlaylistTrack from '@/components/playlist/add.playlist.track';
import CurrentTrack from '@/components/playlist/current.track';
import { Button } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/toast';

const style = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 448,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    padding: '25px',
};

interface Iprops {
    playlists: IPlaylist[];
    tracks: ITrackTop[];
}

const Playlist = (props: Iprops) => {
    const { playlists, tracks } = props;
    const [open, setOpen] = useState(false);
    const [idPlaylist, setIdPlaylist] = useState<number | null>(null);
    const [namePlaylist, setNamePlaylist] = useState<string>('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();
    const toast = useToast();

    const handleRemovePlaylist = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${idPlaylist}`,
            method: 'DELETE',
        });

        if (res.data) {
            handleClose();
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

    return (
        <>
            <Box sx={{ mt: 3, p: 3, background: '#f3f6f9', borderRadius: '3px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h3>Danh sách phát</h3>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <NewPlaylist />
                        <AddPlaylistTrack playlists={playlists} tracks={tracks} />
                    </div>
                </Box>
                <Divider variant="middle" />
                <Box sx={{ mt: 3 }}>
                    {playlists &&
                        playlists?.map((playlist) => {
                            return (
                                <Accordion key={playlist.id}>
                                    <AccordionSummary
                                        expandIcon={
                                            <DeleteIcon
                                                sx={{ ':hover': { color: '#f50' } }}
                                                onClick={() => {
                                                    handleOpen();
                                                    setIdPlaylist(playlist.id);
                                                    setNamePlaylist(playlist.tieuDe);
                                                }}
                                            />
                                        }
                                        sx={{
                                            '.mui-yw020d-MuiAccordionSummary-expandIconWrapper.Mui-expanded':
                                                { transform: 'rotate(0)' },
                                        }}
                                    >
                                        <Typography
                                            sx={{ fontSize: '20px', color: '#ccc' }}
                                        >
                                            {playlist.tieuDe}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {playlist?.ChiTietDanhSaches?.map(
                                            (track, index: number) => {
                                                return (
                                                    <Fragment key={track.id}>
                                                        {index === 0 && <Divider />}
                                                        <CurrentTrack
                                                            track={track}
                                                            idPlaylist={playlist.id}
                                                        />
                                                        <Divider />
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                        {playlist?.ChiTietDanhSaches?.length === 0 && (
                                            <span>No data.</span>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                </Box>
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            paddingBottom: '4px',
                            borderBottom: '1px solid #f1f1f1',
                            marginBottom: '24px',
                            fontSize: '24px',
                            fontWeight: '400',
                        }}
                    >
                        Xoá danh sách phát
                    </Typography>
                    <Typography sx={{ mt: 2, marginBottom: '10px' }}>
                        Bạn có chắc chắn muốn xóa {namePlaylist} không? Hành động này
                        không thể được hoàn tác
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'end', gap: '5px' }}>
                        <Button
                            variant="text"
                            size="small"
                            sx={{
                                padding: '3px 0px',
                                color: '#333',
                                fontSize: '16px',
                                fontWeight: '400',
                                textTransform: 'unset',
                                ':hover': { backgroundColor: 'transparent' },
                            }}
                            onClick={handleClose}
                        >
                            Thoát
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                padding: '0px',
                                borderColor: '#e5e5e5',
                                color: '#333',
                                fontSize: '16px',
                                fontWeight: '400',
                                textTransform: 'unset',
                                ':hover': { color: '#f50', borderColor: '#f50' },
                            }}
                            onClick={() => handleRemovePlaylist()}
                        >
                            Xoá
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Playlist;
