import { AlertCircle, SearchX } from "lucide-react";

export function EmptyState({ title = "No data found", message = "Nothing to show here yet.", icon: Icon = SearchX }) {
  return (
    <div className="bg-white py-20 rounded-[3rem] border border-slate-100 text-center shadow-sm">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 mt-2 max-w-xs mx-auto">{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="bg-red-50 py-16 rounded-[3rem] border border-red-100 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-red-700">Error</h3>
      <p className="text-red-500 mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-6 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
