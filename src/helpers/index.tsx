import React from 'react';
import {filter, isEmpty, join, map, take, get} from 'lodash';
import {addResponseMessage, renderCustomComponent} from 'react-chat-widget';
import {searchInLibrary, searchInRecommendations} from '../api';
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

export const handleSearchInRecommendations = async ({
  message,
  addMessage,
  articleResponse,
  pureCloudCredentials
}: {
  message: string;
  addMessage: (message) => void;
  pureCloudCredentials?: PureCloudCredentials;
  articleResponse: string;
}) => {
  const response = await searchInRecommendations(message, pureCloudCredentials);
  const gems = get(response, 'recommendations');
  const validGems = take(filter(gems, 'publicURL'), 3);

  console.warn({gems});

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
