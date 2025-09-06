import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method === 'GET') {
			const { loan_id } = req.query;
			let query = supabaseAdmin.from('transactions').select('*').order('date', { ascending: false });
			if (loan_id) query = query.eq('loan_id', loan_id as string);
			const { data, error } = await query;
			if (error) throw error;
			return res.status(200).json(data);
		}

		if (req.method === 'POST') {
			const { loan_id, amount, date } = req.body || {};
			if (!loan_id || !amount || !date) return res.status(400).json({ error: 'Missing required fields' });

			// Insert transaction. Allocation is handled by balance recompute endpoint on demand.
			const { data, error } = await supabaseAdmin
				.from('transactions')
				.insert({ loan_id, amount, date })
				.select('*')
				.single();
			if (error) throw error;
			return res.status(201).json(data);
		}

		return res.status(405).json({ error: 'Method not allowed' });
	} catch (e: any) {
		return res.status(500).json({ error: e.message });
	}
}


