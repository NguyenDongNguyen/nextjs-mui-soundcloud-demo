import MainSlider from '@/components/main/main.slider';
import { Container } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
    // server component phải sử dụng getServerSession mới lấy được session
    const session = await getServerSession(authOptions);
    console.log('🚀 ~ HomePage ~ session:', session);

    const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: 'POST',
        body: { category: 'CHILL' },
    });

    const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: 'POST',
        body: { category: 'WORKOUT' },
    });

    const party = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: 'POST',
        body: { category: 'PARTY' },
    });

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '66px',
                    padding: '10px 50px 0px',
                }}
            >
                <img src="logo_UTE.png" alt="" width={100} height={100} />
                <h1
                    style={{
                        fontSize: '32px',
                        fontWeight: '400',
                    }}
                >
                    Khám phá các bản nhạc và danh sách phát
                </h1>
            </div>
            <Container>
                <MainSlider title={'Top Chill'} data={chills?.data ?? []} />
                <MainSlider title={'Top Workout'} data={workouts?.data ?? []} />
                <MainSlider title={'Top Party'} data={party?.data ?? []} />
            </Container>
        </>
    );
}
