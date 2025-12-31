import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const { email, amount, reference, callbackUrl, metadata } = await request.json();

        if (!PAYSTACK_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Paystack secret key not configured' },
                { status: 500 }
            );
        }

        // Initialize transaction with Paystack
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
                reference,
                callback_url: callbackUrl,
                metadata,
            }),
        });

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json(
                { error: data.message || 'Failed to initialize transaction' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            authorizationUrl: data.data.authorization_url,
            accessCode: data.data.access_code,
            reference: data.data.reference,
        });
    } catch (error) {
        console.error('Paystack initialization error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
