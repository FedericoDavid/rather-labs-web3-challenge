const truncateWallet = (address: string) => `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`;

export default truncateWallet;
