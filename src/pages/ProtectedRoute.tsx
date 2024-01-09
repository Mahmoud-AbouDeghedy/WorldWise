import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../Contexts/FakeAuthContext";

export default function ProtectedRoute({
	children,
}: {
	children: JSX.Element;
}) {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) navigate("/");
	}, [isAuthenticated, navigate]);

	return isAuthenticated ? children : null;
}
