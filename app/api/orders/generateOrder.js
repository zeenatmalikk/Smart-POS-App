import { selectCartItems } from "@/lib/redux/selectors/cardSelector";
import { supabase } from "../../../supabase/supabase"
import { generateOrder } from "@/lib/redux/slices/orderSlice";
import { store } from "@/lib/redux/store";
export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        // Fetch orders from the "orders" table
        const { data, error } = await supabase.from('orders').select('*');
  
        if (error) {
          throw error;
        }
  
        // Return the fetched orders
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Error fetching orders' });
      }
    }
    if (req.method === 'POST') { 
     // Assuming customerId and cartItems are passed in the request body
      // Assuming customerId and cartItems are passed in the request body
     try {
      const cartItems = selectCartItems(store.getState());
       // Dispatch action to generate order
       await store.dispatch(generateOrder({ customerId, cartItems }));
       res.status(200).json({ message: 'Order generated successfully' });
     } catch (error) {
       console.error('Error generating order:', error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   } 
}

