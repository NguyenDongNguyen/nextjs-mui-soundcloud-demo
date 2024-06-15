'use client';
import './app.footer.scss';
import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/utils/customHook';
import { Container, Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useRef, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import CloseIcon from '@mui/icons-material/Close';
import HeadlessTippy from '@tippyjs/react/headless';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { sendRequest } from '@/utils/api';
import TrackItem from './ListTrack/TrackItem';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/toast';
import Link from 'next/link';

interface IProps {
    trackLiked: ITrackLike[];
}

const AppFooter = ({ trackLiked }: IProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const toast = useToast();
    const hasMounted = useHasMounted();
    const playerRef = useRef(null);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    console.log('🚀 ~ AppFooter ~ currentTrack:', currentTrack);
    const [listTrack, setListTrack] = useState<ITrackTop[]>([]);
    const [showResult, setShowResult] = useState(false);

    // const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

    // const fetchTrackLiked = async () => {
    //     if (session?.access_token) {
    //         const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    //             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    //             method: 'GET',
    //             queryParams: {
    //                 current: 1,
    //                 pageSize: 100,
    //                 id: session.user.id,
    //             },
    //             headers: {
    //                 Authorization: `Bearer ${session?.access_token}`,
    //             },
    //             nextOption: {
    //                 next: { tags: ['handle-like-track'] },
    //             },
    //         });
    //         if (res2?.data?.result) setTrackLikes(res2?.data?.result);
    //     }
    // };
    // useEffect(() => {
    //     fetchTrackLiked();
    // }, [currentTrack]);

    useEffect(() => {
        if (currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
        if (currentTrack?.isPlaying === true) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
    }, [currentTrack.isPlaying]);

    // if (currentTrack?.isPlaying ) {
    //     //@ts-ignore
    //     playerRef?.current?.audio?.current?.play();
    // }else {
    //     //@ts-ignore
    //     playerRef?.current?.audio?.current?.pause();
    // }

    useEffect(() => {
        if (currentTrack.theLoai) {
            fetchListTrack();
        }
    }, [currentTrack?.theLoai]);

    const fetchListTrack = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
            method: 'POST',
            body: { category: currentTrack.theLoai, limit: 100 },
        });
        if (res?.data) {
            setListTrack(res?.data);
        }
    };

    // const findTrack = () => {
    //     if (currentTrack && listTrack) {
    //         const index = listTrack.findIndex((track) => {
    //             track.id == currentTrack.id;
    //         });
    //         console.log('🚀 ~ index ~ index:', index);
    //     }
    // };
    // findTrack();

    const handleNext = () => {
        const index = listTrack.findIndex((track) => {
            return track.id == currentTrack.id;
        });
        if (index > -1) {
            const i = index + 1;
            // đến bài cuối thì qlai bài đầu
            if (i === listTrack.length) {
                return setCurrentTrack({ ...listTrack[0], isPlaying: true });
            }
            setCurrentTrack({ ...listTrack[i], isPlaying: true });
        }
    };

    const handlePrev = () => {
        const index = listTrack.findIndex((track) => {
            return track.id == currentTrack.id;
        });
        if (index > -1) {
            const i = index - 1;
            // đang ở bài dầu thì xuống bài cuối
            if (i < 0) {
                return setCurrentTrack({
                    ...listTrack[listTrack.length - 1],
                    isPlaying: true,
                });
            }
            setCurrentTrack({ ...listTrack[i], isPlaying: true });
        }
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
                track: currentTrack?.id,
                quantity: trackLiked?.some((t) => t.id === currentTrack?.id) ? -1 : 1,
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

    // xử lý nếu pre-render ở server thì render ra fragment
    if (!hasMounted) return <></>; //fragment

    return (
        <>
            {currentTrack.id && (
                <div style={{ marginTop: 50 }}>
                    <AppBar
                        position="fixed"
                        sx={{
                            top: 'auto',
                            bottom: 0,
                            background: '#f2f2f2',
                        }}
                    >
                        <Container
                            disableGutters
                            sx={{
                                display: 'flex',
                                gap: 10,
                                '.rhap_main': {
                                    gap: '30px',
                                },
                            }}
                        >
                            <AudioPlayer
                                ref={playerRef}
                                layout="horizontal-reverse"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.linkNhac}`}
                                volume={0.5}
                                style={{
                                    boxShadow: 'unset',
                                    background: '#f2f2f2',
                                }}
                                onPlay={() => {
                                    setCurrentTrack({ ...currentTrack, isPlaying: true });
                                }}
                                onPause={() => {
                                    setCurrentTrack({
                                        ...currentTrack,
                                        isPlaying: false,
                                    });
                                }}
                                showSkipControls
                                onClickNext={handleNext}
                                onClickPrevious={handlePrev}
                                onEnded={handleNext}
                            />
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${currentTrack.linkAnh}`}
                                    height={40}
                                    width={40}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',
                                        justifyContent: 'center',
                                        width: '220px',
                                    }}
                                >
                                    <div
                                        title={currentTrack.moTa}
                                        style={{
                                            width: '100%',
                                            color: '#ccc',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {currentTrack.moTa}
                                    </div>
                                    <Link
                                        href={`/track/${currentTrack.id}?audio=${currentTrack.linkNhac}&id=${currentTrack.id}`}
                                        style={{
                                            width: '100%',
                                            color: 'black',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
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
                                            {currentTrack.tieuDe}
                                        </h4>
                                    </Link>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100px',
                                    gap: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                <FavoriteIcon
                                    onClick={() => handleLikeTrack()}
                                    sx={{
                                        borderRadius: '5px',
                                        color: trackLiked?.some(
                                            (t) => t.id === currentTrack?.id
                                        )
                                            ? '#f50'
                                            : '#333',
                                    }}
                                />
                                <HeadlessTippy
                                    interactive
                                    visible={showResult && listTrack.length > 0}
                                    // visible={true}
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <div
                                            className="search-result"
                                            tabIndex={-1}
                                            {...attrs}
                                        >
                                            <div className="wrapper">
                                                <PerfectScrollbar
                                                    style={{
                                                        maxHeight: '488px',
                                                        backgroundColor:
                                                            'rgb(255, 255, 255)',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            alignItems: 'center',
                                                            position: 'fixed',
                                                            top: 0,
                                                            left: 0,
                                                            background:
                                                                'rgb(255, 255, 255)',
                                                            width: '409px',
                                                            padding: '10px 24px',
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <h4 className="search-title">
                                                            Next up
                                                        </h4>
                                                        <span
                                                            onClick={() => {
                                                                setShowResult(false);
                                                            }}
                                                        >
                                                            <CloseIcon
                                                                sx={{ color: '#000' }}
                                                            />
                                                        </span>
                                                    </div>
                                                    <Divider />
                                                    <div style={{ marginTop: '50px' }}>
                                                        {listTrack?.map((result) => (
                                                            <TrackItem track={result} />
                                                        ))}
                                                    </div>
                                                </PerfectScrollbar>
                                            </div>
                                        </div>
                                    )}
                                >
                                    <span
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        onClick={() => {
                                            setShowResult(!showResult);
                                        }}
                                    >
                                        <PlaylistPlayIcon
                                            sx={{
                                                fontSize: '28px',
                                                color: showResult ? '#f50' : '#333',
                                            }}
                                        />
                                    </span>
                                </HeadlessTippy>
                            </div>
                        </Container>
                    </AppBar>
                </div>
            )}
        </>
    );
};

export default AppFooter;
