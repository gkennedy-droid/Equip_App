import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [equipment, templates, inspections, workOrders, users] = await Promise.all([
    prisma.equipment.findMany({ include: { leaders: { include: { user: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.template.findMany({ include: { items: true } }),
    prisma.inspection.findMany({ include: { equipment: true, workOrder: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.workOrder.findMany({ include: { inspection: { include: { equipment: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.user.findMany({ include: { role: true } })
  ]);

  return (
    <>
      <div className="card">
        <p>Signed in as {session.name} ({session.role})</p>
        <form method="post" action="/api/auth/logout"><button type="submit">Logout</button></form>
      </div>

      <div className="row">
        <form className="card" method="post" action="/api/equipment">
          <h3>Register Equipment</h3>
          <input name="assetTag" placeholder="Asset Tag" required />
          <input name="name" placeholder="Name" required />
          <input name="model" placeholder="Model" required />
          <input name="serialNumber" placeholder="Serial" />
          <input name="location" placeholder="Location" required />
          <button type="submit">Create Equipment</button>
        </form>

        <form className="card" method="post" action="/api/team-leaders">
          <h3>Assign Team Leader</h3>
          <select name="userId" required>{users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.role.name})</option>)}</select>
          <select name="equipmentId" required>{equipment.map(e => <option key={e.id} value={e.id}>{e.assetTag} - {e.name}</option>)}</select>
          <button type="submit">Assign</button>
        </form>
      </div>

      <div className="row">
        <form className="card" method="post" action="/api/templates">
          <h3>Create Template</h3>
          <input name="name" placeholder="Template Name" required />
          <textarea name="description" placeholder="Description" />
          <textarea name="items" placeholder="Comma separated check items" required />
          <button type="submit">Create Template</button>
        </form>

        <form className="card" method="post" action="/api/inspections">
          <h3>Run Inspection</h3>
          <select name="equipmentId" required>{equipment.map(e => <option key={e.id} value={e.id}>{e.assetTag} - {e.name}</option>)}</select>
          <select name="templateId">{templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <select name="status" required>
            <option value="GREEN">GREEN</option>
            <option value="YELLOW">YELLOW</option>
            <option value="RED">RED</option>
          </select>
          <textarea name="notes" placeholder="Inspection notes" />
          <button type="submit">Submit Inspection</button>
        </form>
      </div>

      <div className="card">
        <h3>Equipment Registry</h3>
        <ul>{equipment.map((e) => <li key={e.id}>{e.assetTag} • {e.name} • {e.location} • Leaders: {e.leaders.map(l => l.user.fullName).join(', ') || 'None'}</li>)}</ul>
      </div>

      <div className="card">
        <h3>Templates</h3>
        <ul>{templates.map(t => <li key={t.id}>{t.name} ({t.items.length} items)</li>)}</ul>
      </div>

      <div className="card">
        <h3>Recent Inspections (Stoplight)</h3>
        <ul>{inspections.map(i => <li key={i.id}>{i.equipment.assetTag} <span className={`stoplight ${i.status.toLowerCase()}`}>{i.status}</span> {i.workOrder ? `• WO ${i.workOrder.id}` : ''}</li>)}</ul>
      </div>

      <div className="card">
        <h3>Work Orders</h3>
        <ul>{workOrders.map(w => <li key={w.id}>{w.inspection.equipment.assetTag} • {w.summary} • {w.status}</li>)}</ul>
      </div>
    </>
  );
}
