-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT, -- Synced from auth.users for convenience
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    campus_id TEXT NOT NULL, -- "unilag", "unn", etc.
    role TEXT CHECK (role IN ('buyer', 'vendor', 'admin')) DEFAULT 'buyer',
    
    -- Gamification & Stats
    badges TEXT[] DEFAULT '{}',
    streak INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    
    -- Settings (Notifications, Theme, Language)
    preferences JSONB DEFAULT '{
        "notifications": {
            "push": true, 
            "email": true, 
            "whatsapp": false,
            "orderUpdates": true,
            "promotions": true,
            "priceDrops": false
        },
        "theme": "system",
        "language": "en"
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE public.addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT, -- "Home", "Work", "Hostel"
    label TEXT, -- "Moremi Hall, Room 234"
    full_address TEXT,
    phone TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAYMENT METHODS (Stored securely, mostly tokens)
CREATE TABLE public.payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT, -- "Mastercard", "Visa"
    last4 TEXT,
    expiry TEXT,
    card_holder TEXT,
    is_default BOOLEAN DEFAULT false,
    gradient TEXT, -- For UI styling "from-neutral-900..."
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VENDORS
CREATE TABLE public.vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Link to the owner
    business_name TEXT NOT NULL,
    description TEXT,
    campus_id TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    verification_docs TEXT[] DEFAULT '{}',
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Stats
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    response_rate INTEGER DEFAULT 0,
    response_time INTEGER DEFAULT 0, -- in minutes
    
    -- Business Settings (Hours, Delivery Zones)
    settings JSONB DEFAULT '{
        "isOpen": true,
        "autoAcceptOrders": true,
        "deliveryZones": [],
        "businessHours": []
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    campus_id TEXT NOT NULL,
    
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- "electronics", "food", etc.
    tags TEXT[] DEFAULT '{}',
    
    price NUMERIC NOT NULL,
    compare_at_price NUMERIC,
    
    images JSONB DEFAULT '[]'::jsonb, -- Array of {id, url, alt}
    
    stock INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    has_variants BOOLEAN DEFAULT false,
    
    status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    
    -- Stats
    views INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    attributes JSONB DEFAULT '{}'::jsonb, -- {"Processor": "Intel", "RAM": "8GB"}
    
    embedding vector(1536), -- For AI Semantic Search
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDERS
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL, -- "DBL-XYZ789"
    
    buyer_id UUID REFERENCES public.profiles(id),
    buyer_name TEXT,
    buyer_phone TEXT,
    
    vendor_id UUID REFERENCES public.vendors(id),
    vendor_name TEXT,
    campus_id TEXT,
    
    -- Order Details
    items JSONB NOT NULL, -- Array of order items snapshot
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    
    -- Logistics
    delivery_address JSONB, -- Snapshot of address
    delivery_slot JSONB, -- Validated slot object
    
    -- Payment
    payment_method TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    
    -- Status Workflow
    status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'ready', 'shipping', 'delivered', 'cancelled')) DEFAULT 'pending',
    status_history JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CHAT & MESSAGES
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT,
    
    -- Rich UI Types
    type TEXT CHECK (type IN ('text', 'products', 'product-detail', 'cart', 'order-confirmation')) DEFAULT 'text',
    
    -- Payloads for Rich UI
    metadata JSONB DEFAULT '{}'::jsonb, -- Stores 'products', 'product', 'order', 'quickActions'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Profiles: Public read, Owner write
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vendors: Public read, Owner write
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors are viewable by everyone" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Users can register as vendor" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can update own shop" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);

-- Products: Public read, Vendor write
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Vendors can insert products" ON public.products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can update products" ON public.products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- Orders: Buyer and Vendor can see their orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own orders" ON public.orders FOR SELECT USING (
    auth.uid() = buyer_id OR 
    EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Chat: Private to User
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own chats" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chats" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own messages" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER on_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER on_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
