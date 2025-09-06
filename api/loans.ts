import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method === 'GET') {
			const { borrower_id } = req.query;
			let query = supabaseAdmin.from('loans').select('*, borrower:borrowers(*))').order('created_at', { ascending: false });
			if (borrower_id) query = query.eq('borrower_id', borrower_id as string);
			const { data, error } = await query;
			if (error) throw error;
			return res.status(200).json(data);
		}

		if (req.method === 'POST') {
			const { borrower_id, principal, start_date, monthly_interest_rate, payment_agreement } = req.body || {};
			if (!borrower_id || !principal || !start_date || monthly_interest_rate == null) {
				return res.status(400).json({ error: 'Missing required fields' });
			}
			const { data, error } = await supabaseAdmin
				.from('loans')
				.insert({ borrower_id, principal, start_date, monthly_interest_rate, payment_agreement, status: 'active' })
				.select('*')
				.single();
			if (error) throw error;
			return res.status(201).json(data);
		}

		if (req.method === 'PATCH') {
			const { id, status } = req.body || {};
			if (!id) return res.status(400).json({ error: 'id is required' });
			const { data, error } = await supabaseAdmin.from('loans').update({ status }).eq('id', id).select('*').single();
			if (error) throw error;
			return res.status(200).json(data);
		}

		return res.status(405).json({ error: 'Method not allowed' });
	} catch (e: any) {
		return res.status(500).json({ error: e.message });
	}
}


