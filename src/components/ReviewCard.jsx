export default function ReviewCard({
  title,
  description,
  buttonText,
}) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-slate-800">
        {title}
      </h2>

      <p className="text-slate-600 mt-2">
        {description}
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        {buttonText}
      </button>
    </div>
  );
}