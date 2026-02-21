import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Heart, Users, Award, Truck } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Fashion',
      description: 'We are passionate about bringing the latest trends and timeless styles to every woman.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure a seamless shopping experience.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every piece in our collection is carefully curated and quality-checked for excellence.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We ensure quick and reliable delivery so you can enjoy your new outfits sooner.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Divya</title>
        <meta name="description" content="Learn about Divya, your trusted destination for premium women's fashion in Bokaro, Jharkhand." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-peach-light py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              About Divya
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted destination for premium women's fashion, bringing style and elegance to every wardrobe.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Founded with a vision to make premium fashion accessible to every woman, Divya has grown from a small boutique in Bokaro, Jharkhand to a beloved fashion destination. We believe that every woman deserves to feel confident and beautiful in what she wears.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our carefully curated collection features the latest trends in women's fashion, from elegant dresses and stylish tops to comfortable everyday wear. Each piece is selected with love and attention to detail, ensuring our customers receive only the best quality products.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 text-center shadow-soft hover:shadow-card transition-shadow duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Visit Us
            </h2>
            <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-soft">
              <p className="text-foreground font-medium mb-2">Divya Fashion Store</p>
              <p className="text-muted-foreground mb-4">
                Bodro Bhendra Bokaro Jharkhand 828401
              </p>
              <p className="text-muted-foreground mb-2">
                <span className="font-medium text-foreground">Phone:</span> 6205636164
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span> pankajsony@gmail.com
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
