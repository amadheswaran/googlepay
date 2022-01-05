const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const { getAccessToken } = require("../server/oauth");
const { PAYPAL_API_BASE } = require("../server/config");

async function createOrder() {
  const { access_token } = await getAccessToken();

  const { data } = await axios({
    url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    data: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    },
  });

  return data
}


async function getOrder(id){
  const { access_token } = await getAccessToken();

  const { data } = await axios({
    url: `${PAYPAL_API_BASE}/v2/checkout/orders/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    data: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    },
  });

  return data
}

async function main() {
  // CREATE order
  console.log("--- create -----")
  const order  = await createOrder()
  console.log(JSON.stringify(order, null, 4))


  const body = [
    {
      op: "replace",
      path: "/purchase_units/@reference_id=='default'/amount",
      value: {
        currency_code: "USD",
        value: "99.00",
      },
    },
  ];

  // PATCH order
  console.log("--- patch ----")
  const { access_token } = await getAccessToken();

  const { data } = await axios({
    url: `${PAYPAL_API_BASE}/v2/checkout/orders/${order.id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    data: body,
  });

  console.log(JSON.stringify(data, null, 4));

  // GET order
  console.log("--- GET ---")
  console.log(JSON.stringify(await getOrder(order.id), null, 4))
}

main().catch(console.log);