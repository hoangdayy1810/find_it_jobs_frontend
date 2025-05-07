import React from 'react'
import Footer_List_Li from '../atoms/Footer_List_Li'
import Logo from '../atoms/Logo'

const Footer_Right = () => {
    return (
        <div className='mt-2 md:mt-0 md:pl-10'>
            <div className='grid gap-4 lg:grid-cols-3 grid-cols-2 md:gap-16'>
                <div>
                    <div className='mb-2'>
                        <h3 className='font-bold text-lg'>DỊCH VỤ</h3>
                    </div>
                    <div>
                        <ul>
                            <Footer_List_Li text='Điều khoản sử dụng' />
                            <Footer_List_Li text='Chính sách bảo mật thông tin cá nhân' />
                            <Footer_List_Li text='Chính sách bảo mật thanh toán' />
                            <Footer_List_Li text='Giới thiệu Fahasa' />
                            <Footer_List_Li text='Hệ thống trung tâm - nhà sách' />
                        </ul>
                    </div>
                </div>
                <div>
                    <div className='mb-2'>
                        <h3 className='font-bold text-lg'>HỖ TRỢ</h3>
                    </div>
                    <div>
                        <ul>
                            <Footer_List_Li text='Chính sách đổi - trả - hoàn tiền' />
                            <Footer_List_Li text='Chính sách bảo hành - bồi hoàn' />
                            <Footer_List_Li text='Chính sách vận chuyển' />
                            <Footer_List_Li text='Chính sách khách sỉ' />
                        </ul>
                    </div>
                </div>
                <div>
                    <div className='mb-2'>
                        <h3 className='font-bold text-lg'>TÀI KHOẢN CỦA TÔI</h3>
                    </div>
                    <div>
                        <ul>
                            <Footer_List_Li text='Đăng nhập/Tạo mới tài khoản' />
                            <Footer_List_Li text='Thay đổi địa chỉ khách hàng' />
                            <Footer_List_Li text='Chi tiết tài khoản' />
                            <Footer_List_Li text='Lịch sử mua hàng' />
                        </ul>
                    </div>
                </div>
            </div>

            <div className='mt-4'>
                <div className='mb-2'>
                    <h3 className='font-bold text-lg'>LIÊN HỆ</h3>
                </div>
                <div>
                    <ul className='grid grid-cols-1 md:grid-cols-3 md:gap-16'>
                        <li className='text-sm py-2'>
                            <i className="fa-solid fa-location-dot fa-lg mr-1"></i>
                            60-62 Lê Lợi, Q.1, TP. HCM
                        </li>
                        <li className='text-sm py-2'>
                            <i className="fa-solid fa-envelope fa-lg mr-1"></i>
                            cskh@fahasa.com.vn
                        </li>
                        <li className='text-sm py-2'>
                            <i className="fa-solid fa-phone fa-lg mr-1"></i>
                            1900636467
                        </li>
                    </ul>
                </div>
            </div>

            <div className='flex justify-around items-center py-2'>
                <Logo href='https://vnpay.vn/'
                    src='/images/footer/Logo_NCC/vnpay_logo.png'
                    style='w-32'
                    target='_blank'
                />
                <Logo href='https://www.momo.vn/'
                    src='/images/footer/Logo_NCC/momopay.png'
                    style='w-16'
                    target='_blank'
                />
            </div>
        </div>
    )
}

export default Footer_Right