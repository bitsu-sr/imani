import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

		const [{ data: borrowers }, { data: loans }, { data: txs }] = await Promise.all([
			supabaseAdmin.from('borrowers').select('*'),
			supabaseAdmin.from('loans').select('*'),
			supabaseAdmin.from('transactions').select('*'),
		]);

		const totalLent = (loans || []).reduce((s, l: any) => s + Number(l.principal), 0);
		const totalRepaid = (txs || []).reduce((s, t: any) => s + Number(t.amount), 0);
		// Interest earned would require timeline; for now return 0 and let frontend call /api/interest per loan to aggregate.
		return res.status(200).json({
			totalBorrowers: borrowers?.length || 0,
			totalLoans: loans?.length || 0,
			totalLent,
			totalRepaid,
		});
	} catch (e: any) {
		return res.status(500).json({ error: e.message });
	}
}


