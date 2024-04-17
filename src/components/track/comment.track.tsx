import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { Box, TextField } from '@mui/material';
import { Session } from 'inspector';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import WaveSurfer from 'wavesurfer.js';
import { useHasMounted } from '@/utils/customHook';
dayjs.extend(relativeTime);

interface IProps {
    comments: ITrackComment[];
    track: ITrackTop | null;
    wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {
    const router = useRouter();
    const hasMouted = useHasMounted();

    const { comments, track, wavesurfer } = props;
    const { data: session } = useSession();
    const [yourComment, setYourComment] = useState('');

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    };

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: 'POST',
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?.id,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        if (res.data) {
            setYourComment('');
            //fetch lại data ở phía server mỗi khi add success 1 comment
            // bởi vì lúc fetch data để lấy comment là lấy thông qua props của parent
            router.refresh();
        }
    };

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    };

    return (
        <div>
            <div style={{ marginTop: '50px', marginBottom: '25px' }}>
                {session?.user && (
                    <TextField
                        value={yourComment}
                        onChange={(e) => setYourComment(e.target.value)}
                        fullWidth
                        label="Comments"
                        variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div className="left" style={{ width: '190px' }}>
                    <img
                        style={{ height: 150, width: 150 }}
                        src={fetchDefaultImages(session?.user?.type!)}
                    />
                    <div>{session?.user?.email}</div>
                </div>
                <div className="right" style={{ width: 'calc(100% - 200px)' }}>
                    {comments?.map((comment) => {
                        return (
                            <Box
                                key={comment.id}
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '25px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img
                                        style={{ height: 40, width: 40 }}
                                        src={fetchDefaultImages(comment.ThanhVien.loaiTk)}
                                    />
                                    <div>
                                        <div style={{ fontSize: '13px' }}>
                                            {comment?.ThanhVien?.ten ??
                                                comment?.ThanhVien?.email}{' '}
                                            at
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    handleJumpTrack(
                                                        comment.thoiGianBaiNhac
                                                    )
                                                }
                                            >
                                                &nbsp;{' '}
                                                {formatTime(comment.thoiGianBaiNhac)}
                                            </span>
                                        </div>
                                        <div>{comment.noiDung}</div>
                                    </div>
                                </Box>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                    {hasMouted && dayjs(comment.createdAt).fromNow()}
                                </div>
                            </Box>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CommentTrack;
