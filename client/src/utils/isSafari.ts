import isChrome from './isChrome';

function isSafari(): boolean {
  // Detect Safari
  let safariAgent = window?.navigator?.userAgent?.toLowerCase()?.indexOf('safari') > -1;

  // Discard Safari since it also matches Chrome
  if (isChrome() && safariAgent) safariAgent = false;

  return safariAgent;
}

export default isSafari;
