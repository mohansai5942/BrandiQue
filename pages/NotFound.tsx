import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() { return <section className="max-w-5xl mx-auto px-6 pt-36 pb-20 min-h-[60vh]"><h1 className="text-4xl font-bold mb-6">Page not found</h1><p>The address may have changed, or this page may no longer exist.</p><p><Link to="/services">Explore our services</Link> or <Link to="/contact">contact BrandiQue Web Solutions</Link>.</p></section>; }
