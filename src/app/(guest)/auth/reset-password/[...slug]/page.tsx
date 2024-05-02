import ResetPassword from '@/components/auth/reset.password';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const ResetPassPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    console.log('🚀 ~ ResetPassPage ~ slug:', slug);
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/');
    }
    return <ResetPassword id={slug[0]} token={slug[1]} />;
};

export default ResetPassPage;
