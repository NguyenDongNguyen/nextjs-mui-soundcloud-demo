export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface ITrackTop {
        id: string;
        tieuDe: string;
        moTa: string;
        theLoai: string;
        linkAnh: string;
        linkNhac: string;
        tongYeuThich: number;
        tongLuotXem: number;
        isPublic: boolean;
        ThanhVien: {
            id: string;
            email: string;
            ten: string;
            quyen: string;
            loaiTk: string;
        };
        createdAt: string;
        updatedAt: string;
    }

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
    }

    interface IShareTrack extends ITrackTop {
        isPlaying: boolean;
    }

    interface ITrackContext {
        currentTrack: IShareTrack;
        setCurrentTrack: (v: IShareTrack) => void;
    }

    interface ITrackComment {
        id: string;
        noiDung: string;
        thoiGianBaiNhac: number;
        ThanhVien: {
            id: string;
            email: string;
            ten: string;
            quyen: string;
            loaiTk: string;
        };
        BaiNhacId: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ITrackLike {
        id: string;
        tieuDe: string;
        moTa: string;
        theLoai: string;
        linkAnh: string;
        linkNhac: string;
        tongYeuThich: number;
        tongLuotXem: number;
        createdAt: string;
        updatedAt: string;
    }

    interface IPlaylist {
        id: string;
        tieuDe: string;
        isPublic: boolean;
        ChiTietDanhSaches: IShareTrack[];
    }
}
