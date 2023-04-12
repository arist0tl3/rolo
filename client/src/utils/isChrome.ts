function isChrome(): boolean {
  return window?.navigator?.userAgent?.toLowerCase()?.indexOf('chrome') > -1;
}

export default isChrome;
