import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

type BalanceEntry = {
	date: string;
	interestAccrued: number;
	principalPaid: number;
	interestPaid: number;
	balance: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
		const { loan_id } = req.query;
		if (!loan_id) return res.status(400).json({ error: 'loan_id is required' });

		const { data: loan, error: loanErr } = await supabaseAdmin
			.from('loans')
			.select('*')
			.eq('id', loan_id as string)
			.single();
		if (loanErr || !loan) throw loanErr || new Error('Loan not found');

		const { data: txs, error: txErr } = await supabaseAdmin
			.from('transactions')
			.select('*')
			.eq('loan_id', loan_id as string)
			.order('date', { ascending: true });
		if (txErr) throw txErr;

		// Simulation: monthly compounding on month-end boundaries
		const monthlyRate = Number(loan.monthly_interest_rate);
		let balance = Number(loan.principal);
		const start = new Date(loan.start_date);
		const today = new Date();
		const timeline: BalanceEntry[] = [];

		// Index transactions by ISO date
		const paymentsByDate = new Map<string, number>();
		for (const t of txs || []) {
			const d = new Date(t.date);
			const key = d.toISOString().slice(0, 10);
			paymentsByDate.set(key, (paymentsByDate.get(key) || 0) + Number(t.amount));
		}

		// Iterate months from start to current
		let cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
		const endCursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
		while (cursor <= endCursor) {
			const monthEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
			// Apply interest at month end
			const interestForMonth = +(balance * monthlyRate / 100).toFixed(2);
			balance = +(balance + interestForMonth).toFixed(2);

			// Apply any payment made within this month (aggregate by day in this month)
			let principalPaidThisMonth = 0;
			let interestPaidThisMonth = 0;

			// Walk days in month
			for (let day = 1; day <= monthEnd.getUTCDate(); day++) {
				const dayKey = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), day)).toISOString().slice(0, 10);
				const payment = paymentsByDate.get(dayKey) || 0;
				if (payment > 0) {
					// Allocation: payment first to interest accrued in balance, then principal
					const interestPortion = Math.min(payment, interestForMonth - interestPaidThisMonth);
					interestPaidThisMonth += interestPortion;
					const principalPortion = payment - interestPortion;
					principalPaidThisMonth += principalPortion;
					balance = +(balance - principalPortion).toFixed(2);
				}
			}

			timeline.push({
				date: monthEnd.toISOString().slice(0, 10),
				interestAccrued: interestForMonth,
				principalPaid: +principalPaidThisMonth.toFixed(2),
				interestPaid: +interestPaidThisMonth.toFixed(2),
				balance: +balance.toFixed(2),
			});

			// Next month
			cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
		}

		return res.status(200).json({ balance: +balance.toFixed(2), timeline });
	} catch (e: any) {
		return res.status(500).json({ error: e.message });
	}
}


