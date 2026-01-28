export type MobileOSType = 'Android' | 'iOS' | 'Other';

function getMobileOS(): MobileOSType {
  const { userAgent } = navigator;

  if (/android/i.test(userAgent)) return 'Android';

  if (/iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iOS';

  return 'Other';
}

export default getMobileOS;
