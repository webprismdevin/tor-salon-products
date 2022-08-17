import { useState, useEffect } from "react";
import graphClient from "./graph-client";
import { gql } from "graphql-request";

function useUser() {
  const [user, setUser] = useState<any>(null);

  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    async function checkToken() {
      let token = JSON.parse(
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        ) as any
      );

      if (token) {
        setToken(token);
      }
    }

    checkToken();
  }, []);

  async function getUser(accessToken: any) {
    const mutation = gql`
    query {
      customer(customerAccessToken: "${accessToken}") {
        id
        firstName
        lastName
        email
        tags
        defaultAddress {
          company
          address1
          address2
          city
          province
          zip
        }
      }
    }
  `;

    const response = await graphClient.request(mutation);

    if (response.errors) {
      console.log(JSON.stringify(response.errors, null, 2));
      throw Error("There was a problem creating the user. Please check logs");
    }

    setUser({
      ...response.customer,
      isPro: response.customer.tags.includes("Professional"),
    });
  }

  useEffect(() => {
    if (token) {
      getUser(token.customerAccessToken.accessToken);
      console.log("firing");
    }
  }, [token]);

  return [user, setUser, token, setToken];
}

export default useUser;