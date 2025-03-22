"use server"

import axios from "axios";

import generatePKCE from "./PKCEGenerator ";

// var agent = new https.Agent({ 
//     rejectUnauthorized: false,
//     ca: fs.readFileSync('./app/certs/cert.pem'),
// }); 



const http = axios.create({
    //httpsAgent: agent,
    baseURL: `${process.env.PUBLIC_BASE_URL}`,
    headers: {
        "Content-type": "application/x-www-form-urlencoded",
    },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authenticate = async (req: any, res: any, credentials: string) => 
{
    try 
    {

        const response = await http.post(`/login`, credentials);

        //console.log(response);
        //console.log("response.headers.hasOwnProperty('Failed-authentication') = " + response.headers.hasOwnProperty('failed-authentication'))
        //console.log("response.headers = " + JSON.stringify(response.headers));

        let cookie;
        if (response.status === 200 && !response.headers.hasOwnProperty('failed-authentication')) 
            cookie = response.headers['set-cookie'];
        else 
        {
            if (response.headers && response.headers['blocked-account']) 
                  return res.status(401).json({ message: response.headers['blocked-account'] });
            else 
                return res.status(401).json({ message: "Credencial inválida" });
        }

        /* PEGAR O AUTHORIZATION CODE E LOGO EM SEGUIDA O JWT TOKEN */
        http.defaults.headers.common['Cookie'] = cookie;

        const { code_verifier, code_challenge, code_challenge_method } =  generatePKCE();
        
        // console.log("code_verifier: " + code_verifier);
        // console.log("code_challenge: " + code_challenge);
        // console.log("code_challenge_method: " + code_challenge_method);

        const authorizeURI = `oauth2/authorize?response_type=code&client_id=oidc-client&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}`;

        const authCodeResponse = await http.get(authorizeURI);

        let authorizationCode;
        let authToken;
        let authTokenExpiresIn;

        if (authCodeResponse.status === 200) 
        {
            // get the authorization code
            if (authCodeResponse.request && authCodeResponse.request.path) 
            {
                const authorizationCodeURL = authCodeResponse.request.path;
                // console.log('response.request.path:', authorizationCodeURL);  

                // Encontra o índice do código na URL
                const codeIndex = authorizationCodeURL.indexOf("/authorized?code=");

                if (codeIndex !== -1) 
                {
                    authorizationCode = authorizationCodeURL.substring(codeIndex + "/authorized?code=".length);
                    // console.log("Authorization_code:", authorizationCode);
                } 
                else
                    return res.status(401).json({ message: "Erro na autenticação" });
            } 
            else
                return res.status(401).json({ message: "Erro na autenticação" });

            
            const accessTokenForm = "code=" +  authorizationCode + 
                "&grant_type=authorization_code" + 
                "&client_id=oidc-client" + 
                `&code_verifier=${code_verifier}`;

            const authTokenResponse = await http.post(`oauth2/token`, accessTokenForm);

            if (authTokenResponse.status === 200 && authTokenResponse.data) 
            {
                authToken = authTokenResponse.data;
                authTokenExpiresIn = (Date.now() / 1000) + authTokenResponse.data.expires_in;

                // console.log("Auth token: " + JSON.stringify(authTokenResponse.data));
            }
            else
                return res.status(401).json({ message: "Erro na autenticação" });
        }
        else
            return res.status(401).json({ message: "Erro na autenticação" });

        res.status(200).json({ 
            'cookie': cookie,
            //'authorizationCode': authorizationCode,
            'authToken': authToken,
            'authTokenExpiresIn': authTokenExpiresIn
        });
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) 
    {
        console.log("Error: ", error);

        if (error.code && error.code === 'ECONNREFUSED')
            return res.status(500).json({ message: "Nenhuma resposta recebida do servidor" });
        else
        if (error.response.status === 400) 
            return res.status(400).json({ message: JSON.stringify(error.response.data) });
        else
        if (error.response.status === 404) 
            return res.status(404).json({ message: "Nenhuma resposta recebida do servidor" });
        else
            return res.status(500).json({ message: `${error.message}<br/>${error.response.data.detail}` });
    }
};
