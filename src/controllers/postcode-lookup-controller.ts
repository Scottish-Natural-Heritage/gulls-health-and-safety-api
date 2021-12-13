import utils from 'naturescot-utils';
import axios, {AxiosResponse} from '../config/axios';
import PostcodeLookup from '../models/postcode-lookup';

// Load the config.
import config from '../config/app';

const PostcodeLookupController = {
  async findAddresses(postcode: string): Promise<PostcodeLookup> {
    // Check to see if the postcode is a valid UK postcode.
    if (!utils.postalAddress.isaRealUkPostcode(postcode)) {
      throw new Error('Invalid postcode.');
    }

    // Format postcode
    const cleanPostcode = utils.postalAddress.formatPostcodeForPrinting(postcode);
    // Send axios GET request to the Postcode lookup service with the auth token.
    const serverResponse: AxiosResponse = await axios.get('https://cagmap.snh.gov.uk/gazetteer', {
      params: {
        postcode: cleanPostcode,
      },
      headers: {
        Authorization: `Bearer ${config.postcodeApiKey}`,
      },
    });

    // Only save the address results from the API, There is no need to save any other info that comes back from the
    // API as it will never be used by our apps.
    return serverResponse.data as PostcodeLookup;
  },
};

export default PostcodeLookupController;
