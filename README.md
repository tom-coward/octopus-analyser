# octopus-analyser
Octopus Analyser uses the [Octopus Energy API](https://developer.octopus.energy/docs/api/) to query standing charges, unit rates (including 'dynamic' rates on smart tariffs) and electricity consumption (meter readings). It can then calculate estimated costs based on these three metrics.

![node-current](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![npm-current](https://img.shields.io/badge/npm-%3E%3D9.0.0-yellow)

## Installation
Simply `npm install`.

## Running
Build the project using `npm run build` (just runs `tsc`). `tsc` will build into the `./dist` directory.

Then you can run using node (>= v20; an [`.nvmrc`](./nvmrc) file is included if you use nvm).

The following environment variables will need to be defined:
- **OCTOPUS_API_BASE_URL**: the base URL of the Octopus API (default: https://api.octopus.energy/v1)
- **OCTOPUS_API_KEY**: your API key (can be found in personal details in the Octopus dashboard)
- **OCTOPUS_PRODUCT_CODE**: the product code of your tariff
- **OCTOPUS_TARIFF_CODE**: the tariff code of your... tariff
- **OCTOPUS_ELECTRICITY_METER_MPAN**: your electricity meter's MPAN (can be found in personal details in the Octopus dashboard)
- **OCTOPUS_ELECTRICITY_METER_SERIAL_NUMBER**: your electricity meter's serial number (can be found in personal details in the Octopus dashboard)

An `.env.example` file is included (to be copied to `.env`) if you'd like to pass it to Node; i.e:
```
node --env-file=.env .
```

