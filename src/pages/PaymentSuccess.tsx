import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, Truck, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { supabase } from '../integrations/supabase/client';

interface OrderDetails {
  orderId: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  amountTotal: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (fnError) throw fnError;
        
        if (data.paymentStatus === 'paid') {
          setOrderDetails(data);
        } else {
          setError('Payment was not completed');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Verifying Payment - Sign Fashion</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your payment...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !orderDetails) {
    return (
      <>
        <Helmet>
          <title>Payment Error - Sign Fashion</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || 'Something went wrong with your payment.'}
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Sign Fashion</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Thank You for Your Order!
            </h1>
            
            <p className="text-muted-foreground mb-2">
              Order #{orderDetails.orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-muted-foreground mb-8">
              Confirmation sent to <strong>{orderDetails.customerEmail}</strong>
            </p>

            {/* Order Summary */}
            <div className="bg-card rounded-2xl p-6 shadow-card mb-8 text-left">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-6">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-foreground font-medium">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid</span>
                  <span className="text-primary">
                    ${orderDetails.amountTotal.toFixed(2)} {orderDetails.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {orderDetails.shippingAddress && (
              <div className="bg-card rounded-2xl p-6 shadow-card mb-8 text-left">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Shipping Details
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{orderDetails.customerName}</p>
                  <p>{orderDetails.shippingAddress.line1}</p>
                  <p>
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postal_code}
                  </p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Estimated delivery: 5-7 business days
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary">
                Continue Shopping
              </Link>
              <Link to="/" className="px-6 py-3 rounded-full border border-border text-foreground hover:border-primary transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}