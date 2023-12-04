import { StandingCharge } from "./types/octopus-api";

const BASE_URL = process.env.OCTOPUS_API_URL || 'https://api.octopus.energy/v1';
const API_KEY = process.env.OCTOPUS_API_KEY;

const headers = {
  'Authorization': `Basic ${btoa(`${API_KEY}:`)}`
}

export async function getTariffStandingCharges() {
  const productCode = process.env.OCTOPUS_PRODUCT_CODE;
  const tariffCode = process.env.OCTOPUS_TARIFF_CODE;
  
  const response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standing-charges/`, { headers });

  if (!response.ok) {
    throw new Error(`GET /standing-charges Octopus API error: ${response.status}: ${response.statusText}`);
  }
  const responseJson = await response.json();

  return responseJson.results as StandingCharge[];
}