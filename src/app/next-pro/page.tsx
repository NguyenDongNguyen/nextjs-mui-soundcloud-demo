import type { Metadata } from 'next';
import TryPro from './components/trypro';

export const metadata: Metadata = {
    title: 'Try next pro',
    description: 'miêu tả thôi mà',
};

const TryProPage = () => {
    return <TryPro />;
};

export default TryProPage;
