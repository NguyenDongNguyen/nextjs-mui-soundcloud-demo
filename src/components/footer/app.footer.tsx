'use client';
import './app.footer.scss';
import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/utils/customHook';
import { Container, Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useRef, useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import CloseIcon from '@mui/icons-material/Close';
import HeadlessTippy from '@tippyjs/react/headless';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { sendRequest } from '@/utils/api';
import TrackItem from './ListTrack/TrackItem';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const playerRef = useRef(null);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    console.log('🚀 ~ AppFooter ~ currentTrack:', currentTrack);
    const [listTrack, setListTrack] = useState<ITrackTop[]>([]);
    const [showResult, setShowResult] = useState(false);

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

    const handleEnded = () => {};

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
                                <div
                                    title={currentTrack.tieuDe}
                                    style={{
                                        width: '100%',
                                        color: 'black',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {currentTrack.tieuDe}
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
                                <HeadlessTippy
                                    interactive
                                    visible={showResult && listTrack.length > 0}
                                    // visible={true}
                                    placement="top-end"
                                    render={(attrs) => (
                                        <PerfectScrollbar
                                            style={{
                                                maxHeight: '488px',
                                                backgroundColor: 'rgb(255, 255, 255)',
                                            }}
                                        >
                                            <div
                                                className="search-result"
                                                tabIndex={-1}
                                                {...attrs}
                                            >
                                                <div className="wrapper">
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
                                                            width: '500px',
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
                                                            <CloseIcon />
                                                        </span>
                                                    </div>
                                                    <Divider />
                                                    <div style={{ marginTop: '50px' }}>
                                                        {listTrack?.map((result) => (
                                                            <TrackItem track={result} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </PerfectScrollbar>
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
