'use client';
import '../track-liked/profile.track.liked.scss';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTrackContext } from '@/lib/track.wrapper';
import { useState } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import Link from 'next/link';

interface Iprops {
    data: ITrackTop;
}

const ProfileTrackUploaded = (props: Iprops) => {
    const { data } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    return (
        <div key={data.id} style={{ width: 'fit-content' }}>
            <div className="imgThumb">
                <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.linkAnh}`}
                    height={170}
                    width={170}
                />
                <div className="wrapper-action">
                    <div
                        style={{
                            borderRadius: '50%',
                            background: '#f50',
                            height: '50px',
                            width: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {(data.id !== currentTrack.id ||
                            (data.id === currentTrack.id &&
                                currentTrack.isPlaying === false)) && (
                            <IconButton
                                aria-label="play/pause"
                                onClick={(e) => {
                                    setCurrentTrack({ ...data, isPlaying: true });
                                }}
                            >
                                <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />
                            </IconButton>
                        )}
                        {data.id === currentTrack.id &&
                            currentTrack.isPlaying === true && (
                                <IconButton
                                    aria-label="play/pause"
                                    onClick={(e) => {
                                        setCurrentTrack({ ...data, isPlaying: false });
                                    }}
                                >
                                    <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
                                </IconButton>
                            )}
                    </div>
                </div>
            </div>
            <Link
                href={`/track/${data.id}?audio=${data.linkNhac}&id=${data.id}`}
                style={{
                    textDecoration: 'none',
                }}
            >
                <h4
                    style={{
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: '400',
                        lineHeight: '1.2 !important',
                    }}
                >
                    {data.tieuDe}
                </h4>
            </Link>
            <h5
                style={{
                    color: '#999',
                    fontSize: '14px',
                    fontWeight: '400',
                }}
            >
                {data.moTa}
            </h5>
        </div>
    );
};

export default ProfileTrackUploaded;
