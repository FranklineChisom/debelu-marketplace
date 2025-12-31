"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMarketplaceStore } from '@/stores/useMarketplaceStore';
import { useCartStore } from '@/stores';

export default function PaystackCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');

    // Get store actions
    const updateOrderPaymentStatus = useMarketplaceStore((state) => state.updateOrderPaymentStatus);
    const getOrderById = useMarketplaceStore((state) => state.getOrderById);
    const clearCart = useCartStore((state) => state.clearCart);

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Verifying payment...');
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        async function verifyAndFinalizePayment() {
            if (!reference) {
                setStatus('failed');
                setMessage('No payment reference found.');
                return;
            }

            try {
                // Verify payment with Paystack
                const response = await fetch(`/api/paystack/verify?reference=${reference}`);
                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    // Payment verified - get orderId from localStorage
                    const orderId = localStorage.getItem('pendingOrderId');

                    if (!orderId) {
                        // Fallback: use reference as orderId (they should be the same)
                        console.warn('pendingOrderId not found in localStorage, using reference');
                    }

                    const targetOrderId = orderId || reference;

                    try {
                        // Update order payment status in database
                        await updateOrderPaymentStatus(targetOrderId, 'paid');

                        // Fetch order to get order number for display
                        const order = await getOrderById(targetOrderId);

                        // Clear localStorage
                        localStorage.removeItem('pendingOrderId');

                        // Cart should already be cleared, but just in case
                        clearCart();

                        setOrderNumber(order?.orderNumber || targetOrderId);
                        setStatus('success');
                        setMessage('Payment successful! Your order is being processed.');

                        // Redirect to orders page after a delay
                        setTimeout(() => {
                            router.push('/orders');
                        }, 3000);
                    } catch (orderError) {
                        console.error('Failed to update order status:', orderError);
                        setStatus('failed');
                        setMessage('Payment successful but failed to update order. Please contact support with reference: ' + reference);
                    }
                } else {
                    // Payment failed - update order status
                    const orderId = localStorage.getItem('pendingOrderId');
                    if (orderId) {
                        await updateOrderPaymentStatus(orderId, 'failed');
                        localStorage.removeItem('pendingOrderId');
                    }

                    setStatus('failed');
                    setMessage(data.error || 'Payment verification failed.');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('failed');
                setMessage('An error occurred while verifying payment.');
            }
        }

        verifyAndFinalizePayment();
    }, [reference, router, updateOrderPaymentStatus, getOrderById, clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
                        <h1 className="text-2xl font-bold">Processing Payment</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
                        <p className="text-muted-foreground">{message}</p>
                        {orderNumber && <p className="text-sm font-mono bg-muted px-3 py-2 rounded-lg inline-block">Order: {orderNumber}</p>}
                        <div className="pt-4">
                            <Button asChild>
                                <Link href="/orders">View Orders</Link>
                            </Button>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
                        <p className="text-muted-foreground">{message}</p>
                        <div className="flex gap-3 justify-center pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/cart">Return to Cart</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/checkout">Try Again</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
