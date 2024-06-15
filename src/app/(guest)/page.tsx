import type { Metadata } from 'next';
import Home from '@/components/home/home';
import { sendRequest } from '@/utils/api';

export const metadata: Metadata = {
    title: 'Listen to music online for free with MusicCloud',
    description: 'just a description',
};

const HomePage = async () => {
    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 12 },
    });
    console.log('check tracks: ', tracks);

    return <Home data={tracks?.data?.result ?? []} />;
};

export default HomePage;
