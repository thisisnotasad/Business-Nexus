function Input({ className, ...props }) {
  return (
    <input
      className={`w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

export default Input;