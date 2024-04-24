import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <div style={{ marginBottom: '64px' }}></div>
            {children}
            <div style={{ marginBottom: '80px' }}></div>
        </>
    );
}
