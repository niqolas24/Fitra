interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function AnalyzeButton({ onClick, disabled, loading }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-10 py-3.5 rounded-xl font-semibold text-base
        transition-all duration-200
        ${
          disabled
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Analyzing...
        </span>
      ) : (
        "Analyze My Resume"
      )}
    </button>
  );
}
