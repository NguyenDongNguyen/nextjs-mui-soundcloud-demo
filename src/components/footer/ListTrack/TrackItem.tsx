import './TrackItem.scss';
import Link from 'next/link';
import { useTrackContext } from '@/lib/track.wrapper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';

interface IProps {
    track: ITrackTop;
}

function TrackItem({ track }: IProps) {
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    return (
        <div className="wrapper_book_item" key={track.id}>
            <img
                className="avatar"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.linkAnh}`}
                alt=""
            />
            <div className="info">
                <span style={{ color: '#999' }}>{track.moTa}</span>
                <h4 className="name">
                    <span>{track.tieuDe}</span>
                </h4>
            </div>
            {(track.id !== currentTrack.id ||
                (track.id === currentTrack.id && currentTrack.isPlaying === false)) && (
                <IconButton
                    aria-label="play/pause"
                    onClick={(e) => {
                        setCurrentTrack({ ...track, isPlaying: true });
                    }}
                >
                    <PlayArrowIcon sx={{ height: 25, width: 25 }} />
                </IconButton>
            )}

            {track.id === currentTrack.id && currentTrack.isPlaying === true && (
                <IconButton
                    aria-label="play/pause"
                    onClick={(e) => {
                        setCurrentTrack({ ...track, isPlaying: false });
                    }}
                >
                    <PauseIcon sx={{ height: 25, width: 25 }} />
                </IconButton>
            )}
        </div>
    );
}

export default TrackItem;
