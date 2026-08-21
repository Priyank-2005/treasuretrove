# Treasure Trove — Project Blueprint

> **Single Source of Truth** — Read this document before every development session.

## 1. Project Overview

**Business**: Treasure Trove by Gurasim — anti-tarnish, water-resistant, skin-friendly jewelry brand.
**Target**: Indian women 18-35 seeking affordable everyday luxury jewelry.
**Price Range**: ₹499–₹1,999
**USP**: Anti-tarnish, water-resistant, hypoallergenic.

### User Journeys
- Browse → Shop by Category → Product Detail → Add to Cart → Checkout → Pay → Order Confirmation
- Register (email + password + OTP verification) → Login → Account Dashboard → Order History
- Admin Login → Dashboard → Manage Products/Orders/Coupons/Campaigns

## 2. Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.3.0 | Full-stack framework (App Router) |
| React | 19.2.8 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | v4 | Styling (`@theme` directive) |
| Framer Motion | ^13.1.0 | Animations |
| Lucide React | ^1.31.0 | Icons |
| Prisma | TBD | ORM |
| PostgreSQL | Local | Database (Neon in production) |
| Razorpay | Test Mode | Payments |
| Recharts | ^3.10.1 | Admin charts |
| PapaParse | ^5.5.4 | CSV import |
| clsx + tailwind-merge | Latest | Utility classes |
| Fonts | Cormorant Garamond + Inter | Typography |

## 3. Architecture

### Local Development
```
Next.js (dev server)
├── Storefront (route group: (store))
├── Customer Account
├── Admin Panel
├── Server Actions / Route Handlers
└── Webhooks

PostgreSQL (local)
pgAdmin (database management)
```

### Production (Future)
```
Vercel → Next.js
Neon → PostgreSQL
Cloudinary → Images/Media
Razorpay → Payments
OTP Provider → Registration verification, Password reset
Email Provider → Transactional emails
```

## 4. Route Inventory

### Customer Storefront
| Route | Status | Description |
|---|---|---|
| `/` | ✅ Complete | Homepage |
| `/shop` | ✅ Complete | Product catalog with filters |
| `/shop/[category]` | ✅ Complete | Category-filtered shop |
| `/product/[slug]` | ✅ Complete | Product detail |
| `/cart` | ✅ Complete | Shopping cart |
| `/checkout` | ✅ Complete (mock) | Checkout |
| `/order-success` | ✅ Complete | Order confirmation |
| `/wishlist` | ✅ Complete | Wishlist |
| `/about` | ✅ Complete | Brand story |
| `/care` | ✅ Complete | Jewelry care |
| `/contact` | ✅ Complete | Contact form |
| `/faq` | ✅ Complete | FAQ |
| `/shipping-returns` | ✅ Complete | Policies |
| `/login` | ✅ Complete | Customer login (email+password, OTP registration/reset) |
| `/account` | ✅ Complete | Account dashboard |
| `/account/orders` | ✅ Complete | Order history with filters |
| `/account/orders/[id]` | ✅ Complete | Order detail with timeline |
| `/account/addresses` | ✅ Complete | Address CRUD management |
| `/account/profile` | ✅ Complete | Profile editing + password change |

### Admin Panel
| Route | Status | Description |
|---|---|---|
| `/admin` | ✅ Complete (mock) | Dashboard |
| `/admin/login` | ✅ Complete (mock) | Admin login |
| `/admin/products` | ✅ Complete (mock) | Product list |
| `/admin/products/[id]` | ✅ Complete (mock) | Edit product |
| `/admin/products/new` | ✅ Complete (mock) | Create product |
| `/admin/products/import` | ✅ Complete (mock) | CSV import |
| `/admin/orders` | ✅ Complete (mock) | Order list |
| `/admin/orders/[id]` | ✅ Complete (mock) | Order detail |
| `/admin/customers` | ✅ Complete (mock) | Customer list |
| `/admin/customers/[id]` | ✅ Complete (mock) | Customer detail |
| `/admin/coupons` | ✅ Complete (mock) | Coupon management |
| `/admin/campaigns` | ✅ Complete (mock) | Campaign management |
| `/admin/settings` | ✅ Complete (mock) | Store settings |

## 5. Component Inventory

| Directory | Components |
|---|---|---|
| `components/` | Providers |
| `components/admin/` | AdminHeader, AdminSidebar, ProductForm, SalesChart, StatCard, StatusBadge |
| `components/home/` | HeroSection, CategoryShowcase, TrustSection |
| `components/layout/` | AnnouncementBar, CartDrawer, Footer, Navbar, SearchOverlay |
| `components/product/` | ProductClient |
| `components/shop/` | ProductFilters, SortDropdown |
| `components/ui/` | Accordion, Breadcrumb, CategoryCard, Newsletter, ProductCard, ProductGrid, QuantitySelector, ReviewCard, TrustBadge |

## 6. Context/State Architecture

| Context | Purpose | Storage | Status |
|---|---|---|---|
| AuthContext | User authentication | localStorage (mock) → server sessions | ✅ Complete (mock) |
| CartContext | Shopping cart | localStorage | ✅ Complete |
| WishlistContext | Product wishlist | localStorage | ✅ Complete |
| ToastContext | Toast notifications | In-memory | ✅ Complete |
| AdminContext | Admin panel state | localStorage | ✅ Complete (mock) |

## 7. Database Schema

See `prisma/schema.prisma` (Phase 2).

Models: User, Address, Category, Product, ProductImage, Order, OrderItem, Payment, Coupon, CouponUsage, WishlistItem, Campaign.

