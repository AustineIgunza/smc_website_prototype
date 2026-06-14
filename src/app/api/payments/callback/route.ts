import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ResponseCode: "1", ResponseDesc: "Invalid JSON" }, { status: 400 });
  }

  console.log("M-Pesa payment callback received:", JSON.stringify(body, null, 2));

  const callbackData = body?.Body?.stkCallback;
  if (!callbackData) {
    return Response.json({ ResponseCode: "1", ResponseDesc: "Missing callback data" }, { status: 400 });
  }

  const checkoutRequestId = callbackData.CheckoutRequestID;
  const resultCode = callbackData.ResultCode;
  const resultDesc = callbackData.ResultDesc;

  const db = supabase();

  // Find the payment record
  const { data: payment } = await db
    .from("Payment")
    .select("*, event:Event(commissionRate)")
    .eq("checkoutRequestId", checkoutRequestId)
    .maybeSingle();

  if (!payment) {
    console.error(`Payment not found for CheckoutRequestID: ${checkoutRequestId}`);
    return Response.json({ ResponseCode: "1", ResponseDesc: "Payment not found" }, { status: 200 }); // Safaricom expects 200/ack
  }

  if (resultCode === 0) {
    // Payment was successful
    let receiptNumber = "";
    let amount = payment.amountKes;
    let phone = payment.phone;

    const metadataItems = callbackData.CallbackMetadata?.Item || [];
    for (const item of metadataItems) {
      if (item.Name === "MpesaReceiptNumber") receiptNumber = item.Value;
      if (item.Name === "Amount") amount = Math.round(item.Value);
      if (item.Name === "PhoneNumber") phone = String(item.Value);
    }

    // Calculate commission and partner share
    const commissionRate = (payment.event as any)?.commissionRate ?? 0.15;
    const commissionKes = Math.round(amount * commissionRate);
    const partnerShareKes = amount - commissionKes;

    // Update payment to SUCCESS
    const { error: payError } = await db
      .from("Payment")
      .update({
        status: "SUCCESS",
        mpesaReceiptNumber: receiptNumber,
        amountKes: amount,
        phone,
        commissionKes,
        partnerShareKes,
        rawCallback: body,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (payError) console.error("Error updating payment status to SUCCESS:", payError);

    // Update registration to CONFIRMED
    const { error: regError } = await db
      .from("Registration")
      .update({
        status: "CONFIRMED",
      })
      .eq("id", payment.registrationId);

    if (regError) console.error("Error updating registration status to CONFIRMED:", regError);

    console.log(`Payment confirmed successfully. Registration: ${payment.registrationId}, Receipt: ${receiptNumber}`);
  } else {
    // Payment failed or was cancelled by user
    const { error: payError } = await db
      .from("Payment")
      .update({
        status: "FAILED",
        rawCallback: body,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (payError) console.error("Error updating payment status to FAILED:", payError);

    // Update registration to CANCELLED
    const { error: regError } = await db
      .from("Registration")
      .update({
        status: "CANCELLED",
      })
      .eq("id", payment.registrationId);

    if (regError) console.error("Error updating registration status to CANCELLED:", regError);

    console.log(`Payment failed. CheckoutRequestID: ${checkoutRequestId}, Reason: ${resultDesc}`);
  }

  return Response.json({
    ResponseCode: "0",
    ResponseDesc: "Accept Service Request Successfully",
  });
}
