// custom errors
export interface IError {
  error: boolean;
  message: string;
  code: number;
  btn: string;
}

// nft punk contract
export interface IContractNFT {
  tokenURI?: string;
  dna?: string;
  owner?: string;
  accessoriesType?: string;
  clotheColor?: string;
  clotheType?: string;
  eyeType?: string;
  eyeBrowType?: string;
  facialHairColor?: string;
  facialHairType?: string;
  hairColor?: string;
  hatColor?: string;
  graphicType?: string;
  mouthType?: string;
  skinColor?: string;
  topType?: string;
}

// nft to detail nft page
export interface ICompleteNFT {
  tokenURI?: string;
  dna?: string;
  owner?: string;
  attributes?: IContractNFT;
  name?: string;
  description?: string;
  image?: string;
}

// nfts from moralis
export interface INFT {
  token_address?: string;
  token_id?: string;
  amount?: string | undefined;
  token_hash?: string | undefined;
  block_number_minted?: string | undefined;
  updated_at?: string | undefined;
  contract_type?: string | undefined;
  name?: string | undefined;
  symbol?: string | undefined;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  last_token_uri_sync?: string | undefined;
  last_metadata_sync?: string | undefined;
  minter_address?: string | undefined;
  owner_of?: string | undefined;
}

// nft state
export interface INFTs {
  loading: boolean;
  data: INFT[] | [];
  length: number;
}
