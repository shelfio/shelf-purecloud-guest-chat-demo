import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import ChatWidget from './ChatWidget';
import {Store} from './stores/redux-store';
import {PureCloudCredentials} from './types';
import i18n from './i18n';

export default class EmbeddableChat {
  static el;

  static mount({
    parentElement = '',
    ...props
  }: {
    parentElement: string;
    pureCloudEnvironment?: string;
    pureCloudCredentials?: PureCloudCredentials;
  }) {
    const component = (
      <I18nextProvider i18n={i18n}>
        <Provider store={Store}>
          <ChatWidget {...props} />
        </Provider>
      </I18nextProvider>
    );

    function doRender() {
      if (EmbeddableChat.el) {
        throw new Error('EmbeddableChat is already mounted, unmount first');
      }

      const el = document.createElement('div');
      // IMPORTANT: this className used in Webpack config,
      // styles applied just because of it
      el.setAttribute('class', 'AppHolder');

      if (parentElement) {
        document.querySelector(parentElement)!.appendChild(el);
      } else {
        document.body.appendChild(el);
      }
      ReactDOM.render(component, el);
      EmbeddableChat.el = el;
    }
    if (document.readyState === 'complete') {
      doRender();
    } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
  }

  static unmount() {
    if (!EmbeddableChat.el) {
      throw new Error('EmbeddableChat is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(EmbeddableChat.el);
    EmbeddableChat.el.parentNode.removeChild(EmbeddableChat.el);
    EmbeddableChat.el = null;
  }
}
