// convert eth address, for example to 0x15...068c
export const parseAddress = (address: string): string => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};
