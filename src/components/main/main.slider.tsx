'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Settings } from 'react-slick';
import { Box } from '@mui/material';
import Button from '@mui/material/Button/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from 'next/link';

interface IProps {
    data: ITrackTop[];
    title: string;
}

const MainSlider = (props: IProps) => {
    const { data, title } = props;

    const NextArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: -10,
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        );
    };

    const PrevArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        );
    };

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    //box === div
    return (
        <Box
            sx={{
                '.track': {
                    padding: '0 10px 30px',

                    img: {
                        height: 170,
                        width: 170,
                    },
                },
                h2: {
                    fontSize: '24px',
                    color: '#333',
                    fontWeight: 600,
                    paddingBottom: '24px',
                },
                '.slick-slide': {
                    width: '193px !important',
                },
            }}
        >
            <h2> {title} </h2>
            <Slider {...settings}>
                {data.map((track) => {
                    return (
                        <div className="track" key={track.id}>
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.linkAnh}`}
                            />
                            <Link
                                href={`/track/${track.id}?audio=${track.linkNhac}&id=${track.id}`}
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
                        </div>
                    );
                })}
            </Slider>
            <Divider sx={{ marginBottom: '24px' }} />
        </Box>
    );
};
export default MainSlider;
