import { supabase } from "@/supabase/supabase";
import { createSlice } from "@reduxjs/toolkit";
const { v4: uuidv4 } = require("uuid");
const initialState = {
  orders: [],
};
const orderId = uuidv4();

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    async generateOrder(state, action) {
      try {
        const { customerId, cartItems } = action.payload;
        // Calculate total amount and other necessary details for the order
        const totalAmount = calculateTotalAmount(cartItems);

        // Implement this function
        await cartItems.map((item) => {
          const { orderitemdata, ordererror } = supabase
            .from("order_items")
            .insert({ order_id: orderId, food_id: item.id, quantity: 1 });

          if (error) {
            throw error;
          }
        });

        // Insert order into Supabase
        const { data, error } = await supabase
          .from("orders")
          .insert(
            {
              order_id: orderId,
              waiter_id: customerId,
              total_amount: totalAmount,
              created_at: Date.now(),
              updated_at: null,
              status: active,
            },
          );

        // Push the order data to the state if insertion is successful
        state.orders.push(data);
      } catch (error) {
        console.error("Error generating order:", error);
        throw error;
      }
    },
  },
});
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => {
    return total + item.price; // Assuming each item has a "price" property
  }, 0);
};

export const { generateOrder } = orderSlice.actions;
export default orderSlice.reducer;
