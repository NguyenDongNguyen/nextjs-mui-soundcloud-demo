import Box from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react';
import NewPlaylist from '@/components/playlist/new.playlist';
import AddPlaylistTrack from '@/components/playlist/add.playlist.track';
import CurrentTrack from '@/components/playlist/current.track';

interface Iprops {
    playlists: IPlaylist[];
    tracks: ITrackTop[];
}

const Playlist = (props: Iprops) => {
    const { playlists, tracks } = props;

    return (
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
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontSize: '20px', color: '#ccc' }}>
                                        {playlist.tieuDe}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {playlist?.ChiTietDanhSaches?.map(
                                        (track, index: number) => {
                                            return (
                                                <Fragment key={track.id}>
                                                    {index === 0 && <Divider />}
                                                    <CurrentTrack track={track} />
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
    );
};

export default Playlist;
