import UploadTabs from '@/components/track/upload.tabs';
import { sendRequest } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const UploadPage = async () => {
    const session = await getServerSession(authOptions);

    const user = await sendRequest<IBackendRes<IUserVip>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users-vip/${session?.user.id}`,
        method: 'GET',
    });

    return (
        <div>
            <UploadTabs userVip={user.data!} />
        </div>
    );
};

export default UploadPage;
