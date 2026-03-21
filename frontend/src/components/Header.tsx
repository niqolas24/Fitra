interface HeaderProps {
  onReset?: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            AI Application Copilot
          </h1>
          <p className="text-xs text-gray-500">
            Resume × Job Description Analysis
          </p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-sm px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            New Analysis
          </button>
        )}
      </div>
    </header>
  );
}
