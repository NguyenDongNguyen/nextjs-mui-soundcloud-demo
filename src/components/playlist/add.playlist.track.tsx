'use client';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useToast } from '@/utils/toast';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface IProps {
    playlists: IPlaylist[];
    tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
    const { playlists, tracks } = props;

    const [open, setOpen] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { data: session } = useSession();

    const [playlistId, setPlaylistId] = useState('');
    const [tracksId, setTracksId] = useState<string[]>([]);

    const theme = useTheme();

    const handleClose = (event: any, reason: any) => {
        if (reason && reason == 'backdropClick') return;
        setOpen(false);
        setPlaylistId('');
        setTracksId([]);
    };

    const getStyles = (name: string, tracksId: readonly string[], theme: Theme) => {
        return {
            fontWeight:
                tracksId.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    };

    const handleSubmit = async () => {
        if (!playlistId) {
            toast.error('Vui lòng chọn playlist!');
            return;
        }
        if (!tracksId.length) {
            toast.error('Vui lòng chọn tracks!');
            return;
        }

        const chosenPlaylist = playlists.find((i) => i.id === parseInt(playlistId));
        let tracks = tracksId?.map((item) => item?.split('###')?.[1]);

        //remove null/undefined/empty
        tracks = tracks?.filter((item) => item);
        if (chosenPlaylist) {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/multi-track`,
                method: 'PATCH',
                body: {
                    id: chosenPlaylist.id,
                    title: chosenPlaylist.tieuDe,
                    isPublic: chosenPlaylist.isPublic,
                    tracks: tracks,
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });

            if (res.data) {
                toast.success('Thêm track vào playlist thành công!');
                await sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: 'POST',
                    queryParams: {
                        tag: 'playlist-by-user',
                        secret: 'justArandomString',
                    },
                });
                handleClose('', '');
                router.refresh();
            } else {
                toast.error(res.message);
            }
        }
    };

    return (
        <>
            <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setOpen(true)}
            >
                Thêm nhiều bài nhạc
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
                <DialogTitle>Thêm bài nhạc vào danh sách:</DialogTitle>
                <DialogContent>
                    <Box
                        width={'100%'}
                        sx={{ display: 'flex', gap: '30px', flexDirection: 'column' }}
                    >
                        <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                            <InputLabel>Chọn danh sách</InputLabel>
                            <Select
                                value={playlistId}
                                label="Playlist"
                                onChange={(e) => setPlaylistId(e.target.value)}
                            >
                                {playlists.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.tieuDe}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl sx={{ mt: 5, width: '100%' }}>
                            <InputLabel id="demo-multiple-chip-label">
                                Bài nhạc
                            </InputLabel>
                            <Select
                                multiple
                                value={tracksId}
                                onChange={(e) => {
                                    setTracksId(e.target.value as any);
                                }}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Chip"
                                    />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => {
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={value?.split('###')?.[0]}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {tracks.map((track) => {
                                    return (
                                        <MenuItem
                                            key={track.id}
                                            value={`${track.tieuDe}###${track.id}`}
                                            style={getStyles(
                                                `${track.tieuDe}###${track.id}`,
                                                tracksId,
                                                theme
                                            )}
                                        >
                                            {track.tieuDe}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose('', '')}>Thoát</Button>
                    <Button onClick={() => handleSubmit()}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddPlaylistTrack;
