import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function ImgMess({ img }) {

    return (
        <>
            {
                    <div className="md:w-72 w-40">
                        <LazyLoadImage alt="upload preview" src={img}
                            className="rounded shadow-md h-full w-full object-cover cursor-pointer" style={{ background: "#d1dcf5" }} />
                    </div>
            }
        </>
    )
}

export default ImgMess;