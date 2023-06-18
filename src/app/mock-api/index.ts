
import { ActivitiesMockApi } from 'app/mock-api/pages/activities/api';

import { AuthMockApi } from 'app/mock-api/common/auth/api';

import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { FinanceMockApi } from 'app/mock-api/dashboards/finance/api';


import { IconsMockApi } from 'app/mock-api/ui/icons/api';

import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';

import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ProjectMockApi } from 'app/mock-api/dashboards/project/api';
import { SearchMockApi } from 'app/mock-api/common/search/api';

import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { freelanceMockApi } from 'app/mock-api/apps/freelance/api';
import { UserMockApi } from 'app/mock-api/common/user/api';

export const mockApiServices = [
   
    ActivitiesMockApi,
    AuthMockApi,
    
    ChatMockApi,
    
    IconsMockApi,
   FinanceMockApi,
    MessagesMockApi,
    NavigationMockApi,
  
    NotificationsMockApi,
    ProjectMockApi,
    SearchMockApi,
   
    ShortcutsMockApi,
    freelanceMockApi,
    UserMockApi
];
