import {store} from "@/lib/redux/store"
import { NextResponse } from "next/server";
import { generateOrder } from "@/lib/redux/slices/orderSlice";
import { selectCartItems } from "@/lib/redux/selectors/cardSelector";
import { supabase } from "@/supabase/supabase";
export async function POST(request, context) {
    const cartItems = selectCartItems(store.getState());
       // Dispatch action to generate order
       const { userData, error } = await supabase.auth.getSession();
       console.log(userData);
       await store.dispatch(generateOrder({ id:userData.user.id, cartItems }));
       NextResponse.status(200).json({ message: 'Order generated successfully' });
    
}