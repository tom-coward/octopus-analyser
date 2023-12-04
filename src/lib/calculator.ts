import { Cost, getConsumption, getTariffStandingCharges, getTariffUnitRates } from "./octopus-api";

export async function calculateCost(from: Date, to: Date) {
  const standingCharges = await getTariffStandingCharges(from, to);
  const unitRates = await getTariffUnitRates(from, to);
  const consumption = await getConsumption(from, to);

  const numDays = Math.floor((to.getTime() - from.getTime()) / 1000 / 60 / 60 / 24); // number of days between from and to

  // TODO: handle changes of standing charges in the period (more than one standing charge record)
  const totalStandingCharges = (standingCharges[0].value_inc_vat / 100) * numDays;

  let totalUnitRate = 0;
  unitRates.forEach((unitRate) => {
    const rateConsumption = consumption.find((c) => c.interval_start === unitRate.valid_from)?.consumption; // get consumption during time of this unit rate
    totalUnitRate += ((unitRate.value_inc_vat / 100) * (rateConsumption ?? 0));
  });

  const totalCost = totalStandingCharges + totalUnitRate;

  return {
    totalStandingCharges,
    totalUnitRate,
    totalCost,
  } as Cost;
}