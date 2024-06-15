import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { Box, Button, TextField } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
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
import Link from 'next/link';
import { useToast } from '@/utils/toast';
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
    const toast = useToast();
    const [comments, setComments] = useState<ITrackComment[] | null>([]);
    const [yourComment, setYourComment] = useState('');
    const [sort, setSort] = useState('createdAtDesc');
    const [listFollow, setListFollow] = useState<IUserFollow[] | null>(null);

    const fetchData = async () => {
        if (session?.access_token) {
            const res2 = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${user.id}`,
                method: 'GET',
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    status: 'followee', // lấy ra ds những ng mình đang follow
                },
            });
            if (res2?.data?.result) setListFollow(res2?.data?.result);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

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

    const handleFollow = async () => {
        if (!session?.user.id) {
            toast.error(' Please log in before following this user ');
            return;
        }

        await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow`,
            method: 'POST',
            body: {
                followerId: user.id, //ng theo dõi
                followeeId: track?.ThanhVien.id, //ng được theo dõi
                quantity: listFollow?.some(
                    (t) => t.followee.id === parseInt(track!?.ThanhVien.id)
                )
                    ? -1
                    : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        fetchData();
        router.refresh();
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

    console.log('check: ', user.id !== track!?.ThanhVien.id);

    return (
        <div>
            <div
                style={{
                    margin: '50px 0 25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                {session?.user && (
                    <img
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: '50%',
                        }}
                        src={
                            user.hinhAnh
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.hinhAnh}`
                                : fetchDefaultImages(user.loaiTk)
                        }
                    />
                )}
                {session?.user ? (
                    <TextField
                        value={yourComment}
                        onChange={(e) => setYourComment(e.target.value)}
                        fullWidth
                        label="Bình luận"
                        variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                    />
                ) : (
                    <TextField
                        fullWidth
                        label="Bạn phải đăng nhập để thực hiện bình luận"
                        variant="standard"
                        disabled={true}
                    />
                )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div className="left" style={{ width: '190px', textAlign: 'center' }}>
                    <Link
                        href={`/profile/${track?.ThanhVien.id}`}
                        style={{ color: 'unset' }}
                    >
                        <img
                            style={{
                                height: 150,
                                width: 150,
                                borderRadius: '50%',
                            }}
                            src={
                                track?.ThanhVien.hinhAnh
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${track?.ThanhVien.hinhAnh}`
                                    : fetchDefaultImages(track!?.ThanhVien.loaiTk)
                            }
                        />
                        <div style={{ textAlign: 'center' }}>{track?.ThanhVien.ten}</div>
                    </Link>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#999',
                            margin: '5px 0',
                        }}
                    >
                        <span
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <GroupIcon sx={{ height: '20px', width: '20px' }} />{' '}
                            <span>2284</span>
                        </span>
                        <span
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <GraphicEqIcon sx={{ height: '20px', width: '20px' }} />{' '}
                            <span>21</span>
                        </span>
                    </div>
                    {user.id != track!?.ThanhVien.id ? (
                        listFollow?.some(
                            (t) => t.followee.id === parseInt(track!?.ThanhVien.id)
                        ) ? (
                            <Button
                                variant="contained"
                                size="small"
                                style={{
                                    padding: '2px 10px',
                                    fontSize: '12px',
                                    backgroundColor: 'transparent',
                                    boxShadow: 'unset',
                                    border: '1px solid #FF5500',
                                    color: '#FF5500',
                                    textTransform: 'unset',
                                    fontWeight: '100',
                                }}
                                startIcon={<PersonRemoveIcon />}
                                onClick={handleFollow}
                            >
                                Đã theo dõi
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="small"
                                style={{
                                    padding: '2px 10px',
                                    fontSize: '12px',
                                    background: '#FF5500',
                                    color: '#fff',
                                    textTransform: 'unset',
                                    fontWeight: '100',
                                }}
                                startIcon={<PersonAddAltIcon />}
                                onClick={handleFollow}
                            >
                                Theo dõi
                            </Button>
                        )
                    ) : (
                        <></>
                    )}
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
                            <span>{comments?.length} bình luận</span>
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
                                    Sắp xếp theo:
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
                                    <MenuItem value={'createdAtDesc'}>Mới nhất</MenuItem>
                                    <MenuItem value={'createdAtEsc'}>Cũ nhất</MenuItem>
                                    <MenuItem value={'thoiGianBaiNhacDesc'}>
                                        Thời gian bài hát
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
