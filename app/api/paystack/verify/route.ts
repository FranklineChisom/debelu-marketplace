import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json(
                { error: 'Reference is required' },
                { status: 400 }
            );
        }

        if (!PAYSTACK_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Paystack secret key not configured' },
                { status: 500 }
            );
        }

        // Verify transaction with Paystack
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json(
                { error: data.message || 'Failed to verify transaction' },
                { status: 400 }
            );
        }

        const transaction = data.data;

        return NextResponse.json({
            status: transaction.status, // 'success', 'failed', 'abandoned'
            reference: transaction.reference,
            amount: transaction.amount / 100, // Convert from kobo to Naira
            paidAt: transaction.paid_at,
            channel: transaction.channel,
            currency: transaction.currency,
            metadata: transaction.metadata,
        });
    } catch (error) {
        console.error('Paystack verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
