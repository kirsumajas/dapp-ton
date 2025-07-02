export async function connectWalletAPI(
  telegram_id: string,
  wallet_address: string
): Promise<{ message: string } | { error: string }> {
  const res = await fetch('/api/wallet/connect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telegram_id,
      wallet_address,
    }),
  });

  return res.json();
}
