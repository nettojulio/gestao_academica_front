import { useAuth } from '@/components/AuthProvider/AuthProvider';
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import router from 'next/router';
import { useEffect, useState } from 'react';
import '../auth-styles.css';

function PageProfile() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        const handleLogout = () => {
            if (!checked) {
                setChecked(true);

                const { id } = router.query;

                localStorage.removeItem("sgu_authenticated_user");
                setIsAuthenticated(false);

                if (typeof (id) !== 'undefined' && id === '/login') {
                    router.push('/login');
                }

            }
        };

        handleLogout();
    }, []);

    return null;
}

export default withAuthorization(PageProfile);
