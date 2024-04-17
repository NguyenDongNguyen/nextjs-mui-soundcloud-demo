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

    const data1 = [
        {
            id: 1,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 2,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 3,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 4,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 5,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 6,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
        {
            id: 7,
            tieuDe: 'Xi măng phố test',
            moTa: 'Drake',
            theLoai: 'WORKOUT',
            linkAnh: 'workout1.png',
            linkNhac: 'WORKOUT.mp3',
            tongYeuThich: 321,
            tongLuotXem: 540,
            isPublic: true,
            ThanhVienId: 1,
            createdAt: '2024-04-12T04:54:22.000Z',
            updatedAt: '2024-04-12T13:04:06.000Z',
        },
    ];

    const NextArrow = (props: any) => {
        return (
            <Button
                color="inherit"
                variant="contained"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: 40,
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
                margin: '0 50px',
                '.track': {
                    padding: '0 10px 30px',

                    img: {
                        height: 140,
                        width: 140,
                    },
                },
                h2: {
                    fontWeight: 500,
                    padding: '30px 0px',
                },
            }}
        >
            <h2> {title} </h2>
            <Slider {...settings}>
                {data1.map((track) => {
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
                                        paddingTop: '5px',
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
            <Divider />
        </Box>
    );
};
export default MainSlider;
