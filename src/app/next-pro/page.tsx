import type { Metadata } from 'next';
import TryPro from './components/trypro';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { sendRequest } from '@/utils/api';

export const metadata: Metadata = {
    title: 'Try next pro',
    description: 'miêu tả thôi mà',
};

const TryProPage = async () => {
    const session = await getServerSession(authOptions);

    const user = await sendRequest<IBackendRes<IUserVip>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users-vip/${session?.user.id}`,
        method: 'GET',
    });

    return <TryPro userVip={user.data!} />;
};

export default TryProPage;
