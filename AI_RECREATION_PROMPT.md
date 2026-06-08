# Volkschem OMS - AI Recreation Mega-Prompt

Copy and paste the following prompt to an AI coding assistant to perfectly recreate the Volkschem OMS project from scratch:

---

**Act as an expert Full-Stack Software Engineer. I want you to build "Volkschem OMS", a comprehensive, role-based Order Management System for an agricultural chemical company (Volkschem Crop Science).**

## 1. Architecture & Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router DOM, React Hot Toast, Lucide React (for icons). Use a modern "Glassmorphism" UI design with vibrant greens (primary), teals (secondary), and dark grays.
- **Backend**: Node.js, Express, Multer (for file uploads).
- **Database & Auth**: Supabase (PostgreSQL). Use Supabase Auth for Role-Based Access Control (RBAC). Use Supabase Storage Buckets (`pdfs` and `attachments`).
- **PDF Engine**: PDFKit (Node.js microservice approach).

---

## 2. Directory Structure

### Frontend Structure (`/frontend`)
```
src/
├── components/
│   └── common/           # Reusable UI: Badge, Button, Input, Modal, Navbar, Sidebar, Table, Loader
├── context/
│   ├── AuthContext.jsx   # Manages Supabase session and user roles
│   └── QuotationContext.jsx # State management for the multi-step Quotation Wizard
├── pages/
│   ├── admin/            # AdminDashboard, ProductMaster, StaffManagement, AdminOrdersView, QuotationManagement, BulkPriceSection
│   ├── employee/         # MyOrders, BulkPriceSearch
│   ├── factory/          # FactoryOrdersList, DispatchManager, LRUpload
│   └── Login.jsx
├── portals/              # Layout wrappers: AdminPortal, EmployeePortal, FactoryPortal
├── quotation/            # Wizard Steps: ProductQuotationWizard, CustomerInfoStep, ProductSelectionStep, SummaryStep, etc.
├── routes/               # AppRoutes.jsx (RBAC protected routes), ProtectedRoute.jsx
├── services/             # dataService.js (Axios API calls), authService.js
└── utils/                # constants.js, formatters.js
```

### Backend Structure (`/backend`)
```
src/
├── config/               # db.js (Supabase client init), multer.js
├── controllers/          # adminController.js, authController.js, orderController.js, quotationController.js, productController.js
├── middlewares/          # authMiddleware.js (verify roles), errorMiddleware.js
├── routes/               # adminRoutes.js, authRoutes.js, orderRoutes.js, quotationRoutes.js, productRoutes.js
├── services/             # Core logic: adminService.js, orderService.js, quotationService.js, pdfService.js (PDFKit logic)
└── server.js             # Express app entry point
```

---

## 3. Database Schema (PostgreSQL via Supabase)
Please generate and run migrations for the following schema:
- `users`: `id` (UUID, references auth.users), `username`, `role` (admin/employee/factory_admin), `is_active`.
- `products`: `id`, `product_name`, `technical_name`, `category`, `price_per_unit`.
- `bulk_prices`: `id`, `product_id`, `min_qty`, `price`, `valid_until`.
- `quotations`: `id`, `quotation_number` (VCS-YYYY-XXXX), `created_by` (UUID), `customer_name`, `employee_name`, `billing_name`, `status` (pending/approved/rejected), `grand_total`, `destination`, `transport_name`, `order_type`, `pdf_url`, `draft_pdf_url`.
- `quotation_rows`: `id`, `quotation_id`, `product_id`, `pack_size_value`, `pack_size_unit` (ml/Ltr/gm/Kg), `total_pcs`, `total_cases`, `total_ltr_kg`, `rate`.
- `orders`: `id`, `quotation_id`, `current_status` (confirmed, in_production, packing, ready_to_dispatch, dispatched), `dispatch_note`.
- `lr_attachments`: `id`, `order_id`, `file_url`, `uploaded_at`.

---

## 4. Key Workflows

### Workflow A: Quotation Lifecycle
1. **Creation**: An `employee` uses the multi-step Quotation Wizard. They input customer details, select products, and specify packaging sizes. The system auto-calculates total pieces, total volume, and GST.
2. **Submission**: Upon submission, the quotation is saved as `pending`. The backend immediately generates a `DRAFT` PDF with a watermark and saves it to the Supabase `pdfs` bucket.
3. **Approval**: An `admin` reviews the quotation in their portal. If they click "Approve":
   - The status changes to `approved`.
   - The backend regenerates a clean, watermark-free PDF.
   - An `orders` record is automatically created with the status `confirmed`.

### Workflow B: Production & Dispatch Lifecycle
1. **Production**: The `factory_admin` logs in and sees all active orders in the "Confirmed Production Orders" tab.
2. **Progress Tracking**: The factory admin updates the order status: `in_production` -> `packing` -> `ready_to_dispatch`.
3. **Dispatch**: In the "Dispatch Management" tab, the factory admin marks the order as `dispatched`. They use a drag-and-drop modal to upload the Lorry Receipt (LR) document.
4. **LR Visibility**: Once uploaded, the LR document URL is saved to `lr_attachments`. The admin and the employee who created the order can now see a "Download LR" button in their respective portals.

---

## 5. Role-Specific Features

### Admin Portal (`/admin`)
- **Dashboard**: Displays high-level metrics ("Total Orders Today", "Pending Approvals", "Revenue This Month") and a visual pipeline showing counts of orders in each stage (Confirmed -> In Production -> Packing -> Dispatched).
- **Quotation Management**: View, approve, or reject pending quotations.
- **Product & Bulk Price Master**: Add/Edit/Delete products and manage custom bulk pricing thresholds.
- **Staff Management**: Create user accounts and assign roles.

### Employee Portal (`/employee`)
- **My Orders**: The default landing page. Shows only the orders created by the logged-in employee. Includes a progress tracker and an LR download button if dispatched.
- **Quotation Wizard**: Step-by-step form with Context API state retention to prevent data loss on accidental reloads.

### Factory Portal (`/factory`)
- **Order List**: A Kanban or filtered list view of orders. "Dispatched" orders are filtered out of the main production view to reduce clutter.
- **Dispatch Manager**: A dedicated view for handling `ready_to_dispatch` and `dispatched` orders, complete with Multer-powered file uploads for LRs.

---

## 6. PDF Generation Service
Implement a dedicated `pdfService.js` using `pdfkit`. The PDFs must contain:
- A company header with placeholders for the Volkschem logo and contact info.
- Customer billing details on the left, and Quotation meta-data on the right.
- A dynamically drawn data table showing: Product, Pack Size, Quantity, Rate, and Amount.
- Bottom summaries for Subtotal, CGST (9%), SGST (9%), and Grand Total.
- The service must accept a `isDraft` boolean. If true, draw a large diagonal "DRAFT" watermark across the center of the pages.

## 7. Design & UI Rules
- Do NOT use generic red, green, or blue colors. Use modern Tailwind color palettes (e.g., `emerald-600` for primary actions, `slate-800` for dark mode texts, `zinc-50` for backgrounds).
- All tables must look clean with plenty of padding, light gray borders, and hover effects on rows.
- Use `lucide-react` icons extensively for visual hierarchy.
- Ensure all Modals have semi-transparent backdrops and smooth fade-in animations.

**Begin by initializing the Vite frontend, setting up TailwindCSS, and writing the Supabase SQL schema.**
