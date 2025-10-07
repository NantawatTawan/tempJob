export function getUncachedImageUrl(url: string) {
  return url + `?randomvalue=${Math.random()}`;
}
