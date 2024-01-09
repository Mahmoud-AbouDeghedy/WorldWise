import styles from "./Button.module.css";

export default function Button({
	children,
	onClick,
	type,
}: {
	children: JSX.Element | string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	type: string;
}) {
	return (
		<button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
			{children}
		</button>
	);
}
