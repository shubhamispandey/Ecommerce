export default function EmptyState({ message = "No data found" }) {
  return (
    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
      {message}
    </div>
  );
}
