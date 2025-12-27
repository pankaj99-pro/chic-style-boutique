import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const allowedOrigins = [
  "http://localhost:8080",
  "https://chic-style-boutique.vercel.app"
];

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-RAZORPAY-ORDER] ${step}${detailsStr}`);
};

interface CartItem {
  product: { id: string; name: string; price: number; image: string };
  quantity: number;
  size: string;
}

interface OrderRequest {
  items: CartItem[];
  customerEmail?: string;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
}

serve(async (req) => {
  // Compute CORS headers per request
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const keyId = Deno.env.get("TEST_RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("TEST_RAZORPAY_KEY_SECRET");



    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured");
    }
    logStep("Razorpay credentials verified");

    const { items, customerEmail, shippingInfo }: OrderRequest = await req.json();
    logStep("Request parsed", { itemCount: items?.length, hasEmail: !!customerEmail });

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Calculate total amount in paise
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const totalAmount = Math.round((subtotal + shippingCost + tax) * 100);

    logStep("Amount calculated", { subtotal, shippingCost, tax, totalAmount });

    // Create Razorpay order
    const auth = btoa(`${keyId}:${keySecret}`);
    const orderData = {
      amount: totalAmount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        customer_email: customerEmail || "",
        items: JSON.stringify(items.map(i => ({
          id: i.product.id,
          name: i.product.name,
          size: i.size,
          qty: i.quantity
        }))),
        shipping_name: shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : "",
        shipping_address: shippingInfo ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}` : "",
        shipping_phone: shippingInfo?.phone || ""
      }
    };

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      logStep("Razorpay API error", { status: response.status, error: errorData });
      throw new Error(`Failed to create Razorpay order: ${errorData}`);
    }

    const order = await response.json();
    logStep("Razorpay order created", { orderId: order.id, amount: order.amount });

    return new Response(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
