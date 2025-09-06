import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function LoanDetails() {
	const { id } = useParams();
	const [timeline, setTimeline] = useState<any[]>([]);
	const [balance, setBalance] = useState<number>(0);

	useEffect(() => {
		if (!id) return;
		fetch(`/api/interest?loan_id=${id}`).then(r => r.json()).then(d => { setTimeline(d.timeline); setBalance(d.balance); });
	}, [id]);

	return (
		<div>
			<h2>Loan Details</h2>
			<div className="card"><div className="label">Current Balance</div><div className="value">${balance.toFixed(2)}</div></div>
			<table className="table">
				<thead><tr><th>Date</th><th>Interest</th><th>Interest Paid</th><th>Principal Paid</th><th>Balance</th></tr></thead>
				<tbody>
					{timeline.map((e, i) => (
						<tr key={i}>
							<td>{e.date}</td>
							<td>${Number(e.interestAccrued).toFixed(2)}</td>
							<td>${Number(e.interestPaid).toFixed(2)}</td>
							<td>${Number(e.principalPaid).toFixed(2)}</td>
							<td>${Number(e.balance).toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}


