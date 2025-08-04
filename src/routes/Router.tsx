import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { ROUTES } from './routes';

type RouterProps = {};

export const Router: FC<RouterProps> = ({}) => {
  const routes = useRoutes(ROUTES);

  return <>{routes}</>;
};
