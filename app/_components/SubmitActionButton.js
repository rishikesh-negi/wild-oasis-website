import SpinnerMini from "./SpinnerMini";

function SubmitActionButton({
  isPending,
  children,
  buttonText,
  onClick = null,
}) {
  return (
    <button
      className="relative bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={isPending}
      onClick={onClick}>
      <span className="invisible block">{buttonText}</span>
      <span className="absolute inset-0 flex items-center justify-center">
        {isPending ? <SpinnerMini /> : children}
      </span>
    </button>
  );
}

export default SubmitActionButton;
