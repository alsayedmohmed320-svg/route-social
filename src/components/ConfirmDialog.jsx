export default function ConfirmDialog({ title, message, confirmLabel = "تأكيد", danger, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-xl2 bg-white p-5 shadow-card dark:bg-ink-800 sm:rounded-xl2">
        <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
        {message && <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
