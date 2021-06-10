import { useSelector } from 'react-redux';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ShowImg from '../ShowImg';

function ImgMess({ img, slideImages }) {
    const isMobile = useSelector(state => state.isMobile);

    return (
        <>
            {
                isMobile ?
                    <div className="md:w-72 w-40">
                        <LazyLoadImage alt="upload preview" src={img}
                            className="rounded shadow-md h-full w-full object-cover cursor-pointer" style={{ background: "#d1dcf5" }} />
                    </div>
                    :
                    <Popup className="my-slide-popup" modal trigger={
                        <div className="md:w-72 w-40">
                            <LazyLoadImage alt="upload preview" src={img}
                                className="rounded shadow-md h-full w-full object-cover cursor-pointer" style={{ background: "#d1dcf5" }} />
                        </div>
                    }>
                        {close => <ShowImg slideImages={slideImages} onClose={close} currentImg={img} />}
                    </Popup>
            }
        </>
    )
}

export default ImgMess;