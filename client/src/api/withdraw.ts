export async function requestWithdraw(toAddress: string, amount: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toAddress, amount }),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Withdraw failed:', err);
    return { success: false, error: 'Withdraw request failed' };
  }
}
