import { useEffect, useState } from 'react';

type Stats = {
	totalBorrowers: number;
	totalLoans: number;
	totalLent: number;
	totalRepaid: number;
}

export default function Dashboard() {
	const [stats, setStats] = useState<Stats | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch('/api/reports')
			.then(r => r.json())
			.then(setStats)
			.catch(e => setError(String(e)));
	}, []);

	return (
		<div>
			<h2>Dashboard</h2>
			{error && <div className="error">{error}</div>}
			<div className="grid">
				<div className="card"><div className="label">Total Lent</div><div className="value">${stats?.totalLent?.toFixed(2) || '0.00'}</div></div>
				<div className="card"><div className="label">Total Repaid</div><div className="value">${stats?.totalRepaid?.toFixed(2) || '0.00'}</div></div>
				<div className="card"><div className="label">Borrowers</div><div className="value">{stats?.totalBorrowers || 0}</div></div>
				<div className="card"><div className="label">Loans</div><div className="value">{stats?.totalLoans || 0}</div></div>
			</div>
		</div>
	);
}


