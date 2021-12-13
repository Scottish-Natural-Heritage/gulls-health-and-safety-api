// Disabled this rule as it does'nt like the uprn, usrn numbers that gazetteer responds.
/* eslint-disable unicorn/numeric-separators-style */
import MockAdapter from 'axios-mock-adapter';
import axios, {AxiosResponse} from 'axios';

import config from './app';

if (config.underTest) {
  const gazetteerResponse = {
    results: [
      {
        address: [
          {
            uprn: 10092032547,
            udprn: '28568123',
            change_type: 'I',
            state: null,
            state_date: null,
            class: 'OR04',
            parent_uprn: '130137528',
            rpc: 2,
            local_custodian_code: 7655,
            country: 'S',
            la_start_date: '2020-10-08',
            last_update_date: '2021-04-11',
            entry_date: '2012-03-19',
            rm_organisation_name: 'NATURESCOT',
            la_organisation: 'NATURESCOT',
            department_name: '',
            legal_name: '',
            sub_building_name: '',
            building_name: 'GREAT GLEN HOUSE',
            building_number: null,
            sao_start_number: null,
            sao_start_suffix: '',
            sao_end_number: null,
            sao_end_suffix: '  ',
            sao_text: 'NATURESCOT',
            alt_language_sao_text: '',
            pao_start_number: null,
            pao_start_suffix: '',
            pao_end_number: null,
            pao_end_suffix: '',
            pao_text: 'GREAT GLEN HOUSE',
            alt_language_pao_text: '',
            usrn: 84409674,
            usrn_match_indicator: '2',
            area_name: '',
            level: '',
            official_flag: 'N',
            os_address_toid: 'osgb1000002142075147',
            os_address_toid_version: 10,
            os_roadlink_toid: 'osgb5000005232930098',
            os_roadlink_toid_version: 0,
            os_topo_toid: 'osgb5000005233840460',
            os_topo_toid_version: 2,
            voa_ct_record: null,
            voa_ndr_record: null,
            street_description: 'LEACHKIN ROAD',
            alt_language_street_description: '',
            dependent_thoroughfare: '',
            thoroughfare: 'LEACHKIN ROAD',
            welsh_dependent_thoroughfare: '',
            welsh_thoroughfare: '',
            double_dependent_locality: '',
            dependent_locality: '',
            locality: '',
            welsh_dependent_locality: '',
            welsh_double_dependent_locality: '',
            town_name: 'INVERNESS',
            administrative_area: 'HIGHLAND',
            post_town: 'INVERNESS',
            welsh_post_town: '',
            postcode: 'IV3 8NW',
            postcode_locator: 'IV3 8NW',
            postcode_type: 'S',
            delivery_point_suffix: '1Z',
            addressbase_postal: 'D',
            po_box_number: '',
            ward_code: 'S13003002',
            parish_code: '',
            rm_start_date: '2012-03-19',
            multi_occ_count: 0,
            voa_ndr_p_desc_code: '',
            voa_ndr_scat_code: '',
            alt_language: '   ',
            matchscore: 100,
          },
        ],
      },
    ],
    metadata: {
      querytime: 0.01726,
      vintage: 88,
      jobid: null,
      count: 1,
      maxResults: 1000,
      status: 'OK',
    },
  };

  const mock = new MockAdapter(axios);
  mock
    .onGet('https://cagmap.snh.gov.uk/gazetteer', {params: {uprn: 10092032547, fieldset: 'all'}})
    .reply(200, gazetteerResponse)
    // CSpell:disable-next-line
    .onAny(/^http:\/\/localhost:3017\/gulls-health-and-safety-api\/v1\/\/applications\/.*\/$/)
    .reply(404, {detail: 'Not found'})
    .onAny()
    .reply(500);
}

export default axios;
export {AxiosResponse};
