import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { convertSlugUrl, sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tracks bạn đã liked',
    description: 'miêu tả thôi mà',
};

const LikePage = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] },
        },
    });

    const likes = res?.data?.result ?? [];
    console.log('🚀 ~ LikePage ~ likes:', likes);

    return (
        <Container>
            <div>
                <h3>Hear the tracks you've liked:</h3>
            </div>
            <Divider />
            <Box sx={{ mt: 3, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {likes.map((track) => {
                    return (
                        <Box key={track.id}>
                            <img
                                style={{ borderRadius: '3px' }}
                                alt="avatar track"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.linkAnh}`}
                                height={'200px'}
                                width={'200px'}
                            />
                            <div>
                                <Link
                                    style={{ textDecoration: 'none', color: 'unset' }}
                                    href={`/track/${track.id}?audio=${track.linkNhac}&id=${track.id}`}
                                >
                                    <span
                                        style={{
                                            width: '200px',
                                            display: 'block',
                                            color: 'black',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {track.tieuDe}
                                    </span>
                                </Link>
                            </div>
                        </Box>
                    );
                })}
            </Box>
        </Container>
    );
};

export default LikePage;
