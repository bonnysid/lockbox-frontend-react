import { Navigate, RouteObject } from 'react-router-dom';
import { Layout, PrivateGuard } from '@/components';

export enum PublicLinks {
  LOGIN = '/login',
  REGISTER = '/register',
}

export enum PrivateLinks {
  HOME = '/',
}

export const ROUTES: RouteObject[] = [
  {
    path: '',
    element: <Layout />,
    children: [
      {
        element: <PrivateGuard reverse navigateTo={PrivateLinks.HOME} />,
        children: [
          {
            path: PublicLinks.LOGIN,
            Component: () => <>login</>,
          },
          {
            path: PublicLinks.REGISTER,
            Component: () => <>register</>,
          },
        ],
      },

      {
        element: <PrivateGuard navigateTo={PublicLinks.LOGIN} />,
        children: [
          {
            path: PrivateLinks.HOME,
            Component: () => <>home</>,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
