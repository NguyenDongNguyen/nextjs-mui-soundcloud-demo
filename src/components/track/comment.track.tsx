import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { Box, TextField } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import WaveSurfer from 'wavesurfer.js';
import { useHasMounted } from '@/utils/customHook';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
dayjs.extend(relativeTime);

interface IProps {
    // comments: ITrackComment[];
    track: ITrackTop | null;
    wavesurfer: WaveSurfer | null;
    user: IUserDetail;
}

const CommentTrack = (props: IProps) => {
    const router = useRouter();
    const hasMouted = useHasMounted();

    const { track, wavesurfer, user } = props;
    const { data: session } = useSession();
    const [comments, setComments] = useState<ITrackComment[] | null>([]);
    const [yourComment, setYourComment] = useState('');
    const [sort, setSort] = useState('createdAtDesc');

    useEffect(() => {
        fetchComments();
    }, [sort]);

    const fetchComments = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
            method: 'POST',
            queryParams: {
                current: 1,
                pageSize: 10,
                trackId: track?.id,
            },
            body: {
                sort,
            },
        });
        setComments(res.data?.result ?? []);
    };

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
            fetchComments();
        }
    };

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    };

    const handleChange = async (event: SelectChangeEvent) => {
        console.log('🚀 ~ handleChange ~ event:', event);
        setSort(event.target.value as string);
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
                        style={{ height: 150, width: 150, borderRadius: '50%' }}
                        src={
                            user.hinhAnh
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.hinhAnh}`
                                : fetchDefaultImages(user.loaiTk)
                        }
                    />
                    <div>{session?.user?.email}</div>
                </div>
                <div className="right" style={{ width: 'calc(100% - 200px)' }}>
                    <div
                        className="comment-header"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '6px',
                            marginBottom: '20px',
                            borderBottom: '1px solid #f2f2f2',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#999',
                                fontSize: '14px',
                                fontWeight: '400',
                            }}
                        >
                            <ChatBubbleIcon sx={{ paddingRight: '5px' }} />
                            <span>{comments?.length} comments</span>
                        </div>
                        <Box
                            sx={{
                                width: 160,
                                '.MuiFormLabel-root': {
                                    top: '-10px',
                                    color: '#ff5500',
                                },
                                '.MuiSelect-select': { padding: '6.5px 12px' },
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Sorted by:
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sort as string}
                                    label="Age"
                                    onChange={handleChange}
                                    sx={{
                                        fontWeight: '400',
                                        fontSize: '14px',
                                        color: '#ff5500',
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff5500',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                            {
                                                borderColor: '#ff5500',
                                            },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#ff5500',
                                        },
                                        '.MuiSvgIcon-root ': {
                                            fill: '#ff5500 !important',
                                        },
                                    }}
                                >
                                    <MenuItem value={'createdAtDesc'}>Newest</MenuItem>
                                    <MenuItem value={'createdAtEsc'}>Oldest</MenuItem>
                                    <MenuItem value={'thoiGianBaiNhacDesc'}>
                                        Track Time
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    {comments &&
                        comments?.map((comment) => {
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
                                            style={{
                                                height: 40,
                                                width: 40,
                                                borderRadius: '50%',
                                            }}
                                            src={
                                                comment.ThanhVien.hinhAnh
                                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${comment.ThanhVien.hinhAnh}`
                                                    : fetchDefaultImages(
                                                          comment.ThanhVien.hinhAnh
                                                      )
                                            }
                                        />
                                        <div>
                                            <div style={{ fontSize: '13px' }}>
                                                {comment?.ThanhVien?.ten ??
                                                    comment?.ThanhVien?.email}{' '}
                                                at
                                                <span
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#044dd2',
                                                        backgroundColor: '#f3f3f3',
                                                    }}
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
