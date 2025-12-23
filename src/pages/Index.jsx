import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import PopularCollection from '../components/home/PopularCollection';
import FlashSaleSection from '../components/home/FlashSaleSection';
import BlogSection from '../components/home/BlogSection';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Sign Fashion - Premium Women's Summer Collection</title>
        <meta name="description" content="Discover our exclusive summer collection of women's fashion. Shop trendy dresses, tops, skirts and more at Sign Fashion." />
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <CategoriesSection />
        <PopularCollection />
        <FlashSaleSection />
        <BlogSection />
      </main>

      <Footer />
    </>
  );
}
