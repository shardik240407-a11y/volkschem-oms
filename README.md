# Volkschem Crop Science - Order Management System (OMS)

## Overview
Volkschem OMS is a full-stack, role-based order and quotation management platform built for Volkschem Crop Science. The system handles the entire lifecycle of a product order, starting from a multi-step dynamic quotation wizard, extending through approval pipelines, manufacturing tracking, PDF document generation, and final dispatch.

## Core Architecture
- **Frontend**: React (Vite), TailwindCSS, React Router, Lucide Icons, Context API
- **Backend**: Node.js, Express, Multer
- **Database**: Supabase (PostgreSQL), Supabase Storage Buckets
- **PDF Engine**: PDFKit (Node.js microservice approach)

## Key Features
1. **Multi-Role Authentication**: Secure login system with distinct portals for:
   - **Admin**: Full overview, revenue dashboards, product/staff management, quotation approval.
   - **Employee/Sales**: Order creation, status tracking, bulk material search.
   - **Factory Admin**: Production tracking, progress updates, Dispatch and LR (Lorry Receipt) management.
2. **Dynamic Quotation Wizard**:
   - Multi-step React wizard for capturing customer details, selecting products, choosing packaging sizes (ml, Ltr, gm, Kg, drums), adding transport details, and auto-calculating GST.
   - Includes a dedicated bulk material module where custom prices can be negotiated.
3. **Automated PDF Generation**:
   - Generates fully-branded, professional Customer Quotation PDFs (with or without 'DRAFT' watermarks) and internal Factory Order PDFs.
   - Uploads PDFs automatically to Supabase Storage and attaches secure links to the database.
4. **Order Pipeline**:
   - Visual step-by-step pipeline tracking: `Pending` -> `Approved` -> `Confirmed` -> `In Production` -> `Packing` -> `Ready to Dispatch` -> `Dispatched`.
   - Admin revenue dashboards update automatically based on real-time pipeline status.

## Running Locally

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Design Philosophy
The system follows a highly modular, utility-first design approach using TailwindCSS. Components are reusable, decoupled, and maintain a modern, clean, and professional "Glassmorphism" aesthetic with vibrant primary colors and distinct typography.
