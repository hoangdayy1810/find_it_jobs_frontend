'use client';

import { useUser } from '@/contexts/AppContext';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

const Title_Profile = observer(() => {
    const userStore = useUser();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    });
    return (
        <div className="mb-8">
            <p className="text-red-500 mb-2">👋 Xin chào</p>
            <h3 className="text-xl font-medium">{isClient ? userStore?.user?.userName : ''}</h3>
        </div>
    )
});

export default Title_Profile