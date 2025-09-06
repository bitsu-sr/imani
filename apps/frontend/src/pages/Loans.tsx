import { useEffect, useState } from 'react';

type Borrower = { id: string; name: string };
type Loan = { id: string; borrower_id: string; principal: number; start_date: string; monthly_interest_rate: number; status: string };

export default function Loans() {
	const [borrowers, setBorrowers] = useState<Borrower[]>([]);
	const [loans, setLoans] = useState<Loan[]>([]);

	const [borrowerId, setBorrowerId] = useState('');
	const [principal, setPrincipal] = useState('');
	const [startDate, setStartDate] = useState('');
	const [rate, setRate] = useState('');
	const [agreement, setAgreement] = useState('flexible');

	const load = () => Promise.all([
		fetch('/api/borrowers').then(r => r.json()).then(setBorrowers),
		fetch('/api/loans').then(r => r.json()).then(setLoans),
	]);

	useEffect(() => { load(); }, []);

	async function addLoan() {
		if (!borrowerId || !principal || !startDate || !rate) return;
		await fetch('/api/loans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ borrower_id: borrowerId, principal: +principal, start_date: startDate, monthly_interest_rate: +rate, payment_agreement: agreement }) });
		setBorrowerId(''); setPrincipal(''); setStartDate(''); setRate('');
		load();
	}

	return (
		<div>
			<h2>Loans</h2>
			<div className="card">
				<div className="row">
					<select value={borrowerId} onChange={e => setBorrowerId(e.target.value)}>
						<option value="">Select borrower</option>
						{borrowers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
					</select>
					<input placeholder="Principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} />
					<input placeholder="Start date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
					<input placeholder="Monthly rate %" type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} />
					<select value={agreement} onChange={e => setAgreement(e.target.value)}>
						<option value="flexible">Flexible</option>
						<option value="fixed">Fixed</option>
					</select>
					<button onClick={addLoan}>Create</button>
				</div>
			</div>
			<table className="table">
				<thead><tr><th>Borrower</th><th>Principal</th><th>Rate %</th><th>Start</th><th>Status</th></tr></thead>
				<tbody>
					{loans.map(l => (
						<tr key={l.id}>
							<td>{borrowers.find(b => b.id === l.borrower_id)?.name || l.borrower_id}</td>
							<td>${Number(l.principal).toFixed(2)}</td>
							<td>{Number(l.monthly_interest_rate).toFixed(2)}</td>
							<td>{l.start_date}</td>
							<td>{l.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}


