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
            allowedSSPLibraryIds: ['f78c9a1e-e7d7-4b55-a8de-9d4ec18daded']
          },
          chatCredentials: {
            organizationId: 'bb570674-c29a-4b70-aca1-5660981f9a22',
            deploymentId: 'be348b1a-8644-47c2-86ec-94ab69fa1a65',
            memberInfo: {
              displayName: 'Guest'
            },
            routingTarget: {
              targetType: 'queue',
              targetAddress: 'Web Chat Queue'
            }
          }
        }}
      />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
