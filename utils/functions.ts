// convert eth address, for example to 0x15...068c
export const parseAddress = (address: string): string => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};

// check if the connection is from a mobile
export const isMobileVersion = () => {
  const { userAgent } = navigator;
  if (
    userAgent &&
    (userAgent.match(/Android/i) ||
      userAgent.match(/webOS/i) ||
      userAgent.match(/iPhone/i) ||
      userAgent.match(/iPad/i) ||
      userAgent.match(/iPod/i) ||
      userAgent.match(/BlackBerry/i) ||
      userAgent.match(/Windows Phone/i))
  ) {
    return true;
  } else return false;
};
