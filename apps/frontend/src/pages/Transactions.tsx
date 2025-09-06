import { useEffect, useState } from 'react';

type Loan = { id: string; };
type Tx = { id: string; loan_id: string; amount: number; date: string };

export default function Transactions() {
	const [loans, setLoans] = useState<Loan[]>([]);
	const [items, setItems] = useState<Tx[]>([]);
	const [loanId, setLoanId] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState('');

	const load = () => Promise.all([
		fetch('/api/loans').then(r => r.json()).then(setLoans),
		fetch('/api/transactions').then(r => r.json()).then(setItems),
	]);

	useEffect(() => { load(); }, []);

	async function addTx() {
		if (!loanId || !amount || !date) return;
		await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ loan_id: loanId, amount: +amount, date }) });
		setLoanId(''); setAmount(''); setDate('');
		load();
	}

	return (
		<div>
			<h2>Transactions</h2>
			<div className="card">
				<div className="row">
					<select value={loanId} onChange={e => setLoanId(e.target.value)}>
						<option value="">Select loan</option>
						{loans.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}
					</select>
					<input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
					<input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
					<button onClick={addTx}>Add</button>
				</div>
			</div>
			<table className="table">
				<thead><tr><th>Loan</th><th>Amount</th><th>Date</th></tr></thead>
				<tbody>
					{items.map(x => (
						<tr key={x.id}>
							<td>{x.loan_id}</td>
							<td>${Number(x.amount).toFixed(2)}</td>
							<td>{x.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}


