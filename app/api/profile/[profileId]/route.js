import { NextResponse } from "next/server";
import { supabase } from "../../../../supabase/supabase";
export async function POST(request, context) {
  const data = await request.json();
  const { params } = context;
  const { profileId } = params;
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", profileId)
      .select();
    if (error) console.log("error in updating profiles", error);
    return NextResponse.json({
      profile: profile[0],
      message: "updated profile data successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.error({
      message: error.message,
      error,
      success: false,
    });
  }
}
