import express from 'express'
import { getTariffStandingCharges } from './lib/octopus-api';

const app = express();
const port = 3000;

app.get('/standing-charges', async (req, res) => {
  const standingCharges = await getTariffStandingCharges();
  res.send(standingCharges);
});

app.listen(port, () => {
  console.log(`API started on port ${port}`);
})