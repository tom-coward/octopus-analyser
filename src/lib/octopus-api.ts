const BASE_URL = process.env.OCTOPUS_API_URL || 'https://api.octopus.energy/v1';
const API_KEY = process.env.OCTOPUS_API_KEY;

const headers = {
  'Authorization': `Basic ${btoa(`${API_KEY}:`)}`
}

export async function getTariffStandingCharges(from: Date|undefined, to: Date|undefined) {
  const productCode = process.env.OCTOPUS_PRODUCT_CODE;
  const tariffCode = process.env.OCTOPUS_TARIFF_CODE;
  
  let response;
  if (from && to) {
    response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standing-charges/?period_from=${from.toISOString()}&period_to=${to.toISOString()}`, { headers });
  } else {
    response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standing-charges/`, { headers });
  }

  if (!response.ok) {
    throw new Error(`GET /standing-charges Octopus API error: ${response.status}: ${response.statusText}`);
  }
  const responseJson = await response.json();

  return responseJson.results as Rate[];
}

export async function getTariffUnitRates(from: Date|undefined, to: Date|undefined) {
  const productCode = process.env.OCTOPUS_PRODUCT_CODE;
  const tariffCode = process.env.OCTOPUS_TARIFF_CODE;

  let response;

  if (from && to) {
    response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/?period_from=${from.toISOString()}&period_to=${to.toISOString()}`, { headers });
  } else {
    response = await fetch(`${BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`, { headers });
  }
  
  if (!response.ok) {
    throw new Error(`GET /standard-unit-rates Octopus API error: ${response.status}: ${response.statusText}`);
  }
  const responseJson = await response.json();

  return responseJson.results as Rate[];
}

export async function getConsumption(from: Date|undefined, to: Date|undefined) {
  const mpan = process.env.OCTOPUS_ELECTRICITY_METER_MPAN;
  const serialNumber = process.env.OCTOPUS_ELECTRICITY_METER_SERIAL_NUMBER;

  let response;

  if (from && to) {
    const totalMinutes = Math.floor((to.getTime() - from.getTime()) / 1000 / 60); // number of minutes between from and to
    const total30MinutePeriods = Math.floor(totalMinutes / 30); // this will be number of meter readings (taken every 30 mins) we request (page_size)

    response = await fetch(`${BASE_URL}/electricity-meter-points/${mpan}/meters/${serialNumber}/consumption?page_size=${total30MinutePeriods}&period_from=${from.toISOString()}&period_to=${to.toISOString()}`, { headers });
  } else {
    response = await fetch(`${BASE_URL}/electricity-meter-points/${mpan}/meters/${serialNumber}/consumption/`, { headers });
  }

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

export interface Cost {
  totalStandingCharges: number;
  totalUnitRate: number;
  totalCost: number;
}