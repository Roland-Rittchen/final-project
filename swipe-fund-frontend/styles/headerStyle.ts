import { css } from '@emotion/native';
import Constants from 'expo-constants';

export const header = css`
  background-color: #6da10b;
`;

export const safeArea = css`
   {
    background-color: #6da10b;
  }
`;

export const view = css`{
  padding-top: ${Constants.statusBarHeight} + 10,
  padding-bottom: 20,
}`;

export const label = css`{
  background-color: #6da10b,
  font-size: 32,
  font-weight: 'bold',
  text-align: 'center',
}`;
