import { authenticate } from '@/app/authentication/auth.service.serverside';

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const { credentials } = req.body;
        const authData = await authenticate(req, res, credentials);

        return res.status(200).json(authData);
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}