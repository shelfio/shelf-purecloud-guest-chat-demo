import React from 'react';
import {filter, isEmpty, join, map, take} from 'lodash';
import {addResponseMessage, renderCustomComponent} from 'react-chat-widget';
import {searchInLibrary} from '../api';
import {PureCloudCredentials} from '../types';

export const handleSearchInLibrary = async ({
  intentName,
  pureCloudCredentials,
  addMessage,
  articleResponse
}: {
  intentName: string;
  pureCloudCredentials?: PureCloudCredentials;
  addMessage: (message) => void;
  articleResponse: string;
}) => {
  const gems = await searchInLibrary(intentName, pureCloudCredentials);
  const validGems = take(filter(gems, 'publicURL'), 3);

  if (!isEmpty(validGems)) {
    addMessage(
      `bot reply: 
          ${join(
            map(validGems, gem => `[${gem.title}](${gem.publicURL})`),
            '\n'
          )}`
    );
    addResponseMessage(articleResponse);
    map(validGems, gem =>
      renderCustomComponent(() => (
        <div className={'Widget__gem'} key={gem._id}>
          <a className={'Widget__gem-grid'} href={gem.publicURL} target={'_blank'}>
            <div className={'Widget__image'}></div>
            <div className={'Widget__title'}>{gem.title}</div>
            <div className={'Widget__description'}>
              <span>{gem.description}</span>
            </div>
          </a>
        </div>
      ))
    );
  }
};
