import { MembershipStatus } from '../../../users/users.schema';
import { UsersService } from '../../../users/users.service';
import { parseISO } from 'date-fns';

export default [
  {
    _id: '64c51fefc300c24d31867624',
    name: 'Ishaq',
    email: 'furqan.khanzada+1@gmail.com',
    phone: '+923122052951',
    memberships: [
      {
        status: MembershipStatus.ACTIVE,
        businessId: '64c51d7c590a6b641d39222a',
        email: 'furqan.khanzada+1@gmail.com',
        package: {
          duration: '',
          name: 'Personal Training For Weight Training',
          id: 'cmVhY3Rpb24vY2F0YWxvZ1Byb2R1Y3Q6a0VmV3pyaVg2Y2ZaUFk1OUM=',
          amount: 5000,
        },
        startedAt: parseISO('2023-012-25T04:31:02.000Z'),
      },
    ],
  },
];
