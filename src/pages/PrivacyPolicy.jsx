import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Divya</title>
        <meta name="description" content="Read Divya's privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-peach-light py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Privacy Policy
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
                  Introduction
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  At Divya, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>Name and contact information (email address, phone number, shipping address)</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and provide customer support</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Information Sharing
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as they agree to keep this information confidential.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Data Security
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Your Rights
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us at pankajsony@gmail.com.
                </p>

                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
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
