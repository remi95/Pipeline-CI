import { MenuItem } from '../models/MenuModel';
import ROUTES from './routes';

const menuItems: MenuItem[] = [
  {
    label: 'Services',
    link: ROUTES.FAVORS,
  },
  {
    label: 'Demandes',
    link: ROUTES.REQUESTS,
  },
  // {
  //   label: 'Qui sommes-nous ?',
  //   link: ROUTES.CONCERTO,
  // },
  {
    label: 'Changer de zone',
    link: ROUTES.REGION,
  },
];

export default menuItems;
