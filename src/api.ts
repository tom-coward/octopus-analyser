import express from 'express'
import { getConsumption, getTariffStandingCharges, getTariffUnitRates } from './lib/octopus-api';
import { calculateCost } from './lib/calculator';

const app = express();
const port = 3000;

app.get('/standing-charges', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    
    const standingCharges = await getTariffStandingCharges(from, to);
    res.send(standingCharges);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

app.get('/unit-rates', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;
    
    const unitRates = await getTariffUnitRates(from, to);
    res.send(unitRates);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

app.get('/consumption', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const consumption = await getConsumption(from, to);

    res.send(consumption);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

app.get('/cost', async (req, res) => {
  try {
    if (!req.query.from || !req.query.to) {
      res.status(400).send('Invalid from or to date/time');
      return;
    }
    
    const from = new Date(req.query.from as string);
    const to = new Date(req.query.to as string);

    const totalCost = await calculateCost(from, to);

    res.send(totalCost);
  } catch (error: unknown) {
    handleError(error, res);
  }
});


function handleError(error: unknown, res: express.Response) {
  if (error instanceof Error) {
    res.status(500).send(error.message);
    return;
  }

  res.status(500);
}


app.listen(port, () => {
  console.log(`API started on port ${port}`);
});