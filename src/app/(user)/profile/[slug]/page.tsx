import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Profile from '@/components/profile/profile.user';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const ProfileUserPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100, id: slug },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] },
        },
    });

    const res1 = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users`,
        method: 'POST',
        body: { id: slug },
        nextOption: {
            next: { tags: ['track-by-profile'] },
        },
    });

    const res2 = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: 'POST',
        queryParams: { current: 1, pageSize: 100, id: slug },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['playlist-by-user'] },
        },
    });

    const res3 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });
    const res4 = await sendRequest<IBackendRes<IUserDetail>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${slug}`,
        method: 'GET',
    });

    const res5 = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${slug}`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100, status: 'follower' },
        nextOption: {
            next: { tags: ['follow-by-user'] },
        },
    });

    const res6 = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${slug}`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100, status: 'followee' },
        nextOption: {
            next: { tags: ['follow-by-user'] },
        },
    });

    //@ts-ignore
    const d = res?.data?.result ?? [];

    return (
        <Container>
            <Profile
                listTrackLiked={d}
                listTrackUploaded={res1?.data ?? []}
                playlists={res2?.data?.result ?? []}
                tracks={res3?.data?.result ?? []}
                user={res4?.data! ?? {}}
                listFollower={res5?.data?.result ?? []}
                listFollowing={res6?.data?.result ?? []}
            />
        </Container>
    );
};

export default ProfileUserPage;
