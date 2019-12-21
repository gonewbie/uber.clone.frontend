import { gql } from 'apollo-boost';

export const VERIFY_PHONE = gql `
  mutation verifyPhone($phoneNumber: String!, $key: String!) {
    CompletePhoneVerification(phoneNumber: $phoneNumber, key: $key) {
      ok
      error
      token
    }
  }
`;