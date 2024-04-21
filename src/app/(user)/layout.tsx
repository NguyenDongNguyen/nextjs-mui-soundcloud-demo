import '@/styles/app.css';
import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <div style={{ marginBottom: '64px' }}></div>
            {children}
            <div style={{ marginBottom: '100px' }}></div>
            <AppFooter />
        </>
    );
}
