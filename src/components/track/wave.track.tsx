'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from '@/utils/customHook';
import { WaveSurferOptions } from 'wavesurfer.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import './wave.scss';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import { useTrackContext } from '@/lib/track.wrapper';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import CommentTrack from './comment.track';
import LikeTrack from './like.track';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[];
    listTrack: ITrackTop[];
    user: IUserDetail;
    trackLiked: ITrackLike[];
    playlists: IPlaylist[];
}

const WaveTrack = (props: IProps) => {
    const { track, comments, listTrack, user, trackLiked, playlists } = props;
    const router = useRouter();
    const firstViewRef = useRef(true);

    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>('0:00');
    const [duration, setDuration] = useState<string>('0:00');
    const [listFollowing, setListFollowing] = useState<IUserFollow[] | []>([]);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, '#656666'); // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
            gradient.addColorStop(1, '#B1B1B1'); // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            progressGradient.addColorStop(0, '#EE772F'); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7) / canvas.height,
                '#EB4926'
            ); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 1) / canvas.height,
                '#ffffff'
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 2) / canvas.height,
                '#ffffff'
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 3) / canvas.height,
                '#F6B094'
            ); // Bottom color
            progressGradient.addColorStop(1, '#F6B094'); // Bottom color
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`,
        };
    }, []);
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform.addEventListener(
            'pointermove',
            (e) => (hover.style.width = `${e.offsetX}px`)
        );

        const subscriptions = [
            wavesurfer.on('play', () => {
                setIsPlaying(true);
                if (track?.theLoai !== currentTrack.theLoai) {
                    console.log('test oke', track);
                    setCurrentTrack({
                        ...track!,
                        isPlaying: false,
                    });
                }
            }),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.once('interaction', () => {
                wavesurfer.play();
            }),
        ];

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    useEffect(() => {
        fetchlistFollowing();
    }, []);

    const fetchlistFollowing = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${user.id}`,
            method: 'GET',
            queryParams: { current: 1, pageSize: 100, status: 'followee' },
            nextOption: {
                next: { tags: ['follow-by-user'] },
            },
        });
        if (res.data?.result) {
            setListFollowing(res?.data?.result ?? []);
        }
    };

    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    };

    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`;
    };

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack]);

    useEffect(() => {
        if (track?.id && !currentTrack?.id) {
            setCurrentTrack({ ...track, isPlaying: false });
        }
    }, [track]);

    // useEffect(() => {
    //     if (track) {
    //         if (track?.category !== currentTrack.category) {
    //             console.log('test oke', track);
    //             setCurrentTrack({ ...track!, isPlaying: false });
    //         }
    //     }
    // }, [wavesurfer]);

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
                method: 'POST',
                body: {
                    trackId: track?.id,
                },
            });

            //fetch data ở phía server để cập nhật lại dlieu
            router.refresh();
            // chỉ cho số lượt view tăng 1 lần
            firstViewRef.current = false;
        }
    };

    const handleFollow = async (followeeId: number) => {
        await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow`,
            method: 'POST',
            body: {
                followerId: user.id, //ng theo dõi
                followeeId: followeeId, //ng được theo dõi
                quantity: -1,
            },
        });
        fetchlistFollowing();
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div
                style={{
                    display: 'flex',
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background:
                        'linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)',
                }}
            >
                <div
                    className="left"
                    style={{
                        width: '75%',
                        height: 'calc(100% - 10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div className="info" style={{ display: 'flex' }}>
                        <div>
                            <div
                                onClick={() => {
                                    onPlayClick();
                                    handleIncreaseView();
                                    if (track && wavesurfer) {
                                        setCurrentTrack({
                                            ...currentTrack,
                                            isPlaying: false,
                                        });
                                    }
                                }}
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
                                {isPlaying === true ? (
                                    <PauseIcon sx={{ fontSize: 30, color: 'white' }} />
                                ) : (
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: 'white' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div
                                style={{
                                    padding: '0 5px',
                                    background: '#333',
                                    fontSize: 30,
                                    width: 'fit-content',
                                    color: 'white',
                                }}
                            >
                                {track?.tieuDe}
                            </div>
                            <div
                                style={{
                                    padding: '0 5px',
                                    marginTop: 10,
                                    background: '#333',
                                    fontSize: 20,
                                    width: 'fit-content',
                                    color: 'white',
                                }}
                            >
                                {track?.moTa}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time">{time}</div>
                        <div className="duration">{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div
                            className="overlay"
                            style={{
                                position: 'absolute',
                                height: '30px',
                                width: '100%',
                                bottom: '0',
                                // background: "#ccc"
                                backdropFilter: 'brightness(0.5)',
                            }}
                        ></div>
                        <div className="comments" style={{ position: 'relative' }}>
                            {comments.map((item) => {
                                return (
                                    <Tooltip title={item.noiDung} arrow key={item.id}>
                                        <img
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = calLeft(
                                                    item.thoiGianBaiNhac
                                                );
                                            }}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                position: 'absolute',
                                                top: 71,
                                                zIndex: 20,
                                                left: calLeft(item.thoiGianBaiNhac),
                                            }}
                                            // src={fetchDefaultImages(
                                            //     item.ThanhVien.loaiTk
                                            // )}
                                            src={
                                                item.ThanhVien.hinhAnh
                                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${item.ThanhVien.hinhAnh}`
                                                    : fetchDefaultImages(
                                                          item.ThanhVien.loaiTk
                                                      )
                                            }
                                        />
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className="right"
                    style={{
                        width: '25%',
                        padding: 15,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {track?.linkAnh ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.linkAnh}`}
                            style={{
                                height: 'auto',
                                width: '100%',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                background: '#ccc',
                                width: 250,
                                height: 250,
                            }}
                        ></div>
                    )}
                </div>
            </div>

            <div>
                <LikeTrack track={track} trackLiked={trackLiked} playlists={playlists} />
            </div>

            <div>
                <Grid container spacing={3} columns={12}>
                    <Grid item md={9}>
                        <CommentTrack
                            // comments={comments}
                            track={track}
                            wavesurfer={wavesurfer}
                            user={user}
                        />
                    </Grid>
                    <Grid item md={3} style={{ marginTop: '50px', marginBottom: '25px' }}>
                        <div className="sidebar-header">
                            <GraphicEqIcon style={{ width: '24px', height: '24px' }} />
                            <span>Bài hát liên quan</span>
                        </div>
                        {listTrack?.slice(0, 4).map((data) => (
                            <div className="sidebar-content">
                                <div className="imgThumb">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.linkAnh}`}
                                        height={50}
                                        width={50}
                                    />
                                    <div className="wrapper-action">
                                        <div
                                            style={{
                                                borderRadius: '50%',
                                                background: '#f50',
                                                height: '25px',
                                                width: '25px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {(data.id !== currentTrack.id ||
                                                (data.id === currentTrack.id &&
                                                    currentTrack.isPlaying ===
                                                        false)) && (
                                                <IconButton
                                                    aria-label="play/pause"
                                                    onClick={(e) => {
                                                        setCurrentTrack({
                                                            ...data,
                                                            isPlaying: true,
                                                        });
                                                    }}
                                                >
                                                    <PlayArrowIcon
                                                        sx={{
                                                            fontSize: 22,
                                                            color: 'white',
                                                        }}
                                                    />
                                                </IconButton>
                                            )}
                                            {data.id === currentTrack.id &&
                                                currentTrack.isPlaying === true && (
                                                    <IconButton
                                                        aria-label="play/pause"
                                                        onClick={(e) => {
                                                            setCurrentTrack({
                                                                ...data,
                                                                isPlaying: false,
                                                            });
                                                        }}
                                                    >
                                                        <PauseIcon
                                                            sx={{
                                                                fontSize: 22,
                                                                color: 'white',
                                                            }}
                                                        />
                                                    </IconButton>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="sidebar-content-des">{data.moTa}</h5>
                                    <Link
                                        href={`/track/${data.id}?audio=${data.linkNhac}&id=${data.id}`}
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <h4 className="sidebar-content-title">
                                            {data.tieuDe}
                                        </h4>
                                    </Link>
                                    <div className="sidebar-content-info">
                                        <span>
                                            <PlayArrowIcon
                                                style={{
                                                    width: '18px',
                                                    height: '14px',
                                                }}
                                            />
                                            {data.tongLuotXem}
                                        </span>
                                        <span>
                                            <FavoriteIcon
                                                style={{
                                                    width: '16px',
                                                    height: '12px',
                                                }}
                                            />
                                            {data.tongYeuThich}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div>
                            <div className="sidebar-header">
                                <GroupIcon style={{ width: '24px', height: '24px' }} />
                                <span>Nghệ sĩ bạn theo dõi</span>
                            </div>
                            {listFollowing.map((user) => (
                                <div className="sidebar-content">
                                    <div className="imgThumb">
                                        <img
                                            src={
                                                user?.followee.hinhAnh
                                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.followee.hinhAnh}`
                                                    : fetchDefaultImages(
                                                          user?.followee.loaiTk
                                                      )
                                            }
                                            height={50}
                                            width={50}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Link
                                            href={``}
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <h4 className="sidebar-content-title">
                                                {user?.followee.ten}
                                            </h4>
                                        </Link>
                                        <div className="sidebar-content-info">
                                            <span>
                                                <GroupIcon
                                                    style={{
                                                        width: '18px',
                                                        height: '14px',
                                                    }}
                                                />
                                                {user?.followee.tongTheoDoi}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            padding: '1px 8px',
                                            fontSize: '12px',
                                            backgroundColor: 'transparent',
                                            boxShadow: 'unset',
                                            border: '1px solid #FF5500',
                                            color: '#FF5500',
                                            textTransform: 'unset',
                                            fontWeight: '100',
                                        }}
                                        startIcon={<PersonRemoveIcon />}
                                        onClick={() => handleFollow(user?.followee.id)}
                                    >
                                        Đã theo dõi
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default WaveTrack;
