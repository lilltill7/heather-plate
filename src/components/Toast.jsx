export default function Toast({ message }) {
  return (
    <div className={`toast-wrap${message ? ' show' : ''}`}>
      {message}
    </div>
  );
}
