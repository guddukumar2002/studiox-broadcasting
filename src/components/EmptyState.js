import PropTypes from "prop-types";
import { AlertCircle, Inbox } from "lucide-react";

export function EmptyState({ title = "No data found", message = "Nothing here yet.", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-400" />
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  title:   PropTypes.string,
  message: PropTypes.string,
  icon:    PropTypes.elementType,
};

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <p className="font-semibold text-gray-900">Failed to load</p>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 btn-secondary text-sm">
          Try again
        </button>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
