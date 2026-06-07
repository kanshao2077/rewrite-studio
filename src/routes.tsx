import Workspace from './pages/Workspace';
import type { RouteConfig } from '@/types';

const routes: RouteConfig[] = [
  {
    name: 'Workspace',
    path: '/',
    element: <Workspace />,
  },
];

export default routes;
