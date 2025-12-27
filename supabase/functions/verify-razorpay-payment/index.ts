import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:8080",
  "https://chic-style-boutique.vercel.app"
];

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-RAZORPAY-PAYMENT] ${step}${detailsStr}`);
};

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

serve(async (req) => {
  try {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    logStep("Function started");

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyRequest = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification parameters");
    }

    logStep("Verifying payment", { orderId: razorpay_order_id, paymentId: razorpay_payment_id });

    // Generate signature for verification using Web Crypto API
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keySecret);
    const bodyData = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, bodyData);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    logStep("Signature comparison", { 
      expected: expectedSignature.substring(0, 20) + "...", 
      received: razorpay_signature.substring(0, 20) + "..." 
    });

    if (expectedSignature !== razorpay_signature) {
      logStep("Signature mismatch - payment verification failed");
      return new Response(JSON.stringify({ 
        verified: false, 
        error: "Payment signature verification failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Payment verified successfully");

    return new Response(JSON.stringify({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage, verified: false }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
