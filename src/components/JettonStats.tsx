export default function JettonStats() {
    const stats = {
      name: "CHOP",
      supply: "1,000,000",
      holders: 256,
      price: "0.00042 TON"
    };
  
    return (
      <div className="grid grid-cols-2 gap-4">
        <div><strong>Name:</strong> {stats.name}</div>
        <div><strong>Supply:</strong> {stats.supply}</div>
        <div><strong>Holders:</strong> {stats.holders}</div>
        <div><strong>Price:</strong> {stats.price}</div>
      </div>
    );
  }
  