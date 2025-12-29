import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Divya</title>
        <meta name="description" content="Read the terms and conditions for using Divya's website and services." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-peach-light py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-soft">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  By accessing and using the Divya website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  2. Products and Pricing
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  All products displayed on our website are subject to availability. Prices are listed in Indian Rupees (INR) and are subject to change without prior notice. We reserve the right to modify or discontinue any product without notice.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  3. Orders and Payment
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  When you place an order, you agree to provide accurate and complete information. We reserve the right to refuse or cancel any order for reasons including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>Product unavailability</li>
                  <li>Errors in product or pricing information</li>
                  <li>Suspected fraudulent activity</li>
                  <li>Issues with payment verification</li>
                </ul>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  4. Shipping and Delivery
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We aim to deliver your orders within the estimated timeframe. However, delivery times may vary based on location and other factors. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  5. Returns and Refunds
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We accept returns within 7 days of delivery for products that are unused, unwashed, and in their original packaging with tags attached. Refunds will be processed within 5-7 business days after we receive and inspect the returned item.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  6. Intellectual Property
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Divya and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use any content without our prior written consent.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Divya shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid by you for the specific product in question.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  8. Changes to Terms
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We reserve the right to update these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  9. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="mt-4 p-4 bg-secondary/30 rounded-xl">
                  <p className="text-foreground font-medium">Divya</p>
                  <p className="text-muted-foreground">Bodro Bhendra Bokaro Jharkhand 828401</p>
                  <p className="text-muted-foreground">Phone: 6205636164</p>
                  <p className="text-muted-foreground">Email: pankajsony@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
