import { sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AppFooter from './app.footer';

const Footer = async () => {
    const session = await getServerSession(authOptions);

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

    return <AppFooter trackLiked={res4.data?.result ?? []} />;
};

export default Footer;
