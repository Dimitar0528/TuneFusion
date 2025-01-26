import { Link, useNavigate } from "react-router";

export default function TransitionLink({ to, children, className }) {
  const navigate = useNavigate();

  function handleNavigation(to) {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition(() => {
      navigate(to);
    });
  }

  return (
    <Link
      to={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(to);
      }}>
      {children}
    </Link>
  );
}
