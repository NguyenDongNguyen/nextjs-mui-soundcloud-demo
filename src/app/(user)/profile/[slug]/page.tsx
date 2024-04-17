import ProfileTracks from '@/components/header/profile.tracks';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';

const ProfileUserPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    console.log('🚀 ~ ProfileUserPage ~ slug:', slug);

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users`,
        method: 'POST',
        body: { id: slug },
        nextOption: {
            next: { tags: ['track-by-profile'] },
        },
    });
    console.log('🚀 ~ ProfileUserPage ~ res:', res);

    //@ts-ignore
    const d = res?.data?.result ?? [];
    return (
        <Container sx={{ my: 5 }}>
            <Grid container spacing={5}>
                {d.map((item: any, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <ProfileTracks data={item} />
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default ProfileUserPage;
