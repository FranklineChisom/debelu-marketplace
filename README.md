This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Debelu. Campus Marketplace
The operating system for campus commerce in Africa.

🌍 Vision
Not just a marketplace — a campus commerce ecosystem. Think WhatsApp meets Shopify meets ChatGPT, purpose-built for African students.

Year 1: Dominate Nigerian university campuses Year 2: Expand to Ghana, Kenya, South Africa Year 3: Become the default commerce layer for African higher education

🏗️ Architecture (Scalable from Day 1)
Monorepo Structure
debelu/
├── apps/
│   ├── web/                    # Next.js 16 (buyers + landing)
│   ├── vendor/                 # Next.js 16 (vendor dashboard)
│   ├── admin/                  # Internal admin panel
│   └── docs/                   # Documentation site
│
├── packages/
│   ├── ui/                     # Shared design system
│   │   ├── primitives/         # Button, Input, Card...
│   │   ├── composed/           # ProductCard, ChatBubble...
│   │   ├── layouts/            # PageLayout, ChatLayout...
│   │   └── tokens/             # Colors, typography, spacing
│   │
│   ├── chat-engine/            # Chat UI logic (state, rendering)
│   ├── cart/                   # Cart state management
│   ├── auth/                   # Auth utilities
│   ├── analytics/              # Event tracking
│   ├── i18n/                   # Internationalization (Pidgin, Yoruba, Hausa, Igbo)
│   ├── utils/                  # Shared utilities
│   └── types/                  # Shared TypeScript types
│
├── services/                   # API layer (future microservices)
│   ├── ai/                     # AI conversation engine
│   ├── search/                 # Search & recommendations
│   ├── payments/               # Payment processing
│   ├── notifications/          # Push, SMS, WhatsApp
│   └── media/                  # Image/video processing
│
├── supabase/                   # Database & auth
│   ├── migrations/
│   ├── functions/              # Edge functions
│   └── seed/
│
└── tooling/
    ├── eslint-config/
    ├── tsconfig/
    └── tailwind-config/
Tech Stack
Layer	Technology	Scale
Monorepo	Turborepo	Build caching, parallel execution
Web	Next.js 16	RSC, PPR, Edge Runtime
State	Zustand + React Query + Jotai	Local + server + atomic
Database	Supabase (Postgres)	RLS, Realtime, Edge
Auth	Supabase Auth + Phone OTP	Nigerian phone-first
Payments	Paystack + Flutterwave	Redundancy
AI	Groq / OpenAI	Fast inference
Search	Supabase FTS → Algolia	Start simple, scale later
CDN	Cloudflare R2	Cheap, fast, African PoPs
Analytics	PostHog	Self-hostable, GDPR
Monitoring	Sentry + Axiom	Errors + logs
🛍️ Complete Feature Set
🗣️ Buyer: AI Shopping Assistant
Core Chat

Natural language product search ("affordable gaming laptop")
Multi-turn conversations with context memory
Product comparisons ("compare these two")
Price negotiation assistance ("is this negotiable?")
Voice input/output (accessibility + convenience)
Image search ("I want something like this" + photo)
Barcode/QR scanning for quick lookup
Discovery

Personalized feed based on purchase history
"Trending on your campus" section
Flash deals with countdown timers
Recently viewed / Continue shopping
"Students also bought" recommendations
Category browsing as fallback
Wishlist with price drop alerts
Social Shopping

Share products to WhatsApp/IG Stories
Group buying ("3 more people needed for discount")
Reviews with photos/videos
Q&A on products (other buyers can answer)
Follow favorite vendors
Activity feed ("Chioma bought this")
Cart & Checkout

Persistent cart across devices
Save for later
Apply promo codes / student discounts
Multiple payment options (Cards, Bank Transfer, USSD, Pay on Delivery)
Split payment with friends
Scheduled delivery slots
Real-time delivery tracking
Order notes to vendor
Post-Purchase

Order status in chat (conversational updates)
Rate & review prompts
Easy reorder ("buy again")
Return/refund requests via chat
Dispute resolution system
🏪 Vendor: Commerce Operating System
Dashboard

Real-time sales ticker
Today/Week/Month/Custom analytics
Revenue, orders, views, conversion rate
Top products by revenue/views
Customer retention metrics
Inventory alerts
Payout schedule
Product Management

Bulk upload via CSV/Excel
AI-powered description generator
Automatic image optimization
Variant matrix (size × color × material)
Stock tracking with low-stock alerts
Price history & competitor insights
Product performance score
Draft/Published/Archived states
Duplicate & clone products
Seasonal scheduling (publish on date)
Order Management

Kanban board view (New → Processing → Ready → Delivered)
Batch actions (accept all, print labels)
Customer chat integration
Delivery partner assignment
Partial fulfillment support
Refund processing
Order notes & internal comments
Customer Relationship

Customer list with purchase history
Segment by spend / frequency
Broadcast messages (new arrivals, sales)
Loyalty program management
Review response system
VIP customer tags
Marketing Tools

Discount code generator
Flash sale creator
Bundle builder
"Boost" product (promoted in search)
Social media content generator
Performance by marketing channel
Finance

Earnings breakdown
Payout history
Tax reports (downloadable)
Expense tracking
Profit margin calculator
Payment method performance
Store Customization

