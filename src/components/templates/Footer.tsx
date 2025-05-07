import React from 'react'
import Logo from '../atoms/Logo'
import Footer_Left from '../molecules/Footer_Left'
import Footer_Right from '../molecules/Footer_Right'

const Footer = () => {
    return (
        <div className='mx-auto p-4 rounded-md md:bg-[#FFFFFF] md:w-5/6'>
            <div className='md:flex md:justify-center'>
                <div className='md:w-1/3'>
                    <Footer_Left />
                </div>
                <div className='md:w-2/3'>
                    <Footer_Right />
                </div>
            </div>
        </div>
    )
}

export default Footer