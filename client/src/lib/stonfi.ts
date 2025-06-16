import { StonApiClient } from '@ston-fi/api';


export async function fetchNotcoinPoolStats() {
  const poolAddress = "EQCaY8Ifl2S6lRBMBJeY35LIuMXPc8JfItWG4tl7lBGrSoR2"; // NOT/TON pool
  const client = new StonApiClient();

  const pool = await client.getPool(poolAddress);

  const reserveNot = Number(pool.reserve0) / 1e9;
  const reserveTon = Number(pool.reserve1) / 1e9;

  const tonPriceUsd = 5.0;

  const notPriceUsd = (reserveTon / reserveNot) * tonPriceUsd;
  const liquidityUsd = reserveTon * tonPriceUsd * 2;

  return {
    priceUsd: Number(notPriceUsd),
    liquidityUsd: Number(liquidityUsd),
    reserveNot: Number(reserveNot),
    reserveTon: Number(reserveTon),
  };
}

