'use client';
import './profile.user.scss';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import GroupIcon from '@mui/icons-material/Group';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import ProfileTrackLiked from './track-liked/profile.track.liked';
import ProfileTrackUploaded from './track-uploaded/track.uploaded';
import Playlist from './playlist/profile.playlist';
import Link from 'next/link';
import { Button } from '@mui/material';
import ProfileEdit from './edit-profile/profile.edit';
import { useTrackContext } from '@/lib/track.wrapper';
import { IUser } from '@/types/next-auth';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import axios from 'axios';
import { useToast } from '@/utils/toast';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Iprops {
    listTrackLiked: ITrackTop[];
    listTrackUploaded: ITrackTop[];
    playlists: IPlaylist[];
    tracks: ITrackTop[];
    user: IUserDetail;
    listFollower: IUserFollow[];
    listFollowing: IUserFollow[];
}

const Profile = (props: Iprops) => {
    const {
        listTrackLiked,
        listTrackUploaded,
        playlists,
        tracks,
        user,
        listFollower,
        listFollowing,
    } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    const { data: session } = useSession();
    const toast = useToast();
    const router = useRouter();
    const params = useParams();
    const [value, setValue] = useState('1');
    const [open, setOpen] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleChangeAvatar = async (e: any) => {
        const formData = new FormData();
        formData.append('fileAvatar', e.target.files[0]);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/upload-avatar/${user.id}`,
                formData
            );
            if (res.data) {
                toast.success(res.data.message);
            }
            router.refresh();
        } catch (error) {
            //@ts-ignore
            toast.error(error?.response?.data?.message);
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
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
        router.refresh();
    };

    return (
        <div>
            <div className="profile-header">
                <div className="avatar-upload">
                    {session?.user.id == params.slug && (
                        <div className="avatar-edit">
                            <input
                                type="file"
                                id="imageUpload"
                                accept=".png, .jpg, .jpeg"
                                onChange={(e) => handleChangeAvatar(e)}
                            />
                            <label htmlFor="imageUpload">
                                <CameraAltOutlinedIcon style={{ fontSize: 16 }} />
                            </label>
                        </div>
                    )}
                    <img
                        className="avatar-preview"
                        src={
                            user.hinhAnh
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.hinhAnh}`
                                : fetchDefaultImages(user.loaiTk)
                        }
                        alt=""
                    />
                </div>
                <div className="profile-header-info">
                    <h1>{user.ten}</h1>
                    <p>{user.email}</p>
                    {session?.user.id == params.slug && (
                        <Button
                            className="button-edit"
                            variant="contained"
                            size="small"
                            onClick={() => setOpen(true)}
                        >
                            <EditIcon
                                style={{
                                    paddingRight: '3px',
                                    height: '22px',
                                    width: '22px',
                                }}
                            />
                            Chỉnh sửa hồ sơ
                        </Button>
                    )}
                </div>
            </div>

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Grid container spacing={2} columns={12}>
                    <Grid
                        item
                        md={9}
                        style={{ borderRight: '1px solid #f2f2f2', paddingRight: '12px' }}
                    >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    onChange={handleChange}
                                    aria-label="lab API tabs example"
                                    // textColor="secondary"
                                    // indicatorColor="secondary"
                                    sx={{
                                        '.Mui-selected': {
                                            color: `#ff5500 !important`,
                                        },
                                        '.MuiButtonBase-root': {
                                            fontWeight: '400',
                                            fontSize: '18px',
                                            color: '#333333',
                                            textTransform: 'unset',
                                        },
                                    }}
                                    TabIndicatorProps={{
                                        style: { background: '#ff5500' },
                                    }}
                                >
                                    <Tab label="Yêu thích" value="1" />
                                    <Tab label="Tải lên" value="2" />
                                    <Tab label="Danh sách" value="3" />
                                    <Tab label="Albums" value="4" />
                                    <Tab label="Trạng thái" value="5" />
                                    <Tab label="Lịch sử" value="6" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <h3 className="title-profile">
                                    Nghe các bản nhạc bạn thích:
                                </h3>
                                <Grid container spacing={2} columns={12}>
                                    {listTrackLiked.map((item: any, index: number) => {
                                        return (
                                            <Grid item md={6} lg={3} key={index}>
                                                <ProfileTrackLiked data={item} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <h3 className="title-profile">
                                    Nghe các bản nhạc bạn tải lên:
                                </h3>
                                <Grid container spacing={2} columns={12}>
                                    {listTrackUploaded.map((item: any, index: number) => {
                                        return (
                                            <Grid item md={6} lg={3} key={index}>
                                                <ProfileTrackUploaded data={item} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </TabPanel>
                            <TabPanel value="3">
                                <h3 className="title-profile">
                                    Nghe danh sách nhạc của riêng bạn
                                </h3>
                                <Playlist playlists={playlists} tracks={tracks} />
                            </TabPanel>
                        </TabContext>
                    </Grid>
                    <Grid item md={3}>
                        <div className="infoStats-table">
                            <div
                                className="infoStats"
                                onClick={() => router.push(`/follow/${params.slug}`)}
                            >
                                <h3>Người theo dõi</h3>
                                <div>{listFollower.length}</div>
                            </div>
                            <div
                                className="infoStats"
                                onClick={() => router.push(`/follow/${params.slug}`)}
                            >
                                <h3>Đang theo dõi</h3>
                                <div>{listFollowing.length}</div>
                            </div>
                            <div className="infoStats" onClick={() => setValue('2')}>
                                <h3>Bài nhạc</h3>
                                <div>{listTrackUploaded.length}</div>
                            </div>
                        </div>
                        <div>
                            <div className="sidebar-header">
                                <GraphicEqIcon
                                    style={{ width: '24px', height: '24px' }}
                                />
                                <span>Bài hát liên quan</span>
                            </div>
                            {tracks?.slice(0, 4)?.map((data) => (
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
                                        <h5 className="sidebar-content-des">
                                            {data.moTa}
                                        </h5>
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
                        </div>
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
                                        Đang theo dõi
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid>
            </Box>

            <ProfileEdit open={open} setOpen={setOpen} userInfo={user} />
        </div>
    );
};

export default Profile;
