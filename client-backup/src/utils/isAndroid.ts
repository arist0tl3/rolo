import getMobileOS from './getMobileOS';

function isAndroid(): boolean {
  return getMobileOS() === 'Android';
}

export default isAndroid;