Key decisions:
- Inventory embedded in Product (single `stock` field)
- Orders store address/price snapshots (not FKs)
- Prices stored as rupees (integers)
- Single User model with Role enum (CUSTOMER/ADMIN)

## 8. Authentication Architecture

**Method**: Email + password
**OTP Usage**: Registration email verification + password reset only
**Sessions**: Server-side secure cookies (Phase 4)
**Mock**: localStorage-based (Phase 1)

Flow:
```
Registration: Email + Password → OTP sent to email → Verify → Account created
Login: Email + Password → Session cookie → Authenticated
Password Reset: Email → OTP → New password → Updated
```

## 9. Payment Architecture

Provider: Razorpay (Test Mode for local dev)

```
Checkout → Server validates cart → Create Razorpay order → Customer pays → Webhook verifies → Order confirmed → Inventory updated
```

Supported methods: UPI, Card, COD

Critical: Never trust client-side payment success. Webhook is authoritative.

## 10. Media/Storage Architecture

Current: Local images in `/public/images/`
Future: Cloudinary (URLs stored in PostgreSQL)

Keep local images working until Cloudinary is connected.

## 11. Security Requirements

- Server-side authorization on all API routes
- Secure session cookies (httpOnly, sameSite, secure)
- Input validation (server-side)
- Database constraints (unique, not null, foreign keys)
- Rate limiting on auth endpoints
- Razorpay webhook signature verification
- File upload validation (type, size)
- Environment variables for all secrets
- No secrets in source code
- No sensitive data in localStorage

## 12. V1 vs V2 Scope

### V1 (Current Build)
- Complete storefront
- Email + password auth with OTP verification
- Product catalog from database
- Cart and checkout
- Razorpay test payments + COD
- Order management
- Coupon system
- Customer accounts
- Admin panel connected to database
- Bulk product import

### V2 (Future)
- Product variants (ring sizes)
- Shipping provider integration
- GST invoicing
- WhatsApp notifications
- Analytics dashboard
- AI recommendations
- Multi-language support

## 13. Implementation Roadmap

```
Phase 0:  Documentation (PROJECT_BLUEPRINT.md)
Phase 1:  Complete frontend (6 missing pages + AuthContext)
Phase 2:  Local PostgreSQL + Prisma setup
Phase 3:  Data access layer
Phase 4:  Server-side authentication
Phase 5:  Products backend
Phase 6:  Cart, checkout, coupons
Phase 7:  Razorpay test mode
Phase 8:  Orders backend
Phase 9:  Wishlist, addresses, profile backend
Phase 10: Admin integration
Phase 11: Full local testing
Phase 12: Production preparation (NOT deployment)
```

## 14. Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2024-08-22 | Email + password auth (OTP for registration/reset only) | Client requirement |
| 2024-08-22 | Prices stored as rupees (not paise) | Match existing frontend, avoid refactor |
| 2024-08-22 | No product variants for V1 | Client confirmation |
| 2024-08-22 | No GST invoicing for V1 | Client deferral |
| 2024-08-22 | COD confirmed for launch | Client requirement |
| 2024-08-22 | No shipping provider integration | Handled offline by client |
| 2024-08-22 | No /offers page | Client decision |
| 2024-08-22 | Inventory embedded in Product model | ~200 products, no warehouse complexity |
| 2024-08-22 | Order snapshots (not FKs) for addresses/prices | Historical accuracy |

## 15. Change Log

| Date | Phase | Changes | Impact |
|---|---|---|---|
| 2024-08-22 | 0 | Created PROJECT_BLUEPRINT.md, .env.example | Foundation document |
| 2024-08-22 | 1 | Built 6 customer pages + AuthContext + Navbar auth | Full customer frontend complete |
| 2024-08-22 | 2 | PostgreSQL setup, Prisma schema, migration, seed script | Database initialized with mock data |

## 16. Implementation Status

### Frontend
- [x] Homepage
- [x] Shop page
- [x] Category pages
- [x] Product detail
- [x] Cart
- [x] Checkout (mock)
- [x] Order success
- [x] Wishlist
- [x] About
- [x] Care
- [x] Contact
- [x] FAQ
- [x] Shipping & returns
- [x] Login page
- [x] Account dashboard
- [x] Order history
- [x] Order detail
- [x] Address management
- [x] Profile editing

### Backend
- [x] PostgreSQL setup
- [x] Prisma schema + migrations
- [x] Seed data
- [ ] Data access layer
- [ ] Authentication (server-side)
- [ ] Products API
- [ ] Inventory management
- [ ] Cart validation API
- [ ] Coupon validation API
- [ ] Order creation API
- [ ] Razorpay integration
- [ ] Webhook handlers
- [ ] Admin APIs
- [ ] Bulk import API

### Testing
- [ ] Frontend pages
- [ ] Database CRUD
- [ ] Authentication flow
- [ ] Product management
- [ ] Commerce flow
- [ ] Payment flow
- [ ] Admin panel

### Production
- [ ] Neon PostgreSQL
- [ ] Vercel deployment
- [ ] Cloudinary
- [ ] Razorpay live
- [ ] OTP provider
- [ ] Email provider
- [ ] Domain setup

## 17. Service Ownership

All production accounts belong to the client:
- Domain, Vercel, Neon, Razorpay, Cloudinary, OTP provider, Email provider, Source repository

Developer receives appropriate technical access.

## 18. Open Questions

| # | Question | Status |
|---|---|---|
| 1 | Return/refund policy details | Client to provide later |
| 2 | Session library (iron-session vs jose) | To discuss |
| 3 | OTP provider for production | TBD |
| 4 | Email provider for production | TBD |
| 5 | Legal documents (T&C, Privacy) | Client to provide later |
