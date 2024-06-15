'use client';
import './current.track.scss';
import { useTrackContext } from '@/lib/track.wrapper';
import { convertSlugUrl, sendRequest } from '@/utils/api';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/toast';

interface IProps {
    track: IShareTrack;
    idPlaylist: number;
}
const CurrentTrack = (props: IProps) => {
    const { track, idPlaylist } = props;
    const router = useRouter();
    const toast = useToast();

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const handleRemoveTrack = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/remove-track`,
            method: 'PATCH',
            body: {
                idPlaylist: idPlaylist,
                idTrack: track?.BaiNhacid,
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

    return (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Typography
                className="wrapper-track"
                sx={{ py: 2, display: 'flex', alignItems: 'center', gap: '12px' }}
            >
                <div className="imgThumb">
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.linkAnh}`}
                        height={35}
                        width={35}
                    />
                    <div className="wrapper-action">
                        <div
                            style={{
                                borderRadius: '50%',
                                background: '#f50',
                                height: '22px',
                                width: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {(track.BaiNhacid !== currentTrack.id ||
                                (track.BaiNhacid === currentTrack.id &&
                                    currentTrack.isPlaying === false)) && (
                                <IconButton
                                    aria-label="play/pause"
                                    onClick={(e) => {
                                        setCurrentTrack({
                                            ...track,
                                            id: track.BaiNhacid!,
                                            isPlaying: true,
                                        });
                                    }}
                                >
                                    <PlayArrowIcon
                                        sx={{
                                            fontSize: 20,
                                            color: 'white',
                                        }}
                                    />
                                </IconButton>
                            )}
                            {track.BaiNhacid === currentTrack.id &&
                                currentTrack.isPlaying === true && (
                                    <IconButton
                                        aria-label="play/pause"
                                        onClick={(e) => {
                                            setCurrentTrack({
                                                ...track,
                                                id: track.BaiNhacid!,
                                                isPlaying: false,
                                            });
                                        }}
                                    >
                                        <PauseIcon
                                            sx={{
                                                fontSize: 20,
                                                color: 'white',
                                            }}
                                        />
                                    </IconButton>
                                )}
                        </div>
                    </div>
                </div>
                <Link
                    style={{ textDecoration: 'none', color: 'unset' }}
                    href={`/track/${track.BaiNhacid}?audio=${track.linkNhac}&id=${track.BaiNhacid}`}
                >
                    {track.tieuDe}
                </Link>
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <CloseIcon
                    sx={{
                        cursor: 'pointer',
                    }}
                    onClick={handleRemoveTrack}
                />
            </Box>
        </Box>
    );
};

export default CurrentTrack;
