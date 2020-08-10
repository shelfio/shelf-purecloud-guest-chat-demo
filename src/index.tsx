import React from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import {Store} from './stores/redux-store';
import i18n from './i18n';
import './index.css';
import ChatWidget from './ChatWidget';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={Store}>
      <ChatWidget
        pureCloudEnvironment={'mypurecloud.com'}
        pureCloudCredentials={{
          chatBotCredentials: {
            accountId: 'xxx',
            shelfDomain: 'shelf.io',
            allowedSSPLibraryIds: ['xxx']
          },
          chatCredentials: {
            organizationId: 'xxx',
            deploymentId: 'xxx',
            memberInfo: {
              displayName: 'Guest'
            },
            routingTarget: {
              targetType: 'queue',
              targetAddress: 'xxx'
            }
          }
        }}
      />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
