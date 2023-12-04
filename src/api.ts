import express from 'express'
import { getConsumption, getTariffStandingCharges, getTariffUnitRates } from './lib/octopus-api';

const app = express();
const port = 3000;

app.get('/standing-charges', async (req, res) => {
  try {
    const standingCharges = await getTariffStandingCharges();
    res.send(standingCharges);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

app.get('/unit-rates', async (req, res) => {
  try {
    const unitRates = await getTariffUnitRates();
    res.send(unitRates);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

app.get('/consumption', async (req, res) => {
  try {
    const from = new Date(req.query.from as string);
    const to = new Date(req.query.to as string);

    const consumption = await getConsumption(from, to);
    
    res.send(consumption);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

function handleError(error: unknown, res: express.Response) {
  if (error instanceof Error) {
    res.status(500).send(error.message);
  }

  res.status(500);
}

app.listen(port, () => {
  console.log(`API started on port ${port}`);
});