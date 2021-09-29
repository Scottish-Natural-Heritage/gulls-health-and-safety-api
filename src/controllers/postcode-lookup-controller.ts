import axios, {AxiosResponse} from 'axios';
import Address from '../models/address';
import PostcodeLookup from '../models/postcode-lookup';

// Load the config.
import config from '../config/app';

const PostcodeLookupController = {
  async findAddresses(postcode: string): Promise<Address[]> {
    // Send axios GET request to the Postcode lookup service with the auth token.
    const severResponse: AxiosResponse = await axios.get('https://cagmap.snh.gov.uk/gazetteer?postcode=' + postcode, {
      headers: {
        Authorization: `Bearer ${config.postcodeApiKey ? config.postcodeApiKey : ''}`,
      },
    });

    // Only save the address results from the API, There is no need to save any other info that comes back from the
    // API as it will never be used by our apps.
    const addressResults: PostcodeLookup = severResponse.data as PostcodeLookup;

    return addressResults.results[0].address;
  },
};

export default PostcodeLookupController;
