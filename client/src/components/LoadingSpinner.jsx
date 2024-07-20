export default function LoadingSpinner({ isLoading }) {
  return (
    isLoading && (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <h2>Loading...</h2>
      </div>
    )
  );
}
