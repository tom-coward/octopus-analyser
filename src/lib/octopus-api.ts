import { Consumption, Rate } from "./types/octopus-api";

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

  return responseJson.results as Rate[];
}

export async function getTariffUnitRates() {
  const productCode = process.env.OCTOPUS_PRODUCT_CODE;
  const tariffCode = process.env.OCTOPUS_TARIFF_CODE;
  
  const response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`, { headers });
  if (!response.ok) {
    throw new Error(`GET /standard-unit-rates Octopus API error: ${response.status}: ${response.statusText}`);
  }
  const responseJson = await response.json();

  return responseJson.results as Rate[];
}

export async function getConsumption(from: Date, to: Date) {
  const totalMinutes = Math.floor((to.getTime() - from.getTime()) / 1000 / 60);
  const total30MinutePeriods = Math.floor(totalMinutes / 30); // this will be number of meter readings (taken every 30 mins) we request (page_size)
  
  const mpan = process.env.OCTOPUS_METER_MPAN;
  const serialNumber = process.env.OCTOPUS_METER_SERIAL_NUMBER;

  const response = await fetch(`${BASE_URL}/electricity-meter-points/${mpan}/meters/${serialNumber}/consumption?page_size=${total30MinutePeriods}`, { headers });
  const responseJson = await response.json();

  return responseJson.results as Consumption[];
}


export interface Rate {
  value_exc_vat: number;
  value_inc_vat: number;
  valid_from: string;
  valid_to: string;
}

export interface Consumption {
  consumption: number;
  interval_start: string;
  interval_end: string;
}