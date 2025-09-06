import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method === 'GET') {
			const { data, error } = await supabaseAdmin.from('borrowers').select('*').order('created_at', { ascending: false });
			if (error) throw error;
			return res.status(200).json(data);
		}

		if (req.method === 'POST') {
			const { name, contact, notes } = req.body || {};
			if (!name) return res.status(400).json({ error: 'Name is required' });
			const { data, error } = await supabaseAdmin.from('borrowers').insert({ name, contact, notes }).select('*').single();
			if (error) throw error;
			return res.status(201).json(data);
		}

		if (req.method === 'DELETE') {
			const { id } = req.query;
			if (!id) return res.status(400).json({ error: 'id is required' });
			const { error } = await supabaseAdmin.from('borrowers').delete().eq('id', id as string);
			if (error) throw error;
			return res.status(204).end();
		}

		return res.status(405).json({ error: 'Method not allowed' });
	} catch (e: any) {
		return res.status(500).json({ error: e.message });
	}
}


