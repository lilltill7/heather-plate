export default function Topbar({ breadcrumb, onDetect, onNew }) {
  return (
    <div className="topbar">
      <div className="topbar-breadcrumb">
        <strong>{breadcrumb}</strong>
      </div>
      <div className="topbar-spacer" />
      <button className="btn btn-outline" onClick={onDetect}>
        ✦ Detect Recipe
      </button>
      <button className="btn btn-gold" onClick={onNew}>
        + New
      </button>
    </div>
  );
}
