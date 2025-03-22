'use client';

import { useEffect, useState } from 'react';

export default function PageAuthorized() {
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setCode(urlParams.get('code') || '');
        }
    }, []);

    return <span>Authorized {code}</span>;
}
