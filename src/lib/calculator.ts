import { Cost, getConsumption, getTariffStandingCharges, getTariffUnitRates } from "./octopus-api";

export async function calculateCost(from: Date, to: Date) {
  const standingCharges = await getTariffStandingCharges(from, to);
  const unitRates = await getTariffUnitRates(from, to);
  const consumption = await getConsumption(from, to);

  const numDays = Math.floor((to.getTime() - from.getTime()) / 1000 / 60 / 60 / 24); // number of days between from and to

  let totalStandingCharges = 0;
  standingCharges.forEach((standingCharge) => {
    totalStandingCharges = ((standingCharge.value_inc_vat / 100) * numDays);
    // TODO: handle changes of standing charges in the period (more than one standing charge record)
  });

  let totalUnitRate = 0;
  unitRates.forEach((unitRate) => {
    let rateConsumption = consumption.find((c) => c.interval_start === unitRate.valid_from)?.consumption; // get consumption during time of this unit rate
    totalUnitRate += ((unitRate.value_inc_vat / 100) * (rateConsumption ?? 0));
  });

  const totalCost = totalStandingCharges + totalUnitRate;

  return {
    totalStandingCharges,
    totalUnitRate,
    totalCost,
  } as Cost;
}