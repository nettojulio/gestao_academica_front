"use client"

import { AuthTokenService } from '@/app/authentication/auth.token';
import { useEffect, useState } from 'react';

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import '../auth-styles.css';

function PageProfile() 
{
    const [tokenInfo, setTokenInfo] = useState<string[]>([]);

    useEffect(() => 
    {
        const authToken: any = AuthTokenService.getAuthToken(true);
        const expiresIn = AuthTokenService.getAuthTokenExpiresIn(false);

        const messages: string[] = [];

        messages.push("token_type: " + JSON.stringify(authToken?.token_type));
        messages.push("expires_in: " + expiresIn + " seconds");

        const [header, payload, signature] = authToken?.access_token?.split('.');

        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));

        messages.push("Header: " + JSON.stringify(decodedHeader));
        messages.push("Payload: " + JSON.stringify(decodedPayload));
        messages.push("Signature: " + signature);

        messages.push("Access token: " + authToken.access_token)

        messages.push(": "  +  AuthTokenService.isAdmin(false));
        messages.push("isGestor: "  +  AuthTokenService.isGestor(false));
        messages.push("isTecnico: "  +  AuthTokenService.isTecnico(false));
        messages.push("isAluno: "  +  AuthTokenService.isAluno(false));
        
        setTokenInfo(messages);
    }, []);

    return (
        <div className="justify-left px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900" style={{ maxWidth: '50%' }}>
            <h2 className="text-2xl font-bold custom-text-color dark:text-white">Token de Acesso</h2><br/>
            {tokenInfo.map((message, index) => (
                <div key={index}>
                    <div style={{ fontSize: 'small', textAlign: 'left', maxWidth: '100%', wordWrap: 'break-word' }}>{message}</div>
                    <br />
                </div>
            ))}
        </div>
    );
}

export default withAuthorization(PageProfile);