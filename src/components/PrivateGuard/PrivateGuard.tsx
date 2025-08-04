import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type PrivateGuardProps = {
  reverse?: boolean;
  navigateTo: string;
};

export const PrivateGuard: FC<PrivateGuardProps> = ({ reverse, navigateTo }) => {
  const isAuth = false;

  if (reverse) {
    return !isAuth ? <Outlet /> : <Navigate to={navigateTo} />;
  }

  return isAuth ? <Outlet /> : <Navigate to={navigateTo} />;
};
