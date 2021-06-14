import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
    Navigation, Thumbs
} from 'swiper/core';
import { useState } from 'react';

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css"
import "swiper/components/thumbs/thumbs.min.css"

import { CancelIcon } from '../icons';

// install Swiper's Thumbs component
SwiperCore.use([Navigation, Thumbs]);

function ShowImg({ onClose, currentImg, imagesSlide }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const currentIndex = imagesSlide.indexOf(currentImg.img);
    const params = {
        initialSlide: currentIndex,
        spaceBetween: 10,
        navigation: true,
        thumbs: { swiper: thumbsSwiper }
    }


    return (
        <div className="relative bg-primary shadow-lg">
            <CancelIcon className="absolute w-8 h-8 -top-6 -right-6 text-black bg-white p-2 rounded-full z-10 cursor-pointer" onClick={onClose} />
            <Swiper
                { ...params}
                className="mySwiperSlide"
                >

                {
                    imagesSlide.map((img, i) => {
                        return <SwiperSlide key={i}
                    //     style={{backgroundImage: `url(${img})`,
                    //     backgroundRepeat: 'no-repeat',
                    //     backgroundSize: 'cover',
                    //     backgroundColor: 'rgb(208 19 19)',
                    //     backgroundBlendMode: "screen",
                    // }}
                        ><img src={img} alt="slide" className="w-full object-contain" />
                    </SwiperSlide>
                    })
                }

            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10} slidesPerView={4}
                freeMode={true} watchSlidesVisibility={false}
                watchSlidesProgress={true}
                className="mySwiper">
                {
                    imagesSlide.map((img, i) => {
                        return <SwiperSlide key={i}><img src={img} alt="slide" /></SwiperSlide>
                    })
                }
            </Swiper>
        </div>
    )
}

export default ShowImg;