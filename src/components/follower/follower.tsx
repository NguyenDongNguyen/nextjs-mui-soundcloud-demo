'use client';
import { fetchDefaultImages } from '@/utils/api';
import './follower.scss';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';

interface IProps {
    listFollower: IUserFollow[];
    listFollowing: IUserFollow[];
    user: IUserDetail;
}

const Follower = (props: IProps) => {
    const { listFollower, listFollowing, user } = props;
    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div className="wrapper">
            <div className="header-follow">
                <img
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: '50%',
                    }}
                    src={
                        user.hinhAnh
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.hinhAnh}`
                            : fetchDefaultImages(user.loaiTk)
                    }
                    alt=""
                />
                <h1>Theo dõi của {user.ten}</h1>
            </div>

            <Box sx={{ width: '100%', typography: 'body1' }}>
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
                            <Tab label="Đang theo dõi" value="1" />
                            <Tab label="Người theo dõi" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={2} columns={12}>
                            {listFollowing.map((user) => (
                                <Grid item md={2}>
                                    <img
                                        style={{
                                            height: '170px',
                                            width: '100%',
                                            borderRadius: '50%',
                                        }}
                                        src={
                                            user?.followee.hinhAnh
                                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.followee.hinhAnh}`
                                                : fetchDefaultImages(
                                                      user?.followee.loaiTk
                                                  )
                                        }
                                    />
                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Link
                                            href={`/profile/${user?.followee.id}`}
                                            style={{
                                                textAlign: 'center',
                                                color: 'unset',
                                            }}
                                        >
                                            {user?.followee.ten}
                                        </Link>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                        <Grid container spacing={2} columns={12}>
                            {listFollower?.map((user) => (
                                <Grid item md={2}>
                                    <img
                                        style={{
                                            height: '170px',
                                            width: '100%',
                                            borderRadius: '50%',
                                        }}
                                        src={
                                            user?.follower.hinhAnh
                                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.follower.hinhAnh}`
                                                : fetchDefaultImages(
                                                      user?.follower.loaiTk
                                                  )
                                        }
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        {user?.follower.ten}
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
};
export default Follower;
