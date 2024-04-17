import WaveTrack from '@/components/track/wave.track';
import { useSearchParams } from 'next/navigation';
import Container from '@mui/material/Container';
import { sendRequest } from '@/utils/api';

const DetailTrackPage = async (props: any) => {
    const { params } = props;

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
        method: 'GET',
        nextOption: { cache: 'no-store' },
    });

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: params.slug,
        },
    });

    return (
        <Container>
            <div>
                <WaveTrack
                    track={res?.data ?? null}
                    comments={res1?.data?.result ?? []}
                />
            </div>
        </Container>
    );
};

export default DetailTrackPage;
