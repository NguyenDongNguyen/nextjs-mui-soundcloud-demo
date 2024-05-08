'use client';
import './app.header.scss';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import StarRateIcon from '@mui/icons-material/StarRate';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import ActiveLink from './active.link';
import { Button } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';
import SearchItem from './SearchItem/SearchItem';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#e5e5e5',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    color: '#666',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '400px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    color: '#333',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '400px',
        },
    },
}));

export default function AppHeader() {
    // client component thì sử dụng useSession để lấy session
    const { data: session } = useSession();

    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showResult, setShowResult] = React.useState<boolean>(false);
    const [listSearch, setListSearch] = React.useState<ITrackTop[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    React.useEffect(() => {
        fetchDataSearch(searchTerm);
    }, [searchTerm]);

    const fetchDataSearch = async (query: string) => {
        if (searchTerm) {
            console.log('🚀 ~ fetchDataSearch ~ query:', query);
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
                method: 'POST',
                body: {
                    current: 1,
                    pageSize: 10,
                    title: query,
                },
            });
            console.log('🚀 ~ fetchData ~ res:', res);
            if (res.data?.result) {
                setListSearch(res.data.result);
            }
        }
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            style={{ marginTop: '10px !important' }}
        >
            <MenuItem onClick={handleMenuClose} className="menu">
                <Link
                    href={`/profile/${session?.user?.id}`}
                    style={{ color: 'unset', textDecoration: 'unset' }}
                >
                    <div className="menu-item">
                        <PersonIcon style={{ width: '34px', height: '20px' }} />
                        <span className="menu-item-title">Profile</span>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} className="menu">
                <Link
                    href={`/profile/${session?.user?.id}`}
                    style={{ color: 'unset', textDecoration: 'unset' }}
                >
                    <div className="menu-item">
                        <FavoriteIcon style={{ width: '34px', height: '20px' }} />
                        <span className="menu-item-title">Likes</span>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} className="menu">
                <Link
                    href={`/profile/${session?.user?.id}`}
                    style={{ color: 'unset', textDecoration: 'unset' }}
                >
                    <div className="menu-item">
                        <PlaylistPlayIcon style={{ width: '34px', height: '20px' }} />
                        <span className="menu-item-title">Playlists</span>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} className="menu">
                <Link
                    href={`/follow/${session?.user?.id}`}
                    style={{ color: 'unset', textDecoration: 'unset' }}
                >
                    <div className="menu-item">
                        <GroupIcon style={{ width: '34px', height: '20px' }} />
                        <span className="menu-item-title">Following</span>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} className="menu">
                <Link
                    href={`/profile/${session?.user?.id}`}
                    style={{ color: 'unset', textDecoration: 'unset' }}
                >
                    <div className="menu-item">
                        <StarRateIcon style={{ width: '34px', height: '20px' }} />
                        <span className="menu-item-title">Try Next Pro</span>
                    </div>
                </Link>
            </MenuItem>
            <MenuItem
                className="menu"
                onClick={() => {
                    handleMenuClose(), signOut({ callbackUrl: '/', redirect: true });
                }}
            >
                <div className="menu-item">
                    <LogoutIcon style={{ width: '34px', height: '20px' }} />
                    <span className="menu-item-title">Log out</span>
                </div>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box
            sx={{
                flexGrow: 1,
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                zIndex: '100',
                overflowY: 'scroll',
                overflowX: 'hidden',
                '.MuiPaper-root': {
                    marginTop: '0 !important',
                },
            }}
        >
            <AppBar sx={{ background: '#333' }}>
                <Container>
                    <Toolbar>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '-30px',
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                src="/logo_Music-Cloud.png"
                                alt=""
                                width={'210px'}
                                height={'auto'}
                                onClick={() => {
                                    session ? router.push('/discover') : router.push('/');
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: '45px',
                                paddingLeft: '25px',
                                cursor: 'pointer',
                                '> a': {
                                    color: 'unset',
                                    textDecoration: 'unset',
                                    padding: '5px',

                                    '&.active': {
                                        background: '#3b4a59',
                                        color: '#cefaff',
                                        borderRadius: '5px',
                                    },
                                },
                            }}
                        >
                            <ActiveLink href={'/discover'}>Home</ActiveLink>
                            <ActiveLink href={'#'}>Feed</ActiveLink>
                            <ActiveLink href={'#'}>Library</ActiveLink>
                        </Box>
                        <Box
                            style={{ width: '100%' }}
                            sx={{
                                '#tippy-2': {
                                    transform: 'translate(494px, 100%) !important',
                                },
                            }}
                        >
                            <HeadlessTippy
                                interactive
                                visible={
                                    showResult && !!searchTerm && listSearch.length > 0
                                }
                                // visible={true}
                                render={(attrs) => (
                                    <div
                                        className="search-result"
                                        tabIndex={-1}
                                        {...attrs}
                                    >
                                        <div className="wrapper-search">
                                            <h4 className="title-search">
                                                Search for {`"${searchTerm}"`}
                                            </h4>
                                            {listSearch &&
                                                listSearch?.map((result) => (
                                                    <SearchItem
                                                        key={result.id}
                                                        data={result}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )}
                                onClickOutside={() => setShowResult(false)}
                            >
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search for artists, bands, tracks, podcasts"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setShowResult(true)}
                                        sx={{
                                            '.MuiInputBase-input': {
                                                padding: '5px 10px',
                                            },
                                        }}
                                    />
                                </Search>
                            </HeadlessTippy>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: '20px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                '> a': {
                                    color: 'unset',
                                    textDecoration: 'unset',
                                    padding: '5px',

                                    '&.active': {
                                        background: '#3b4a59',
                                        color: '#cefaff',
                                        borderRadius: '5px',
                                    },
                                },
                            }}
                        >
                            {session ? (
                                <>
                                    <ActiveLink href={'/next-pro'}>
                                        <span style={{ color: '#ff5500' }}>
                                            Try Next Pro
                                        </span>
                                    </ActiveLink>
                                    <ActiveLink href={'/track/upload'}>Upload</ActiveLink>
                                    <img
                                        onClick={handleProfileMenuOpen}
                                        style={{
                                            height: 35,
                                            width: 35,
                                            cursor: 'pointer',
                                        }}
                                        src={fetchDefaultImages(session.user.type)}
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            color: '#fff',
                                            borderColor: '#666',
                                            whiteSpace: 'nowrap',
                                            textTransform: 'unset',
                                        }}
                                        onClick={() => router.push('/auth/signin')}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            marginLeft: '8px',
                                            padding: '2px 14px',
                                            backgroundColor: '#f50',
                                            borderColor: '#f50',
                                            color: '#fff',
                                            textTransform: 'unset',
                                            fontSize: '15px',
                                            fontWeight: '400',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onClick={() => router.push('/auth/signup')}
                                    >
                                        Create account
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
