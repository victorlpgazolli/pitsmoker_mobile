/**
 * @format
 */
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Warning: ...']);

console.disableYellowBox = true;
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