Store banner & logo
About section with story
Business hours
Delivery zones & fees
Policies (returns, warranty)
Social links
🎮 Growth & Engagement
Gamification

Daily login streaks
Referral rewards (both parties)
Achievement badges ("First Purchase", "Review Master")
Leaderboards (top buyers, top vendors)
Seasonal challenges
Loyalty points → discounts
Campus Community

Campus-specific trending products
Student deals (verified .edu email)
Campus ambassador program
Event-based promotions (exam season, orientation)
Campus statistics ("50 students bought laptops this week")
Retention

Personalized push notifications
Abandoned cart reminders
Price drop alerts
Back-in-stock notifications
Weekly digest emails
Re-engagement campaigns
🔒 Trust & Safety
Buyer Protection

Verified vendor badges
Secure payment escrow
Dispute resolution center
24hr return window
Fraud detection
Vendor Verification

ID verification
Bank account verification
Address verification (optional)
Sales history visibility
Response rate & time display
Content Moderation

AI product review (prohibited items)
Report system
Review authenticity checks
Spam/scam detection
♿ Accessibility (AAA Target)
Full keyboard navigation
Screen reader optimized (ARIA)
Voice control ready
High contrast mode
Reduced motion mode
Text scaling support
RTL ready (for expansion)
Offline mode (cached products)
Low-bandwidth mode (text-first)
🌐 Internationalization
Launch (Nigeria)

English (default)
Pidgin English
Yoruba, Hausa, Igbo (Phase 2)
Expansion

Twi (Ghana)
Swahili (Kenya)
Zulu (South Africa)
📱 Screen Inventory
Buyer App (15+ screens)
Onboarding:     Splash, Login, Register, OTP, Campus Select, Profile Setup
Core:           Chat (main), Product Detail, Cart, Checkout, Order Tracking
Browse:         Categories, Search Results, Trending, Deals
Account:        Profile, Orders, Wishlist, Addresses, Payment Methods, Settings
Social:         Reviews, Q&A, Share, Group Buy
Support:        Help, Dispute, Contact
Vendor App (12+ screens)
Onboarding:     Splash, Register, Verification, Bank Details, Pending Approval
Core:           Dashboard, Orders (list + detail), Products (list + form)
Analytics:      Overview, Product Performance, Customer Insights
Settings:       Store, Delivery, Payments, Notifications, Team
Finance:        Earnings, Payouts, Reports
Shared
Landing page, About, Help Center, Terms, Privacy
🎨 Design System (Expanded)
Component Library (50+ components)
Primitives:     Button, Input, Textarea, Select, Checkbox, Radio, Switch,
                Slider, Badge, Avatar, Skeleton, Spinner, Divider
                
Feedback:       Toast, Alert, Modal, Drawer, Popover, Tooltip, Progress
                
Navigation:     Tabs, BottomNav, Sidebar, Breadcrumb, Pagination, Stepper
Data:           Table, List, Card, Grid, Carousel, Timeline, Stats
Chat:           ChatContainer, MessageBubble, TypingIndicator, QuickActions,
                ProductCardChat, CartSummary, CheckoutStep
                
Commerce:       ProductCard, ProductGallery, PriceDisplay, RatingStars,
                ReviewCard, QuantitySelector, VariantPicker, CouponInput
Forms:          FormField, ImageUpload, DatePicker, TimePicker, AddressPicker,
                PhoneInput, OTPInput, SearchInput
Motion Library
Entrances:      fadeIn, slideUp, slideRight, scaleIn, popIn
Exits:          fadeOut, slideDown, slideLeft, scaleOut
Interactions:   press, hover, focus, drag
Feedback:       success (confetti), error (shake), loading (pulse)
Page:           pageEnter, pageExit, sharedElement
📊 Analytics Events
Buyer

session_start, session_end
search_query, search_result_click
product_view, product_share
add_to_cart, remove_from_cart
checkout_start, checkout_complete
payment_method_select, payment_success, payment_fail
review_submit, question_ask
Vendor

product_create, product_edit, product_delete
order_accept, order_reject, order_fulfill
customer_message_send
payout_request
🚀 Implementation Phases
Phase 1: Foundation (2 weeks)
Monorepo setup (Turborepo)
Design system package (tokens, primitives)
Auth flow (phone OTP)
Database schema + RLS policies
Phase 2: Buyer Core (3 weeks)
Chat interface (full implementation)
Product cards, detail, gallery
Cart & checkout flow
Order tracking
Phase 3: Vendor Core (3 weeks)
Dashboard with analytics
Product CRUD (full form)
Order management
Customer chat
Phase 4: Social & Growth (2 weeks)
Reviews & ratings
Referral system
Wishlist & alerts
Push notifications
Phase 5: Polish (2 weeks)
Landing page
Accessibility audit
Performance optimization
Animation polish
Testing
✅ Quality Gates
Gate	Requirement
Build	Zero TypeScript errors, ESLint clean
Performance	LCP < 2.5s, FID < 100ms, CLS < 0.1
Accessibility	WCAG 2.1 AA minimum
Mobile	60 FPS on mid-range Android
Offline	Core browse works offline
Bundle	< 150kb initial JS