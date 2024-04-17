'use client';

import { createContext, useContext, useState } from 'react';

export const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const initValue = {
        id: '',
        tieuDe: '',
        moTa: '',
        theLoai: '',
        linkAnh: '',
        linkNhac: '',
        tongYeuThich: 0,
        tongLuotXem: 0,
        isPublic: true,
        ThanhVien: {
            id: '',
            email: '',
            ten: '',
            quyen: '',
            loaiTk: '',
        },
        createdAt: '',
        updatedAt: '',
        isPlaying: false,
    };
    const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    );
};

export const useTrackContext = () => useContext(TrackContext);
