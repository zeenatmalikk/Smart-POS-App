import { getOrdersByTimeBoundary } from "@/utils/order";

export default async function handler(req, res) {
    const { timeBoundary } = req.query;
    
    try {
      const orders = await getOrdersByTimeBoundary(timeBoundary);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }