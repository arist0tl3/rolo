import getMobileOS from './getMobileOS';

function isIOS(): boolean {
  return getMobileOS() === 'iOS';
}

export default isIOS;
