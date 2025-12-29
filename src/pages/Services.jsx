import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Truck, RotateCcw, CreditCard, Headphones, Gift, Shield } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We offer quick and reliable delivery across India. Track your orders in real-time and get your fashion favorites delivered right to your doorstep.',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Not satisfied with your purchase? No worries! We offer hassle-free returns within 7 days of delivery. Your satisfaction is our priority.',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Shop with confidence using our secure payment options including UPI, credit/debit cards, net banking, and cash on delivery.',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Our dedicated support team is here to help you with any queries. Reach out to us via phone or email for assistance.',
    },
    {
      icon: Gift,
      title: 'Gift Wrapping',
      description: 'Make your gifts extra special with our beautiful gift wrapping service. Perfect for birthdays, anniversaries, and special occasions.',
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Every product in our store is quality-checked to ensure you receive only the best. We stand behind the quality of our products.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Divya</title>
        <meta name="description" content="Discover the services offered by Divya including fast delivery, easy returns, secure payments, and more." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-peach-light py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience. Explore our range of services designed with you in mind.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 mb-6 bg-primary/10 rounded-xl flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Need Assistance?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our customer support team is available to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:6205636164"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Headphones className="w-5 h-5" />
                Call Us: 6205636164
              </a>
              <a
                href="mailto:pankajsony@gmail.com"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
