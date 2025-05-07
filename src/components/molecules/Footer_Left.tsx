import React from 'react'
import Logo from '../atoms/Logo'

const Footer_Left = () => {
    return (
        <div className='md:border-r-2 md:pr-2'>
            <Logo style='w-80'
                src="/images/Logo.png"
            />
            <div className='py-2'>
                <p className="text-sm">Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM</p>
                <p className="text-sm">Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
                <p className="text-sm">60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
            </div>
            <div className='py-2'>
                <p className="text-sm">Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.</p>
                <p className="text-sm">KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.</p>
            </div>

            <div className='flex justify-start py-2'>
                <Logo href='https://www.facebook.com/fahasa/'
                    src='/images/footer/Logo_MXH/Facebook-on.png'
                    style='w-10'
                    target='_blank'
                />
                <Logo href='https://www.instagram.com/fahasa_official/'
                    src='/images/footer/Logo_MXH/Insta-on.png'
                    style='w-10'
                    target='_blank'
                />
                <Logo href='https://www.youtube.com/channel/UCUZcVOLSxK1q6RfgzQ9-HYQ'
                    src='/images/footer/Logo_MXH/Youtube-on.png'
                    style='w-10'
                    target='_blank'
                />
                <Logo href='https://fahasa-blog.tumblr.com/'
                    src='/images/footer/Logo_MXH/tumblr-on.png'
                    style='w-10'
                    target='_blank'
                />
                <Logo href='https://x.com/Fahasa_com'
                    src='/images/footer/Logo_MXH/twitter-on.png'
                    style='w-10'
                    target='_blank'
                />
                <Logo href='https://www.pinterest.com/fahasavn/'
                    src='/images/footer/Logo_MXH/pinterest-on.png'
                    style='w-10'
                    target='_blank'
                />
            </div>

            <div className='flex justify-start py-2'>
                <Logo href='https://play.google.com/store/apps/details?id=com.fahasa.android.fahasa&pli=1'
                    src='/images/footer/Logo_NCC/android1.png'
                    style='w-28 lg:mr-4'
                    target='_blank'
                />
                <Logo href='https://apps.apple.com/us/app/fahasa-th%E1%BA%BF-gi%E1%BB%9Bi-trong-t%E1%BA%A7m-tay/id1227597830'
                    src='/images/footer/Logo_NCC/appstore1.png'
                    style='w-28'
                    target='_blank'
                />
            </div>
        </div>
    )
}

export default Footer_Left