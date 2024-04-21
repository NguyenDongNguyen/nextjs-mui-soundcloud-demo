export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IUserDetail {
        id: string;
        email: string;
        ten: string;
        quyen: string;
        ngaySinh: string;
        hinhAnh: string;
        loaiTk: string;
    }

    interface ITrackTop {
        id: number;
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
        BaiNhacid?: number;
    }

    interface ITrackContext {
        currentTrack: IShareTrack;
        setCurrentTrack: (v: IShareTrack) => void;
    }

    interface ITrackComment {
        id: number;
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
        id: number;
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
        id: number;
        tieuDe: string;
        isPublic: boolean;
        ChiTietDanhSaches: IShareTrack[];
    }
}
