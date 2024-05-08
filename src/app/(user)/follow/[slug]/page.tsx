import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Follower from '@/components/follower/follower';
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

    const res = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${slug}`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100, status: 'follower' },
        nextOption: {
            next: { tags: ['follow-by-user'] },
        },
    });

    const res1 = await sendRequest<IBackendRes<IModelPaginate<IUserFollow>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/follow/${slug}`,
        method: 'GET',
        queryParams: { current: 1, pageSize: 100, status: 'followee' },
        nextOption: {
            next: { tags: ['follow-by-user'] },
        },
    });

    const res2 = await sendRequest<IBackendRes<IUserDetail>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${slug}`,
        method: 'GET',
    });

    //@ts-ignore
    const d = res?.data?.result ?? [];

    return (
        <Container>
            <Follower
                listFollower={d}
                listFollowing={res1?.data?.result ?? []}
                user={res2?.data! ?? {}}
            />
        </Container>
    );
};

export default ProfileUserPage;
