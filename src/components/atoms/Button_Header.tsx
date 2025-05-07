'use client';

import { useUser } from '@/contexts/AppContext';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface MyComponentProps {
    src: string;
    text: string;
    style: string;
    id: string;
}

const Button_Header: React.FC<MyComponentProps> = observer(({ src, text, style, id }) => {
    const router = useRouter();
    const userStore = useUser();

    const [numProd, setNumProd] = useState('0');
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        // const ws = new WebSocket('ws://localhost:3415');
        // ws.onopen = () => {
        //     console.log("Connected to ws");
        // }

        // ws.onmessage = (event) => {
        //     if (event.data) {
        //         const obj = JSON.parse(event.data)
        //         if (obj && obj.type === 'cart') {
        //             setNumProd(obj.numOfProducts)
        //         }
        //     }
        // }

        // ws.onclose = () => {
        //     console.log("Disconnected from WebSocket server");
        // };

        const fetchData = async () => {
        }
        fetchData();
        setIsClient(true);
        // return () => {
        //     ws.close();
        // };
    }, []);

    const handleButton_Header = () => {

        if (userStore && userStore.user) {
            // if (id === 'notification') router.push('/notification');
            if (id === 'account' && userStore.user.role === 'candidate') router.push('/candidate/profile');
            if (id === 'account' && userStore.user.role === 'employer') router.push('/employer/profile');
        }
        else router.push('/login');
    }
    return (
        <div onClick={handleButton_Header} className='cursor-pointer'>
            <div className='relative'>
                <img src={src} alt="logo" className={style} />
                {id === 'notification' && isClient && userStore?.user && <p className='absolute bottom-4 right-0 px-1 text-xs text-white rounded-full bg-red-500'>{numProd}</p>}
            </div>

            {id === 'account' && isClient && userStore?.user
                ?
                <p className='hidden md:block mt-1 text-xs text-slate-500'>
                    {(userStore.user.userName).length >= 10 ? (userStore.user.userName).slice(0, 7) + '...' : (userStore.user.userName)}
                </p>
                :
                <p className='text-xs mt-1 text-slate-500'>
                    {text}
                </p>
            }
        </div>
    )
});

export default Button_Header