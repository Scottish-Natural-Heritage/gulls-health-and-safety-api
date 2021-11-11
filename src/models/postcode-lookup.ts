import Address from './postcode-lookup-address';

interface PostcodeLookup {
  results: [
    {
      address: Address[];
    },
  ];
  metadata: {
    querytime: number;
    vintage: number;
    jobid: number;
    count: number;
    maxResults: number;
    status: string;
  };
}

export default PostcodeLookup;
