// utils/orders.js
import { supabase } from '../lib/supabase';

export async function getOrdersByTimeBoundary(timeBoundary) {
  let query = '';
  switch (timeBoundary) {
    case 'today':
      query = `SELECT * FROM orders WHERE DATE(order_created_at) = CURRENT_DATE;`;
      break;
    case 'yesterday':
      query = `SELECT * FROM orders WHERE DATE(order_created_at) = CURRENT_DATE - INTERVAL '1 day';`;
      break;
    case 'monthly':
      query = `SELECT * FROM orders WHERE DATE_PART('year', order_created_at) = DATE_PART('year', CURRENT_DATE)
               AND DATE_PART('month', order_created_at) = DATE_PART('month', CURRENT_DATE);`;
      break;
    case 'yearly':
      query = `SELECT * FROM orders WHERE DATE_PART('year', order_created_at) = DATE_PART('year', CURRENT_DATE);`;
      break;
    default:
      throw new Error('Invalid time boundary');
  }

  const { data, error } = await supabase.from('orders').select('*').execute(query);
  if (error) {
    throw error;
  }
  
  return data;
}
