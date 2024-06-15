import WaveTrack from '@/components/track/wave.track';
import { useSearchParams } from 'next/navigation';
import Container from '@mui/material/Container';
import { sendRequest } from '@/utils/api';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const DetailTrackPage = async (props: any) => {
    const { params } = props;
    const session = await getServerSession(authOptions);

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

    const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['handle-like-track'] },
        },
    });

    const res3 = await sendRequest<IBackendRes<IUserDetail>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${session?.user.id}`,
        method: 'GET',
    });

    const res4 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'GET',
        queryParams: {
            current: 1,
            pageSize: 100,
            id: session?.user?.id,
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['handle-like-track'] },
        },
    });

    const res5 = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: 'POST',
        queryParams: { current: 1, pageSize: 100, id: session?.user.id },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['playlist-by-user'] },
        },
    });

    return (
        <Container>
            <div>
                <WaveTrack
                    track={res?.data ?? null}
                    comments={res1?.data?.result ?? []}
                    listTrack={res2?.data?.result ?? []}
                    user={res3?.data! ?? {}}
                    trackLiked={res4.data?.result ?? []}
                    playlists={res5?.data?.result ?? []}
                />
            </div>
        </Container>
    );
};

export default DetailTrackPage;
