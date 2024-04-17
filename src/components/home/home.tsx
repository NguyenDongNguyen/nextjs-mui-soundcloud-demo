'use client';
import './home.scss';
import { Button, Container, Grid } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface Iprops {
    data: ITrackTop[];
}

const Home = ({ data }: Iprops) => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            redirect('/discover');
        }
    }, [session]);

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#f2f2f2',
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        padding: '4px 0px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '600px',
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
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
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

    return (
        <Container>
            <div className="banner">
                <div className="header-banner">
                    <img
                        src="/logo_Music-Cloud.png"
                        alt=""
                        width={'210px'}
                        height={'auto'}
                    />
                    <div>
                        <Button
                            variant="outlined"
                            size="small"
                            style={{
                                color: '#fff',
                                borderColor: '#fff',
                                outline: '#fff',
                            }}
                            onClick={() => router.push('/auth/signin')}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="button"
                            variant="contained"
                            size="small"
                            style={{
                                marginLeft: '8px',
                                padding: '3px 18px',
                            }}
                            onClick={() => router.push('/auth/signup')}
                        >
                            Create account
                        </Button>
                    </div>
                </div>
                <div className="content-banner">
                    <h1
                        style={{ marginBottom: '8px', fontSize: '40px', fontWeight: 400 }}
                    >
                        Connect on Music Cloud
                    </h1>
                    <p
                        style={{
                            fontSize: '18px',
                            maxWidth: '530px',
                            textAlign: 'center',
                        }}
                    >
                        Discover, stream, and share a constantly expanding mix of music
                        from emerging and major artists around the world.
                    </p>
                    <div>
                        <Button
                            className="button"
                            variant="contained"
                            size="large"
                            sx={{
                                my: 3,
                                padding: '10px 35px',
                            }}
                            onClick={() => router.push('/auth/signup')}
                        >
                            Sign up for free
                        </Button>
                    </div>
                </div>
            </div>

            <div className="content" style={{ marginTop: '30px' }}>
                <div className="action-content">
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search for artists, bands, tracks, podcasts"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <span style={{ paddingRight: '12px', fontSize: '18px' }}>or</span>
                    <Button
                        className="button"
                        variant="contained"
                        size="large"
                        sx={{
                            padding: '10px 28px',
                        }}
                    >
                        Upload your own
                    </Button>
                </div>
                <div className="trending-tracks">
                    <h2>Hear what’s trending for free in the SoundCloud community</h2>
                    <div className="list-tracks">
                        <Grid container spacing={2} columns={12}>
                            {data.map((track) => {
                                return (
                                    <Grid
                                        item
                                        lg={2}
                                        md={3}
                                        sm={4}
                                        sx={{ paddingBottom: '20px' }}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.linkAnh}`}
                                            width={170}
                                            height={170}
                                        />
                                        <Link
                                            href={`#`}
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    color: '#333',
                                                    fontSize: '16px',
                                                    fontWeight: '400',
                                                }}
                                            >
                                                {track.tieuDe}
                                            </h4>
                                        </Link>
                                        <h5
                                            style={{
                                                color: '#999',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                            }}
                                        >
                                            {track.moTa}
                                        </h5>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            className="button"
                            variant="contained"
                            size="large"
                            sx={{
                                my: 2,
                                padding: '8px 30px',
                            }}
                            onClick={() => router.push('/discover')}
                        >
                            Explore trending playlists
                        </Button>
                    </div>
                </div>
            </div>

            <div className="teaser">
                <h1>Calling all creators</h1>
                <p>
                    Get on SoundCloud to connect with fans, share your sounds, and grow
                    your audience. What are you waiting for?
                </p>
                <Button
                    variant="outlined"
                    size="large"
                    style={{
                        color: '#fff',
                        borderColor: '#fff',
                        outline: '#fff',
                    }}
                >
                    Find out more
                </Button>
            </div>

            <div className="signup-teaser">
                <h1>Thanks for listening. Now join in.</h1>
                <p style={{ fontSize: '24px', margin: '7px 0 10px' }}>
                    Save tracks, follow artists and build playlists. All for free.
                </p>
                <div>
                    <Button
                        className="button"
                        variant="contained"
                        size="large"
                        sx={{
                            my: 2,
                            padding: '8px 30px',
                        }}
                        onClick={() => router.push('/auth/signup')}
                    >
                        Create account
                    </Button>
                </div>
                <p>
                    Already have an account?{' '}
                    <Button
                        variant="outlined"
                        size="medium"
                        style={{
                            color: '#333',
                            borderColor: '#e5e5e5',
                            outline: '#e5e5e5',
                            textTransform: 'unset',
                            fontSize: '16px',
                            fontWeight: '400',
                        }}
                        onClick={() => router.push('/auth/signin')}
                    >
                        Sign in
                    </Button>{' '}
                </p>
            </div>
        </Container>
    );
};

export default Home;
