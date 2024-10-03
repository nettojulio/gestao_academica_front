import { APP_ROUTES } from "@/constants/app-routes";

export function checkIsPublicRoute(asPath: string){
    const appPlublicRoutes = Object.values(APP_ROUTES.public);
    const appPrivateRoutes = Object.values(APP_ROUTES.private);

    return appPlublicRoutes.includes(asPath) || appPrivateRoutes.includes(asPath);
}