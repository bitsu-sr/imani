import { useEffect, useState } from 'react';

type Borrower = { id: string; name: string; contact?: string; notes?: string };

export default function Borrowers() {
	const [rows, setRows] = useState<Borrower[]>([]);
	const [name, setName] = useState('');
	const [contact, setContact] = useState('');
	const [notes, setNotes] = useState('');
	const [error, setError] = useState<string | null>(null);

	const load = () => fetch('/api/borrowers').then(r => r.json()).then(setRows).catch(e => setError(String(e)));

	useEffect(() => { load(); }, []);

	async function addBorrower() {
		if (!name.trim()) return;
		setError(null);
		await fetch('/api/borrowers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, contact, notes }) });
		setName(''); setContact(''); setNotes('');
		load();
	}

	async function removeBorrower(id: string) {
		if (!confirm('Are you sure you want to permanently delete this borrower?')) return;
		await fetch(`/api/borrowers?id=${id}`, { method: 'DELETE' });
		load();
	}

	return (
		<div>
			<h2>Borrowers</h2>
			{error && <div className="error">{error}</div>}
			<div className="card">
				<div className="row">
					<input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
					<input placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} />
					<input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
					<button onClick={addBorrower}>Add</button>
				</div>
			</div>
			<table className="table">
				<thead><tr><th>Name</th><th>Contact</th><th>Notes</th><th/></tr></thead>
				<tbody>
					{rows.map(b => (
						<tr key={b.id}>
							<td>{b.name}</td>
							<td>{b.contact}</td>
							<td>{b.notes}</td>
							<td><button onClick={() => removeBorrower(b.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}


