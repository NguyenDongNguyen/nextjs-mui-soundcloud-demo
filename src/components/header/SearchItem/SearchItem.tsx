import './SearchItem.scss';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';

interface Iprops {
    data: ITrackTop;
}

function SearchItem({ data }: Iprops) {
    return (
        <Link
            href={`/track/${data.id}?audio=${data.linkNhac}&id=${data.id}`}
            className="wrapper_track_item"
        >
            <SearchIcon style={{ height: '20px', width: '20px' }} />
            <div className="info">
                <h4 className="name">
                    <span>{data.tieuDe}</span>
                </h4>
                {/* <span className={cx("username")}>{data.nickname}</span> */}
            </div>
        </Link>
    );
}

export default SearchItem;
