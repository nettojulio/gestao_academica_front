import { APP_ROUTES } from "@/constants/app-routes";

export function checkIsPublicRoute(asPath: string){
    const appPlublicRoutes = Object.values(APP_ROUTES.public);

    return appPlublicRoutes.includes(asPath);
}